import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  goals: z.string().optional(),
});

export const connectionSchema = z.object({
  toUserId: z.string().uuid('Invalid user ID'),
});

export const updateConnectionSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
});

export const photoSchema = z.object({
  url: z.string().url('Invalid URL'),
  filename: z.string().min(1, 'Filename is required'),
});

export const reorderPhotosSchema = z.object({
  photoIds: z.array(z.string().uuid()),
});
