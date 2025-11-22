import express from 'express';
import sequelize from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Middleware de error
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializar base de datos y servidor
const startServer = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log('Base de datos de clientes sincronizada correctamente');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Microservicio de Clientes corriendo en el puerto ${PORT}`);
      console.log(`API disponible en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Error al iniciar el microservicio de clientes:', error);
    process.exit(1);
  }
};

startServer();

export default app;