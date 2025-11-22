import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../models/ProductModel';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './products_database.sqlite',
  logging: false,
  models: [ProductModel],
});

export default sequelize;