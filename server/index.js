import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

const emailSchema = z.string().email().max(254);
const submitSchema = z.object({ email: emailSchema });
const todoSchema = z.object({
  title: z.string().min(1).max(200).refine((s) => s.trim().length > 0, 'Title cannot be empty'),
  isCompleted: z.boolean().optional(),
});

// Helper sanitizer (basic) - remove script tags
function sanitizeString(input) {
  return input.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
}

app.post('/api/submit', (req, res) => {
  try {
    const parsed = submitSchema.parse(req.body);
    // Server-side enforcement / logging / further checks would go here
    return res.json({ message: 'Received', data: parsed });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid payload', details: err.errors ?? err.message });
  }
});

app.post('/api/users/forgot-password', (req, res) => {
  try {
    submitSchema.parse(req.body);
    return res.json({ message: 'If that email exists we sent reset instructions.' });
  } catch {
    return res.status(400).json({ message: 'Invalid email' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const parsed = todoSchema.parse(req.body);
    const safeTitle = sanitizeString(parsed.title).trim().slice(0, 200);
    const created = {
      id: Date.now(),
      title: safeTitle,
      isCompleted: !!parsed.isCompleted,
    };

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid todo', details: err.errors ?? err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Mock API server listening on http://localhost:${PORT}`);
});
