/**
 * Minimal stroke icon set (24×24 viewBox, drawn with currentColor).
 * Each entry is the inner SVG markup. Add icons here and reference them by name.
 */
export const icons = {
  lawn: '<path d="M3 20h18"/><path d="M5 20c0-4 1-7 2-9M8 20c0-3 .5-6 2-8.5M12 20c0-5 0-8 0-11M16 20c0-3-.5-6-2-8.5M19 20c0-4-1-7-2-9"/>',
  spray:
    '<path d="M4 15h6l2-3V8H6L4 11z"/><path d="M12 10h3"/><path d="M15 10l5-3M15 10l5 0M15 10l5 3"/><path d="M6 15v5h4v-5"/>',
  paint:
    '<rect x="3" y="3" width="14" height="6" rx="1.5"/><path d="M17 6h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-8v3"/><rect x="9.5" y="14" width="3" height="7" rx="1"/>',
  sprayer:
    '<path d="M9 8h5v3l2 2v8H7v-8l2-2z"/><path d="M10 8V5h3v3"/><path d="M13 5h3l2-2"/><path d="M19 7h1M19 10h2M18 4.5l1-1"/>',
  sparkle:
    '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/><path d="M5.5 15l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5L3.4 17l1.5-.6z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l2 2M14 9l2 2"/>',
  wrench:
    '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5"/><path d="M14.5 6.5L17 4l3 3-2.5 2.5"/>',
  building:
    '<path d="M4 21V5l8-2v18"/><path d="M12 21V9l8 2v10"/><path d="M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>',
  townhome: '<path d="M2 21h20"/><path d="M3 21V10l4.5-4L12 10v11"/><path d="M12 21V10l4.5-4L21 10v11"/><path d="M6 21v-5h3v5M15 21v-5h3v5"/>',
  office: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/><path d="M10 21v-3h4v3"/>',
  store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v9h14v-9"/><path d="M10 21v-5h4v5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  community:
    '<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2.2"/><circle cx="19" cy="10" r="2.2"/><path d="M6.5 20a5.5 5.5 0 0 1 11 0"/><path d="M1.5 19a3.5 3.5 0 0 1 4.5-3.3M22.5 19a3.5 3.5 0 0 0-4.5-3.3"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  repeat: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  handshake:
    '<path d="M2 11l4-4 4 2 3-2 3 1 6 3"/><path d="M2 11l6 6 2-1 2 2 2-1 2 1 4-5"/><path d="M10 9l-2 3 2 1 3-2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 15l2.5 2.5L16 13"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowUpRight: '<path d="M7 17L17 7M8 7h9v9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  drag: '<path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h6M9 18h3"/>',
} as const;

export type IconName = keyof typeof icons;
