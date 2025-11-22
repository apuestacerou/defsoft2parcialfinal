import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CreateProductRequest, UpdateProductRequest, ApiResponse } from '../types';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      const response: ApiResponse = {
        success: true,
        data: products,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al obtener productos',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getProductById(id);

      if (!product) {
        const response: ApiResponse = {
          success: false,
          message: 'Producto no encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: product,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al obtener producto',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductRequest = req.body;
      const product = await this.productService.createProduct(productData);

      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Producto creado exitosamente',
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al crear producto',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(400).json(response);
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const productData: UpdateProductRequest = req.body;
      const product = await this.productService.updateProduct(id, productData);

      if (!product) {
        const response: ApiResponse = {
          success: false,
          message: 'Producto no encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Producto actualizado exitosamente',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al actualizar producto',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(400).json(response);
    }
  }

  async updateProductStock(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { stock } = req.body;

      if (stock === undefined || stock < 0) {
        const response: ApiResponse = {
          success: false,
          message: 'Stock inválido',
        };
        res.status(400).json(response);
        return;
      }

      const product = await this.productService.updateProductStock(id, stock);

      if (!product) {
        const response: ApiResponse = {
          success: false,
          message: 'Producto no encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Stock actualizado exitosamente',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al actualizar stock',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.productService.deleteProduct(id);

      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          message: 'Producto no encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Producto eliminado exitosamente',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al eliminar producto',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }
}