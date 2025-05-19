import {z} from 'zod';

export const formSubmissionSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
});

export const partialFormSubmissionSchema = formSubmissionSchema.partial();

export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>;
export type PartialFormSubmissionInput = z.infer<typeof partialFormSubmissionSchema>;