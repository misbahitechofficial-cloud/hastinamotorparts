import { Router } from 'express';
import { store } from '../../store';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// Admin: Analytics and dashboard summary
router.get('/summary', requireAuth, (req, res) => {
  const analytics = store.getSearchAnalytics();
  return res.json({
    success: true,
    analytics
  });
});

export default router;
