import { Sequelize } from 'sequelize-typescript';
import { SaleModel } from '../models/SaleModel';
import { SaleProductModel } from '../models/SaleProductModel';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sales_database.sqlite',
  logging: false,
  models: [SaleModel, SaleProductModel],
});

export default sequelize;