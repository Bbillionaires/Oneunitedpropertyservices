import { services } from './services';
import type { IconName } from '@/components/icons';

/**
 * Quote form configuration. The UI is generated from this file, so options,
 * labels, and conditional fields can change without touching the component.
 * Field `name`s become keys in the submitted payload (see src/lib/quote).
 */
export interface ChoiceOption {
  value: string;
  label: string;
  icon?: IconName;
  hint?: string;
}

export const propertyOptions: ChoiceOption[] = [
  { value: 'apartment', label: 'Apartment Community', icon: 'building' },
  { value: 'multifamily', label: 'Multifamily', icon: 'townhome' },
  { value: 'commercial', label: 'Commercial', icon: 'office' },
  { value: 'retail', label: 'Retail', icon: 'store' },
  { value: 'office', label: 'Office', icon: 'briefcase' },
  { value: 'hoa', label: 'HOA / Community', icon: 'community' },
  { value: 'other', label: 'Other', icon: 'dots' },
];

export const serviceOptions: ChoiceOption[] = [
  ...services.map((s) => ({ value: s.quoteValue, label: s.quoteLabel, icon: s.icon })),
  { value: 'other', label: 'Other', icon: 'dots' },
];

export const frequencyOptions: ChoiceOption[] = [
  { value: 'one-time', label: 'One Time', hint: 'A single project' },
  { value: 'weekly', label: 'Weekly', hint: 'Every week' },
  { value: 'biweekly', label: 'Biweekly', hint: 'Every two weeks' },
  { value: 'monthly', label: 'Monthly', hint: 'Once a month' },
  { value: 'recurring', label: 'Recurring / Custom', hint: 'A tailored schedule' },
  { value: 'not-sure', label: 'Not Sure', hint: 'Help me decide' },
];

export const contactMethodOptions: ChoiceOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone call' },
  { value: 'text', label: 'Text message' },
];

export interface SizeField {
  name: string;
  label: string;
  type: 'number' | 'text';
  placeholder?: string;
  autocomplete?: string;
  required?: boolean;
  /** Property-type values this field applies to. Omit to always show. */
  showFor?: string[];
  inputmode?: 'numeric' | 'text';
}

export const sizeFields: SizeField[] = [
  {
    name: 'units',
    label: 'Number of units',
    type: 'number',
    inputmode: 'numeric',
    placeholder: 'e.g. 240',
    showFor: ['apartment', 'multifamily', 'hoa', 'other'],
  },
  {
    name: 'buildings',
    label: 'Number of buildings',
    type: 'number',
    inputmode: 'numeric',
    placeholder: 'e.g. 12',
  },
  {
    name: 'squareFeet',
    label: 'Approximate square footage',
    type: 'number',
    inputmode: 'numeric',
    placeholder: 'e.g. 45000',
    showFor: ['commercial', 'retail', 'office', 'other'],
  },
  {
    name: 'propertyCount',
    label: 'How many properties?',
    type: 'number',
    inputmode: 'numeric',
    placeholder: '1',
  },
  {
    name: 'address',
    label: 'Property address',
    type: 'text',
    placeholder: 'Street, city, ZIP',
    autocomplete: 'street-address',
    required: true,
  },
];

export const uploadLimits = {
  maxFiles: 8,
  maxFileMB: 10,
  accept: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
};

export const quoteSteps = [
  { id: 'property', title: 'Property type', question: 'What type of property do you manage?' },
  { id: 'services', title: 'Services', question: 'What services do you need?' },
  { id: 'size', title: 'Property details', question: 'Tell us about the property.' },
  { id: 'frequency', title: 'Frequency', question: 'How often do you need service?' },
  { id: 'photos', title: 'Photos', question: 'Have photos of the property? Add them here.' },
  { id: 'contact', title: 'Contact', question: 'How can we reach you?' },
  { id: 'review', title: 'Review', question: 'Review your request.' },
] as const;
