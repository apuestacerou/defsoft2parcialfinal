import { ClientRepository } from '../repositories/ClientRepository';
import { Client, CreateClientRequest, UpdateClientRequest } from '../types';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async getAllClients(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }

  async getClientById(id: number): Promise<Client | null> {
    if (!id || id <= 0) {
      throw new Error('ID de cliente inválido');
    }
    return this.clientRepository.findById(id);
  }

  async createClient(clientData: CreateClientRequest): Promise<Client> {
    // Validaciones de negocio
    if (!clientData.nombre?.trim()) {
      throw new Error('El nombre del cliente es requerido');
    }

    if (!clientData.email?.trim()) {
      throw new Error('El email del cliente es requerido');
    }

    if (!clientData.telefono?.trim()) {
      throw new Error('El teléfono del cliente es requerido');
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientData.email)) {
      throw new Error('Formato de email inválido');
    }

    // Verificar si el email ya existe
    const existingClient = await this.clientRepository.findByEmail(clientData.email);
    if (existingClient) {
      throw new Error('Ya existe un cliente con este email');
    }

    return this.clientRepository.create(clientData);
  }

  async updateClient(id: number, clientData: UpdateClientRequest): Promise<Client | null> {
    if (!id || id <= 0) {
      throw new Error('ID de cliente inválido');
    }

    // Verificar que el cliente existe
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new Error('Cliente no encontrado');
    }

    // Validar email si se está actualizando
    if (clientData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientData.email)) {
        throw new Error('Formato de email inválido');
      }

      // Verificar que el email no esté en uso por otro cliente
      const clientWithEmail = await this.clientRepository.findByEmail(clientData.email);
      if (clientWithEmail && clientWithEmail.id !== id) {
        throw new Error('Ya existe otro cliente con este email');
      }
    }

    return this.clientRepository.update(id, clientData);
  }

  async deleteClient(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de cliente inválido');
    }

    // Verificar que el cliente existe
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new Error('Cliente no encontrado');
    }

    return this.clientRepository.delete(id);
  }
}