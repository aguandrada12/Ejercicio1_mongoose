const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const projectsRoutes = require('./routes/projectsRoutes');
app.use('/proyectos', projectsRoutes);

const tasksRoutes = require('./routes/tasksRoutes');
app.use('/tareas', tasksRoutes);

// *** Conexión a la Base de Datos ***
const DB_URI = 'mongodb://localhost:27017/miBaseDeDatosMERN';
mongoose.connect(DB_URI)
  .then(() => console.log('¡Conexión exitosa a MongoDB!'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));
 

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando y conectado a MongoDB (esperemos!)');
});

//Crear el Middleware para Rutas No Encontradas (404)
app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error); // Se lo pasamos a nuestro manejador de errores central
});

// Middleware Centralizado de Manejo de Errores
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  console.error(err.message, err.stack);
  
  res.status(statusCode).json({
    message: err.message || 'Ha ocurrido un error en el servidor.',
    // Solo mostramos el detalle del error si no estamos en producción
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});