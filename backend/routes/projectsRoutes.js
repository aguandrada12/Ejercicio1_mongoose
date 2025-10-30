const express = require('express');
const router = express.Router();

const Proyecto = require('../models/Proyecto');

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
    console.error('Error al crear proyecto:', error.message);
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

router.get('/:id', async (req, res, next) => {
  try {
    const ProyectoId = req.params.id;
    console.log('Buscando proyecto con ID:', ProyectoId);
 
    const proyecto = await Proyecto.findById(ProyectoId);
 
    if (!proyecto) {
      const error = new Error('Proyecto no encontrado');
      error.status = 404;
      return next(error);
    }
 
    res.status(200).json(proyecto);
 
  } catch (error) {
    console.error('Error al buscar proyecto por ID:', error.message);
    error.status = 400;
    next(error);
  }
});

// Método HTTP: PUT (actualización completa)
router.put('/:id', async (req, res, next) => {
  try {
    const proyectoId = req.params.id;
    const datosActualizados = req.body;
    console.log(`Actualizando proyecto con ID ${proyectoId} con datos:`, datosActualizados);
 
    // Argumentos: (id, { $set: datosAActualizar }, opciones)
    // new: true -> devuelve el documento modificado (por defecto devuelve el original)
    // runValidators: true -> ejecuta las validaciones del esquema antes de actualizar
    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      proyectoId,
      datosActualizados, // Mongoose automáticamente usa $set para los campos provistos
      { new: true, runValidators: true } // Opciones importantes
    );
 
    if (!proyectoActualizado) {
      const error = new Error('Proyecto no encontrado para actualizar');
      error.status = 404;
      return next(error);
    }
 
    res.status(200).json({
      mensaje: 'Proyecto actualizado con éxito',
      usuario: proyectoActualizado
    });
 
  } catch (error) {
    console.error('Error al actualizar proyecto:', error.message);
    error.status = 400;
    next(error);
  }
});


// Método HTTP: DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const proyectoId = req.params.id;
    console.log('Eliminando usuario con ID:', proyectoId);
 
    const proyectoEliminado = await Proyecto.findByIdAndDelete(proyectoId);
 
    if (!proyectoEliminado) {
      const error = new Error('Proyecto no encontrado para eliminar');
      error.status = 404;
      return next(error);
    }
 
    res.status(200).json({
      mensaje: 'Proyecto eliminado con éxito',
      usuario: proyectoEliminado // Opcional: devolver el usuario eliminado
    });
    // Si no necesitas devolver el usuario eliminado, puedes usar res.status(204).send();
 
  } catch (error) {
    console.error('Error al eliminar proyecto:', error.message);
    error.status = 400; // 
    next(error);
  }
});

module.exports = router;
