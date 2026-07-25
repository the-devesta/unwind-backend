import { z } from 'zod';

export const ClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export const QuotationItemSchema = z.object({
  description: z.string().min(1, 'Item description required'),
  amount: z.number().positive('Amount must be positive'),
});

export const QuotationSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  title: z.string().min(3, 'Title is required'),
  items: z.array(QuotationItemSchema).min(1, 'At least one line item is required'),
  totalAmount: z.number().positive(),
});

export const InvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  items: z.array(QuotationItemSchema).min(1, 'At least one line item is required'),
  totalAmount: z.number().positive(),
  gstAmount: z.number().nonnegative(),
});

export type ClientInput = z.infer<typeof ClientSchema>;
export type QuotationInput = z.infer<typeof QuotationSchema>;
export type InvoiceInput = z.infer<typeof InvoiceSchema>;
