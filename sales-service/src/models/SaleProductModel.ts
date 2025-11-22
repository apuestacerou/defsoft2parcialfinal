import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SaleModel } from './SaleModel';

@Table({
  tableName: 'venta_productos',
  timestamps: false,
})
export class SaleProductModel extends Model {
  @ForeignKey(() => SaleModel)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  venta_id!: number;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  producto_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cantidad!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  precio_unitario!: number;

  @BelongsTo(() => SaleModel)
  venta!: SaleModel;
}