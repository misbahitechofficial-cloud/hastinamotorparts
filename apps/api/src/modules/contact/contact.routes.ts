import { Router } from 'express';
import { z } from 'zod';
import { createRateLimiter } from '../../middleware/rateLimit';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message is required')
});

router.post('/', createRateLimiter(60000, 10), (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);
    console.log('[CONTACT MESSAGE RECEIVED]:', data);

    return res.status(200).json({
      success: true,
      message: 'Thank you for contacting ALISONS GENERAL TRADING LLP. We will respond promptly.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
