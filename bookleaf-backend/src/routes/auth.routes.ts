import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { validateBody } from '../middleware/validate';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  fullName: z.string().min(1, 'Full name field cannot be empty'),
  role: z.enum(['admin', 'author', 'reader']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password field required'),
});

router.post('/register', validateBody(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, role } = req.body;
    const newUser = await AuthService.register(email, password, fullName, role);
    return res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const sessionDetails = await AuthService.login(email, password);
    return res.status(200).json({ success: true, data: sessionDetails });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
});

router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userProfile = await AuthService.getUserById(userId);
    return res.status(200).json({ success: true, data: userProfile });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
});

export default router;