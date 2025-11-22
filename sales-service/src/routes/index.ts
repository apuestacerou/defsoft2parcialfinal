import { Router } from 'express';
import { saleRoutes } from './saleRoutes';

const router = Router();

// Rutas de la API
router.use('/sales', saleRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Sales Service',
  });
});

export default router;