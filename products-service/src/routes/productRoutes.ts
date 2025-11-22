import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

// GET /products - Obtener todos los productos
router.get('/', (req, res) => productController.getAllProducts(req, res));

// GET /products/:id - Obtener producto por ID
router.get('/:id', (req, res) => productController.getProductById(req, res));

// POST /products - Crear nuevo producto
router.post('/', (req, res) => productController.createProduct(req, res));

// PUT /products/:id - Actualizar producto
router.put('/:id', (req, res) => productController.updateProduct(req, res));

// PUT /products/:id/stock - Actualizar stock de producto
router.put('/:id/stock', (req, res) => productController.updateProductStock(req, res));

// DELETE /products/:id - Eliminar producto
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

export { router as productRoutes };