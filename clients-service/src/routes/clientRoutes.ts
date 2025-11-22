import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';

const router = Router();
const clientController = new ClientController();

// GET /clients - Obtener todos los clientes
router.get('/', (req, res) => clientController.getAllClients(req, res));

// GET /clients/:id - Obtener cliente por ID
router.get('/:id', (req, res) => clientController.getClientById(req, res));

// POST /clients - Crear nuevo cliente
router.post('/', (req, res) => clientController.createClient(req, res));

// PUT /clients/:id - Actualizar cliente
router.put('/:id', (req, res) => clientController.updateClient(req, res));

// DELETE /clients/:id - Eliminar cliente
router.delete('/:id', (req, res) => clientController.deleteClient(req, res));

export { router as clientRoutes };