import { Transaction } from 'sequelize';
import sequelize from '../config/database';
import { SaleRepository } from '../repositories/SaleRepository';
import { HttpClientService } from './HttpClientService';
import { Sale, CreateSaleRequest, Product } from '../types';

export class SaleService {
  private saleRepository: SaleRepository;
  private httpClientService: HttpClientService;

  constructor() {
    this.saleRepository = new SaleRepository();
    this.httpClientService = new HttpClientService();
  }

  async getAllSales(): Promise<Sale[]> {
    return this.saleRepository.findAll();
  }

  async getSaleById(id: number): Promise<Sale | null> {
    if (!id || id <= 0) {
      throw new Error('ID de venta inválido');
    }
    return this.saleRepository.findById(id);
  }

  async getSalesByClientId(clienteId: number): Promise<Sale[]> {
    if (!clienteId || clienteId <= 0) {
      throw new Error('ID de cliente inválido');
    }
    return this.saleRepository.findByClientId(clienteId);
  }

  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    console.log('Sales Service: Iniciando creación de venta', saleData);

    // Validaciones de negocio
    if (!saleData.cliente_id || saleData.cliente_id <= 0) {
      throw new Error('ID de cliente inválido');
    }

    if (!saleData.productos || saleData.productos.length === 0) {
      throw new Error('La venta debe incluir al menos un producto');
    }

    console.log('Sales Service: Consultando cliente ID', saleData.cliente_id);

    // Consultar cliente desde el microservicio de clientes
    let client;
    try {
      client = await this.httpClientService.getClientById(saleData.cliente_id);
    } catch (error) {
      console.error('Sales Service: Error al consultar cliente:', error);
      throw new Error('Error al conectar con el servicio de clientes. Verifique que esté ejecutándose.');
    }

    if (!client) {
      throw new Error(`Cliente con ID ${saleData.cliente_id} no encontrado`);
    }

    console.log('Sales Service: Cliente encontrado:', client.nombre);

    // Obtener productos desde el microservicio de productos
    const productIds = saleData.productos.map(p => p.producto_id);
    console.log('Sales Service: Consultando productos IDs:', productIds);

    let products;
    try {
      products = await this.httpClientService.getProductsByIds(productIds);
    } catch (error) {
      console.error('Sales Service: Error al consultar productos:', error);
      throw new Error('Error al conectar con el servicio de productos. Verifique que esté ejecutándose.');
    }

    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p.id);
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      throw new Error(`Los siguientes productos no existen: ${missingIds.join(', ')}`);
    }

    // Crear mapa de productos para fácil acceso
    const productMap = new Map<number, Product>();
    products.forEach(product => productMap.set(product.id!, product));

    console.log('Sales Service: Productos encontrados:', products.map(p => `${p.nombre} (ID: ${p.id}, Stock: ${p.stock})`));

    // Validar stock y calcular total
    let total = 0;
    for (const saleProduct of saleData.productos) {
      const product = productMap.get(saleProduct.producto_id);
      if (!product) {
        throw new Error(`Producto con ID ${saleProduct.producto_id} no encontrado`);
      }

      console.log(`Sales Service: Validando producto ${product.nombre} - Cantidad solicitada: ${saleProduct.cantidad}, Stock disponible: ${product.stock}`);

      if (saleProduct.cantidad <= 0) {
        throw new Error(`Cantidad inválida para producto ${product.nombre}`);
      }

      if (product.stock < saleProduct.cantidad) {
        throw new Error(`Stock insuficiente para producto ${product.nombre}. Disponible: ${product.stock}`);
      }

      total += product.precio * saleProduct.cantidad;
    }

    console.log('Sales Service: Calculando total:', total);

    // Usar transacción para asegurar atomicidad
    const transaction = await sequelize.transaction();

    try {
      console.log('Sales Service: Creando venta en base de datos');
      // Crear la venta
      const sale = await this.saleRepository.create(saleData, transaction);
      console.log('Sales Service: Venta creada con ID:', sale.id);

      // Actualizar precios en los productos de la venta y reducir stock
      for (const saleProduct of saleData.productos) {
        const product = productMap.get(saleProduct.producto_id)!;
        const newStock = product.stock - saleProduct.cantidad;

        console.log(`Sales Service: Actualizando stock del producto ${product.nombre} - Stock anterior: ${product.stock}, Nuevo stock: ${newStock}`);

        // Actualizar stock en el microservicio de productos
        try {
          await this.httpClientService.updateProductStock(saleProduct.producto_id, newStock);
          console.log(`Sales Service: Stock actualizado exitosamente para producto ${product.nombre}`);
        } catch (error) {
          console.error(`Sales Service: Error al actualizar stock del producto ${product.nombre}:`, error);
          throw new Error(`Error al actualizar stock del producto ${product.nombre}`);
        }
      }

      console.log('Sales Service: Actualizando total de la venta:', total);
      // Actualizar el total de la venta
      await this.saleRepository.updateTotal(sale.id!, total, transaction);

      await transaction.commit();
      console.log('Sales Service: Transacción completada exitosamente');

      // Retornar la venta completa
      const finalSale = await this.getSaleById(sale.id!);
      console.log('Sales Service: Venta completada:', finalSale);
      return finalSale as Sale;
    } catch (error) {
      console.error('Sales Service: Error en transacción, haciendo rollback:', error);
      await transaction.rollback();
      throw error;
    }
  }

  async deleteSale(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de venta inválido');
    }

    // Verificar que la venta existe
    const existingSale = await this.saleRepository.findById(id);
    if (!existingSale) {
      throw new Error('Venta no encontrada');
    }

    return this.saleRepository.delete(id);
  }
}