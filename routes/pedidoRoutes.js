const express = require('express');
const router = express.Router();
const pedidoController = require('../controller/pedidoController');

// Endpoints de pedidos
router.post('/', (req, res) => pedidoController.criar(req, res));
router.get('/', (req, res) => pedidoController.listar(req, res));
router.get('/:id', (req, res) => pedidoController.buscarPorId(req, res));
router.patch('/:id/status', (req, res) => pedidoController.atualizarStatus(req, res));

module.exports = router;
