import { Request, Response } from 'express';
import { SaleService } from '../services/SaleService';
import { CreateSaleRequest, ApiResponse } from '../types';

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  async getAllSales(req: Request, res: Response): Promise<void> {
    try {
      const sales = await this.saleService.getAllSales();
      const response: ApiResponse = {
        success: true,
        data: sales,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al obtener ventas',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async getSaleById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const sale = await this.saleService.getSaleById(id);

      if (!sale) {
        const response: ApiResponse = {
          success: false,
          message: 'Venta no encontrada',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: sale,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al obtener venta',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async getSalesByClientId(req: Request, res: Response): Promise<void> {
    try {
      const clienteId = parseInt(req.params.clienteId);
      const sales = await this.saleService.getSalesByClientId(clienteId);

      const response: ApiResponse = {
        success: true,
        data: sales,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al obtener ventas del cliente',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async createSale(req: Request, res: Response): Promise<void> {
    try {
      const saleData: CreateSaleRequest = req.body;
      const sale = await this.saleService.createSale(saleData);

      const response: ApiResponse = {
        success: true,
        data: sale,
        message: 'Venta creada exitosamente',
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al crear venta',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(400).json(response);
    }
  }

  async deleteSale(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.saleService.deleteSale(id);

      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          message: 'Venta no encontrada',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Venta eliminada exitosamente',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al eliminar venta',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }
}