import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';
import { CreateClientRequest, UpdateClientRequest, ApiResponse } from '../types';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.clientService.getAllClients();
      const response: ApiResponse = {
        success: true,
        data: clients,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al obtener clientes',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const client = await this.clientService.getClientById(id);

      if (!client) {
        const response: ApiResponse = {
          success: false,
          message: 'Cliente no encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: client,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al obtener cliente',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }

  async createClient(req: Request, res: Response): Promise<void> {
    try {
      const clientData: CreateClientRequest = req.body;
      const client = await this.clientService.createClient(clientData);

      const response: ApiResponse = {
        success: true,
        data: client,
        message: 'Cliente creado exitosamente',
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al crear cliente',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(400).json(response);
    }
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const clientData: UpdateClientRequest = req.body;
      const client = await this.clientService.updateClient(id, clientData);

      if (!client) {
        const response: ApiResponse = {
          success: false,
          message: 'Cliente no encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: client,
        message: 'Cliente actualizado exitosamente',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al actualizar cliente',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(400).json(response);
    }
  }

  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.clientService.deleteClient(id);

      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          message: 'Cliente no encontrado',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Cliente eliminado exitosamente',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        message: 'Error al eliminar cliente',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      res.status(500).json(response);
    }
  }
}