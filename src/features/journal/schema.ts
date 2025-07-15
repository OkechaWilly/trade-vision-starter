import { z } from 'zod';

export const entrySchema = z.object({
  user_id: z.string().uuid(),
  title: z.string().optional(),
  content: z.string().min(10, "Entry must be at least 10 characters long"),
  mood: z.enum(['happy', 'neutral', 'sad', 'angry', 'anxious']).optional(),
  tags: z.array(z.string().max(15, "Tag must be 15 characters or less")).optional().default([])
});

export const updateEntrySchema = entrySchema.partial().omit({ user_id: true });

export type EntryInput = z.infer<typeof entrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;