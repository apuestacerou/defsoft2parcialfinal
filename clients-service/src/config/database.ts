import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../models/ClientModel';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './clients_database.sqlite',
  logging: false,
  models: [ClientModel],
});

export default sequelize;