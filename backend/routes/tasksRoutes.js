const express = require('express');
const router = express.Router();

const Tareas = require('../models/Tareas');

// Método HTTP: POST
router.post('/', async (req, res, next) => {
  try {
    const datosNuevaTarea = req.body;
    console.log('Datos recibidos para crear proyecto:', datosNuevaTarea);
 
    const nuevaTarea= new Proyecto(datosNuevaTarea);
    const tareaGuardada = await nuevaTarea.save();

    res.status(201).json({
      mensaje: 'Tarea creada con éxito',
      usuario: tareaGuardada
    });
 
  } catch (error) {
    console.error('Error al crear la tarea:', error.message);
    error.status = 400;
    next(error);
  }
});
 
// Método HTTP: GET
router.get('/', async (req, res, next) => {
  try {
      const tareas = await Tareas.find({});
 
      res.status(200).json(tareas);
 
  } catch (error) {
    console.error('Error al obtener tareas:', error.message);
    next(error); // Pasa el error al middleware de errores
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const TareaId = req.params.id;
    console.log('Buscando tarea con ID:', TareaId);
 
    const tarea = await Tareas.findById(TareaId);
 
    if (!tarea) {
      const error = new Error('Tarea no encontrada');
      error.status = 404;
      return next(error);
    }
 
    res.status(200).json(tarea);
 
  } catch (error) {
    console.error('Error al buscar tarea por ID:', error.message);
    error.status = 400;
    next(error);
  }
});

// Método HTTP: PUT (actualización completa)
router.put('/:id', async (req, res, next) => {
  try {
    const tareaId = req.params.id;
    const datosActualizados = req.body;
    console.log(`Actualizando tarea con ID ${tareaId} con datos:`, datosActualizados);
 
    // Argumentos: (id, { $set: datosAActualizar }, opciones)
    // new: true -> devuelve el documento modificado (por defecto devuelve el original)
    // runValidators: true -> ejecuta las validaciones del esquema antes de actualizar
    const tareaActualizada = await Tareas.findByIdAndUpdate(
      tareaId,
      datosActualizados, // Mongoose automáticamente usa $set para los campos provistos
      { new: true, runValidators: true } // Opciones importantes
    );
 
    if (!tareaActualizada) {
      const error = new Error('Proyecto no encontrado para actualizar');
      error.status = 404;
      return next(error);
    }
 
    res.status(200).json({
      mensaje: 'Tarea actualizada con éxito',
      usuario: tareaActualizada
    });
 
  } catch (error) {
    console.error('Error al actualizar tarea:', error.message);
    error.status = 400;
    next(error);
  }
});


// Método HTTP: DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const tareaId = req.params.id;
    console.log('Eliminando usuario con ID:', tareaId);
 
    const tareaEliminada = await Tareas.findByIdAndDelete(tareaId);
 
    if (!tareaEliminada) {
      const error = new Error('Tarea no encontrada para eliminar');
      error.status = 404;
      return next(error);
    }
 
    res.status(200).json({
      mensaje: 'Tarea eliminada con éxito',
      usuario: tareaEliminada // Opcional: devolver el usuario eliminado
    });
    // Si no necesitas devolver el usuario eliminado, puedes usar res.status(204).send();
 
  } catch (error) {
    console.error('Error al eliminar tarea:', error.message);
    error.status = 400; // 
    next(error);
  }
});

module.exports = router;
