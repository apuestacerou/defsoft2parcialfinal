import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { SaleProductModel } from './SaleProductModel';

@Table({
  tableName: 'ventas',
  timestamps: true,
  createdAt: 'fecha_venta',
  updatedAt: false,
})
export class SaleModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cliente_id!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  fecha_venta!: Date;

  @HasMany(() => SaleProductModel)
  productos!: SaleProductModel[];
}