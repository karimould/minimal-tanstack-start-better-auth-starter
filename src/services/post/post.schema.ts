import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  content: z.string().min(1, "Content is required"),
});

export type CreatePostSchema = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters").optional(),
  content: z.string().min(1, "Content is required").optional(),
}).refine((data) => data.title !== undefined || data.content !== undefined, {
  message: "At least one field (title or content) must be provided for update",
});

export type UpdatePostSchema = z.infer<typeof UpdatePostSchema>;

export const DeletePostSchema = z.object({
  id: z.string(),
});

export type DeletePostSchema = z.infer<typeof DeletePostSchema>;

export const GetPostSchema = z.object({
  id: z.string(),
});

export type GetPostSchema = z.infer<typeof GetPostSchema>;