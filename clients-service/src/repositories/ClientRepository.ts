import { ClientModel } from '../models/ClientModel';
import { Client, CreateClientRequest, UpdateClientRequest } from '../types';

export class ClientRepository {
  async findAll(): Promise<Client[]> {
    const clients = await ClientModel.findAll({
      order: [['fecha_creacion', 'DESC']],
    });
    return clients.map(client => client.toJSON() as Client);
  }

  async findById(id: number): Promise<Client | null> {
    const client = await ClientModel.findByPk(id);
    return client ? (client.toJSON() as Client) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await ClientModel.findOne({
      where: { email },
    });
    return client ? (client.toJSON() as Client) : null;
  }

  async create(clientData: CreateClientRequest): Promise<Client> {
    const client = await ClientModel.create(clientData as any);
    return client.toJSON() as Client;
  }

  async update(id: number, clientData: UpdateClientRequest): Promise<Client | null> {
    const [affectedRows] = await ClientModel.update(clientData, {
      where: { id },
    });

    if (affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await ClientModel.destroy({
      where: { id },
    });
    return deletedRows > 0;
  }
}