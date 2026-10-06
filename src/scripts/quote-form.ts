/**
 * Multi-step quote form controller.
 * Progressive: validation, conditional fields, uploads, review, and submit.
 * Delivery is delegated to src/lib/quote.ts.
 */
import { submitQuote, QuoteSubmitError, type QuoteRequest } from '@/lib/quote';
import { propertyOptions, serviceOptions, frequencyOptions, contactMethodOptions, quoteSteps } from '@/data/quoteForm';

const labelOf = (opts: { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label ?? v;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function initQuoteForms() {
  document.querySelectorAll<HTMLElement>('[data-quote-form]').forEach((root) => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    new QuoteForm(root);
  });
}

class QuoteForm {
  private form: HTMLFormElement;
  private steps: HTMLFieldSetElement[];
  private index = 0;
  private maxReached = 0;
  private files: File[] = [];
  private previews = new Map<File, string>();
  /** True when the latest choice came from a pointer (not arrow keys). */
  private pointerPick = false;

  constructor(private root: HTMLElement) {
    this.form = root.querySelector('form')!;
    this.steps = Array.from(root.querySelectorAll<HTMLFieldSetElement>('.qf__step'));

    this.q('[data-next]').addEventListener('click', () => this.next());
    this.q('[data-back]').addEventListener('click', () => this.go(this.index - 1));
    this.q('[data-restart]').addEventListener('click', () => this.restart());
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      void this.submit();
    });
    // Enter in a text field advances instead of submitting early.
    this.form.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement;
      if (e.key === 'Enter' && t instanceof HTMLInputElement && t.type !== 'file') {
        e.preventDefault();
        if (this.index < this.steps.length - 1) this.next();
      }
    });
    root.querySelectorAll<HTMLButtonElement>('[data-goto]').forEach((b) =>
      b.addEventListener('click', () => this.go(Number(b.dataset.goto))),
    );

    this.form.addEventListener('pointerdown', () => (this.pointerPick = true));
    this.form.addEventListener('keydown', () => (this.pointerPick = false), true);
    this.form.addEventListener('change', (e) => this.onChange(e));
    this.form.addEventListener('input', (e) => this.clearError((e.target as HTMLInputElement).name));

    this.initUploads();
    this.prefill();
    this.applyConditional();
    this.render(null);
  }

  private q<T extends HTMLElement = HTMLElement>(sel: string) {
    return this.root.querySelector<T>(sel)!;
  }
  private field(name: string) {
    return this.form.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;
  }
  private value(name: string) {
    const el = this.field(name);
    if (!el) return '';
    return (el as HTMLInputElement | RadioNodeList).value?.trim?.() ?? '';
  }
  private checked(name: string) {
    return Array.from(this.form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)).map((i) => i.value);
  }

  /* ---------- Prefill from URL (?program=portfolio&service=painting&property=office) ---------- */
  private prefill() {
    const params = new URLSearchParams(location.search);
    const program = params.get('program');
    if (program) {
      (this.field('program') as HTMLInputElement).value = program;
      const freq = program === 'one-time' ? 'one-time' : program === 'custom' ? 'not-sure' : 'recurring';
      this.setRadio('frequency', freq);
    }
    params.getAll('service').forEach((s) => {
      const box = this.form.querySelector<HTMLInputElement>(`input[name="services"][value="${CSS.escape(s)}"]`);
      if (box) box.checked = true;
    });
    const property = params.get('property');
    if (property) this.setRadio('propertyType', property);
    this.toggleOther();
  }
  private setRadio(name: string, value: string) {
    const r = this.form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(value)}"]`);
    if (r) r.checked = true;
  }

  /* ---------- Change handling & conditional fields ---------- */
  private onChange(e: Event) {
    const t = e.target as HTMLInputElement;
    this.clearError(t.name);
    if (t.name === 'propertyType') {
      this.applyConditional();
      // Clicking/tapping a property type advances automatically; keyboard users
      // moving through the radio group with arrow keys are never jumped ahead.
      if (this.pointerPick) window.setTimeout(() => this.index === 0 && this.next(), 280);
    }
    if (t.name === 'services') this.toggleOther();
  }

  private applyConditional() {
    const type = this.value('propertyType');
    this.form.querySelectorAll<HTMLElement>('[data-show-for]').forEach((wrap) => {
      const list = wrap.dataset.showFor?.split(' ').filter(Boolean) ?? [];
      const show = !type || list.length === 0 || list.includes(type);
      wrap.hidden = !show;
      wrap.querySelectorAll('input').forEach((i) => (i.disabled = !show));
    });
  }

  private toggleOther() {
    const wrap = this.form.querySelector<HTMLElement>('[data-other-field]');
    if (!wrap) return;
    const on = this.checked('services').includes('other');
    wrap.hidden = !on;
    const input = wrap.querySelector('input')!;
    input.disabled = !on;
    if (!on) this.clearError('servicesOther');
  }

  /* ---------- Validation ---------- */
  private setError(name: string, message: string) {
    const msg = this.form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (msg) {
      msg.textContent = message;
      msg.hidden = false;
    }
    this.form.querySelectorAll<HTMLInputElement>(`[name="${name}"]`).forEach((i) => i.setAttribute('aria-invalid', 'true'));
  }
  private clearError(name: string) {
    if (!name) return;
    const msg = this.form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (msg) msg.hidden = true;
    this.form.querySelectorAll<HTMLInputElement>(`[name="${name}"]`).forEach((i) => i.removeAttribute('aria-invalid'));
    this.status(null);
  }

  private validate(i: number): boolean {
    const id = quoteSteps[i].id;
    const errors: [string, string][] = [];
    if (id === 'property' && !this.value('propertyType')) errors.push(['propertyType', 'Choose the type of property.']);
    if (id === 'services') {
      const s = this.checked('services');
      if (!s.length) errors.push(['services', 'Select at least one service.']);
      if (s.includes('other') && !this.value('servicesOther'))
        errors.push(['servicesOther', 'Tell us which other service you need.']);
    }
    if (id === 'size') {
      if (!this.value('address')) errors.push(['address', 'Enter the property address.']);
      ['units', 'buildings', 'squareFeet', 'propertyCount'].forEach((n) => {
        const el = this.field(n) as HTMLInputElement | null;
        if (el && !el.disabled && el.value && (Number.isNaN(Number(el.value)) || Number(el.value) < 0))
          errors.push([n, 'Enter a valid number.']);
      });
    }
    if (id === 'frequency' && !this.value('frequency')) errors.push(['frequency', 'Choose how often you need service.']);
    if (id === 'contact') {
      if (!this.value('name')) errors.push(['name', 'Enter your name.']);
      const phoneDigits = this.value('phone').replace(/\D/g, '');
      if (phoneDigits.length < 10) errors.push(['phone', 'Enter a phone number including area code.']);
      const email = this.value('email');
      if (!email) errors.push(['email', 'Enter your email address.']);
      else if (!EMAIL_RE.test(email)) errors.push(['email', 'Enter a valid email address, like name@company.com.']);
    }

    errors.forEach(([n, m]) => this.setError(n, m));
    if (errors.length) {
      this.status(errors.length === 1 ? errors[0][1] : `Please fix ${errors.length} items before continuing.`);
      const first = this.steps[i].querySelector<HTMLElement>(`[name="${errors[0][0]}"]:not([type="hidden"])`);
      first?.focus();
    }
    return errors.length === 0;
  }

  private status(message: string | null) {
    const el = this.q('[data-status]');
    el.hidden = !message;
    el.textContent = message ?? '';
  }

  /* ---------- Navigation ---------- */
  private next() {
    if (!this.validate(this.index)) return;
    this.go(this.index + 1);
  }

  private go(target: number) {
    if (target < 0 || target >= this.steps.length || target === this.index) return;
    if (target > this.index) {
      // Never skip past an invalid step.
      for (let i = this.index; i < target; i++) {
        if (!this.validate(i)) {
          if (i !== this.index) this.go(i);
          return;
        }
      }
    }
    const dir = target > this.index ? 'fwd' : 'back';
    this.index = target;
    this.maxReached = Math.max(this.maxReached, target);
    this.status(null);
    this.render(dir);
  }

  private render(dir: 'fwd' | 'back' | null) {
    const total = this.steps.length;
    this.steps.forEach((s, i) => {
      s.hidden = i !== this.index;
      s.classList.remove('enter-fwd', 'enter-back');
    });
    const current = this.steps[this.index];
    if (dir) {
      void current.offsetWidth;
      current.classList.add(dir === 'fwd' ? 'enter-fwd' : 'enter-back');
    }

    const step = quoteSteps[this.index];
    this.q('[data-current]').textContent = String(this.index + 1);
    this.q('[data-step-name]').textContent = step.title;
    const bar = this.q('[role="progressbar"]');
    bar.setAttribute('aria-valuenow', String(this.index + 1));
    bar.setAttribute('aria-valuetext', `Step ${this.index + 1} of ${total}: ${step.title}`);
    bar.style.setProperty('--progress', String((this.index + 1) / total));
    this.q('.qf__bar-fill').style.setProperty('--progress', String((this.index + 1) / total));

    this.root.querySelectorAll<HTMLButtonElement>('[data-goto]').forEach((b) => {
      const i = Number(b.dataset.goto);
      b.disabled = i > this.maxReached;
      b.classList.toggle('is-current', i === this.index);
      b.classList.toggle('is-done', i < this.index || (i <= this.maxReached && i !== this.index));
      if (i === this.index) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });

    const last = this.index === total - 1;
    (this.q<HTMLButtonElement>('[data-back]')).disabled = this.index === 0;
    this.q('[data-next]').hidden = last;
    this.q('[data-submit]').hidden = !last;
    this.q('[data-next-label]').textContent = this.index === total - 2 ? 'Review Request' : 'Continue';
    if (last) this.buildReview();

    if (dir) {
      current.querySelector<HTMLElement>('.qf__q')?.focus({ preventScroll: true });
      const top = this.root.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) {
        const headerH = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
        const y = window.scrollY + top - headerH - 16;
        if (window.__scroller) window.__scroller.scrollTo(y);
        else window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  /* ---------- Uploads ---------- */
  private initUploads() {
    const input = this.root.querySelector<HTMLInputElement>('.drop__input');
    const drop = this.root.querySelector<HTMLElement>('[data-drop]');
    if (!input || !drop) return;
    const maxFiles = Number(input.dataset.maxFiles) || 8;
    const maxBytes = (Number(input.dataset.maxMb) || 10) * 1024 * 1024;
    const accept = input.accept.split(',');

    const add = (list: FileList | null) => {
      if (!list) return;
      const problems: string[] = [];
      for (const file of Array.from(list)) {
        const okType = accept.includes(file.type) || /\.(heic|heif)$/i.test(file.name);
        if (!okType) problems.push(`${file.name} isn’t a supported image type.`);
        else if (file.size > maxBytes) problems.push(`${file.name} is larger than ${input.dataset.maxMb}MB.`);
        else if (this.files.length >= maxFiles) {
          problems.push(`You can add up to ${maxFiles} photos.`);
          break;
        } else if (!this.files.some((f) => f.name === file.name && f.size === file.size)) this.files.push(file);
      }
      input.value = '';
      if (problems.length) this.setError('photos', problems.join(' '));
      else this.clearError('photos');
      this.renderThumbs();
    };

    input.addEventListener('change', () => add(input.files));
    ['dragenter', 'dragover'].forEach((ev) =>
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.add('is-over');
      }),
    );
    ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('is-over')));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      add((e as DragEvent).dataTransfer?.files ?? null);
    });
  }

  private renderThumbs() {
    const list = this.q('[data-thumbs]');
    list.replaceChildren(
      ...this.files.map((file, i) => {
        const li = document.createElement('li');
        if (!this.previews.has(file)) this.previews.set(file, URL.createObjectURL(file));
        const img = document.createElement('img');
        img.src = this.previews.get(file)!;
        img.alt = '';
        img.onerror = () => img.remove(); // e.g. HEIC previews in browsers without support
        const name = document.createElement('span');
        name.className = 'thumb__name';
        name.textContent = file.name;
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'thumb__remove';
        rm.setAttribute('aria-label', `Remove ${file.name}`);
        rm.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
        rm.addEventListener('click', () => {
          URL.revokeObjectURL(this.previews.get(file)!);
          this.previews.delete(file);
          this.files.splice(i, 1);
          this.renderThumbs();
          this.root.querySelector<HTMLElement>('.drop__input')?.focus();
        });
        li.append(img, name, rm);
        return li;
      }),
    );
  }

  /* ---------- Review & submit ---------- */
  private payload(): QuoteRequest {
    const num = (n: string) => {
      const el = this.field(n) as HTMLInputElement | null;
      return el && !el.disabled && el.value !== '' ? Number(el.value) : undefined;
    };
    return {
      propertyType: this.value('propertyType'),
      services: this.checked('services'),
      servicesOther: this.checked('services').includes('other') ? this.value('servicesOther') : undefined,
      units: num('units'),
      buildings: num('buildings'),
      squareFeet: num('squareFeet'),
      propertyCount: num('propertyCount'),
      address: this.value('address'),
      frequency: this.value('frequency'),
      program: this.value('program') || undefined,
      notes: this.value('notes') || undefined,
      name: this.value('name'),
      company: this.value('company') || undefined,
      phone: this.value('phone'),
      email: this.value('email'),
      preferredContact: this.value('preferredContact') || 'email',
      source: location.pathname,
      submittedAt: new Date().toISOString(),
    };
  }

  private buildReview() {
    const p = this.payload();
    const fmt = (n?: number) => (n === undefined ? null : n.toLocaleString());
    const size = [
      p.units !== undefined && `${fmt(p.units)} units`,
      p.buildings !== undefined && `${fmt(p.buildings)} buildings`,
      p.squareFeet !== undefined && `${fmt(p.squareFeet)} sq ft`,
      p.propertyCount !== undefined && `${fmt(p.propertyCount)} properties`,
    ].filter(Boolean);
    const services = p.services.map((s) => (s === 'other' && p.servicesOther ? `Other: ${p.servicesOther}` : labelOf(serviceOptions, s)));

    const rows: [string, string, number][] = [
      ['Property type', labelOf(propertyOptions, p.propertyType), 0],
      ['Services', services.join(', '), 1],
      ['Property', [p.address, ...size].join(' · '), 2],
      ['Frequency', labelOf(frequencyOptions, p.frequency) + (p.notes ? ` — “${p.notes}”` : ''), 3],
      ['Photos', this.files.length ? `${this.files.length} photo${this.files.length > 1 ? 's' : ''} attached` : 'None', 4],
      [
        'Contact',
        [p.name, p.company, p.phone, p.email, `Prefers ${labelOf(contactMethodOptions, p.preferredContact).toLowerCase()}`]
          .filter(Boolean)
          .join(' · '),
        5,
      ],
    ];

    const dl = this.q('[data-review]');
    dl.replaceChildren(
      ...rows.map(([label, value, step]) => {
        const row = document.createElement('div');
        row.className = 'review__row';
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value || '—';
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'review__edit';
        edit.textContent = 'Edit';
        edit.setAttribute('aria-label', `Edit ${label.toLowerCase()}`);
        edit.addEventListener('click', () => this.go(step));
        row.append(dt, edit, dd);
        return row;
      }),
    );
  }

  private async submit() {
    for (let i = 0; i < this.steps.length - 1; i++) {
      if (!this.validate(i)) {
        this.go(i);
        return;
      }
    }
    // Bot trap: silently stop if the honeypot was filled.
    if (this.value('website')) return;

    const btn = this.q<HTMLButtonElement>('[data-submit]');
    const label = this.q('[data-submit-label]');
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    label.textContent = 'Submitting…';

    try {
      const result = await submitQuote(this.payload(), this.files);
      const done = this.q('[data-done]');
      const name = this.value('name').split(' ')[0];
      if (result.status === 'sent') {
        this.q('[data-done-title]').textContent = 'Request received';
        this.q('[data-done-text]').textContent = `Thanks${name ? `, ${name}` : ''}. Your property quote request has been sent. We’ll follow up using your preferred contact method.`;
        this.q('[data-done-preview]').hidden = true;
      } else {
        this.q('[data-done-title]').textContent = 'Request ready';
        this.q('[data-done-text]').textContent = `Thanks${name ? `, ${name}` : ''}. Your request was completed successfully in this preview.`;
        this.q('[data-done-preview]').hidden = false;
      }
      this.form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch (err) {
      this.status(err instanceof QuoteSubmitError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      btn.classList.remove('is-loading');
      btn.removeAttribute('aria-busy');
      label.textContent = 'Submit Request';
    }
  }

  private restart() {
    this.form.reset();
    this.previews.forEach((url) => URL.revokeObjectURL(url));
    this.previews.clear();
    this.files = [];
    this.renderThumbs();
    this.toggleOther();
    this.applyConditional();
    this.index = 0;
    this.maxReached = 0;
    this.form.hidden = false;
    this.q('[data-done]').hidden = true;
    this.render(null);
    this.steps[0].querySelector<HTMLElement>('.qf__q')?.focus();
  }
}
