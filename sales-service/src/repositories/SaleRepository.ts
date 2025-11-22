import { Transaction } from 'sequelize';
import sequelize from '../config/database';
import { SaleModel } from '../models/SaleModel';
import { SaleProductModel } from '../models/SaleProductModel';
import { Sale, CreateSaleRequest, SaleProduct } from '../types';

export class SaleRepository {
  async findAll(): Promise<Sale[]> {
    const sales = await SaleModel.findAll({
      include: [
        {
          model: SaleProductModel,
          as: 'productos',
        },
      ],
      order: [['fecha_venta', 'DESC']],
    });

    return sales.map(sale => ({
      id: sale.id,
      cliente_id: sale.cliente_id,
      total: sale.total,
      fecha_venta: sale.fecha_venta,
      productos: sale.productos?.map(sp => ({
        producto_id: sp.producto_id,
        cantidad: sp.cantidad,
        precio_unitario: sp.precio_unitario,
      })) || [],
    }));
  }

  async findById(id: number): Promise<Sale | null> {
    const sale = await SaleModel.findByPk(id, {
      include: [
        {
          model: SaleProductModel,
          as: 'productos',
        },
      ],
    });

    if (!sale) return null;

    return {
      id: sale.id,
      cliente_id: sale.cliente_id,
      total: sale.total,
      fecha_venta: sale.fecha_venta,
      productos: sale.productos?.map(sp => ({
        producto_id: sp.producto_id,
        cantidad: sp.cantidad,
        precio_unitario: sp.precio_unitario,
      })) || [],
    };
  }

  async create(saleData: CreateSaleRequest, transaction?: Transaction): Promise<Sale> {
    const t = transaction || (await sequelize.transaction());

    try {
      // Crear la venta
      const sale = await SaleModel.create(
        {
          cliente_id: saleData.cliente_id,
          total: 0, // Se calculará después
        },
        { transaction: t }
      );

      // Crear los productos de la venta
      const saleProducts = saleData.productos.map(producto => ({
        venta_id: sale.id,
        producto_id: producto.producto_id,
        cantidad: producto.cantidad,
        precio_unitario: 0, // Se obtendrá del producto
      }));

      await SaleProductModel.bulkCreate(saleProducts, { transaction: t });

      if (!transaction) {
        await t.commit();
      }

      // Retornar la venta completa
      return this.findById(sale.id) as Promise<Sale>;
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  async updateTotal(id: number, total: number, transaction?: Transaction): Promise<boolean> {
    const [affectedRows] = await SaleModel.update(
      { total },
      { where: { id }, transaction }
    );
    return affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await SaleModel.destroy({
      where: { id },
    });
    return deletedRows > 0;
  }

  async findByClientId(clienteId: number): Promise<Sale[]> {
    const sales = await SaleModel.findAll({
      where: { cliente_id: clienteId },
      include: [
        {
          model: SaleProductModel,
          as: 'productos',
        },
      ],
      order: [['fecha_venta', 'DESC']],
    });

    return sales.map(sale => ({
      id: sale.id,
      cliente_id: sale.cliente_id,
      total: sale.total,
      fecha_venta: sale.fecha_venta,
      productos: sale.productos?.map(sp => ({
        producto_id: sp.producto_id,
        cantidad: sp.cantidad,
        precio_unitario: sp.precio_unitario,
      })) || [],
    }));
  }
}