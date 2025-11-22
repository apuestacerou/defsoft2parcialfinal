import { ProductModel } from '../models/ProductModel';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types';

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll({
      order: [['fecha_creacion', 'DESC']],
    });
    return products.map(product => product.toJSON() as Product);
  }

  async findById(id: number): Promise<Product | null> {
    const product = await ProductModel.findByPk(id);
    return product ? (product.toJSON() as Product) : null;
  }

  async create(productData: CreateProductRequest): Promise<Product> {
    const product = await ProductModel.create(productData as any);
    return product.toJSON() as Product;
  }

  async update(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    const [affectedRows] = await ProductModel.update(productData, {
      where: { id },
    });

    if (affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  async updateStock(id: number, newStock: number): Promise<Product | null> {
    const [affectedRows] = await ProductModel.update(
      { stock: newStock },
      { where: { id } }
    );

    if (affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await ProductModel.destroy({
      where: { id },
    });
    return deletedRows > 0;
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    const products = await ProductModel.findAll({
      where: {
        id: ids,
      },
    });
    return products.map(product => product.toJSON() as Product);
  }
}