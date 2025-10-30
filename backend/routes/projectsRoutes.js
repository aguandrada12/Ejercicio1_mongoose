const express = require('express');
const router = express.Router();

const Proyecto = require('../models/Proyecto');
const Tareas = require('../models/Tareas');

// Método HTTP: POST
router.post('/', async (req, res, next) => {
  try {
    const datosNuevoProyecto = req.body;
    console.log('Datos recibidos para crear proyecto:', datosNuevoProyecto);
 
    const nuevoProyecto= new Proyecto(datosNuevoProyecto);
 
    const proyectoGuardado = await nuevoProyecto.save();

    res.status(201).json({
      mensaje: 'Proyecto creado con éxito',
      usuario: proyectoGuardado
    });
 
  } catch (error) {
    console.error('Error al crear pryecto:', error.message);
    error.status = 400;
    next(error);
  }
});
 
// Método HTTP: GET
router.get('/', async (req, res, next) => {
  try {
      const proyectos = await Proyecto.find({});
 
      res.status(200).json(proyectos);
 
  } catch (error) {
    console.error('Error al obtener proyectos:', error.message);
    next(error); // Pasa el error al middleware de errores
  }
});

module.exports = router;
