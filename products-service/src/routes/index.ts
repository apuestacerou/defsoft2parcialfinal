import { Router } from 'express';
import { productRoutes } from './productRoutes';

const router = Router();

// Rutas de la API
router.use('/products', productRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Products Service',
  });
});

export default router;