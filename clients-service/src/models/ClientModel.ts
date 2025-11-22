import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
})
export class ClientModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  nombre!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  telefono!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  fecha_creacion!: Date;
}