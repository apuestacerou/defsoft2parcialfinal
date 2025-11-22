import { Router } from 'express';
import { clientRoutes } from './clientRoutes';

const router = Router();

// Rutas de la API
router.use('/clients', clientRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Clients Service',
  });
});

export default router;