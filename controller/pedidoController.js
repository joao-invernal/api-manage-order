const pedidoService = require('../services/pedidoService');

class PedidoController {
    criar(req, res) {
        try {
            const { cliente, tipo, valor, prioridade } = req.body;
            const novoPedido = pedidoService.criar({ cliente, tipo, valor, prioridade });
            return res.status(201).json(novoPedido);
        } catch (erro) {
            const status = erro.status || 500;
            const mensagem = status === 500 ? 'Erro interno do servidor.' : erro.message;
            return res.status(status).json({ mensagem });
        }
    }

    listar(req, res) {
        try {
            const pedidos = pedidoService.listar();
            return res.status(200).json(pedidos);
        } catch (erro) {
            return res.status(500).json({ mensagem: 'Erro interno do servidor ao listar pedidos.' });
        }
    }

    buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const pedido = pedidoService.buscarPorId(id);
            return res.status(200).json(pedido);
        } catch (erro) {
            const status = erro.status || 500;
            const mensagem = status === 500 ? 'Erro interno do servidor.' : erro.message;
            return res.status(status).json({ mensagem });
        }
    }

    atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const pedidoAtualizado = pedidoService.atualizarStatus(id, status);
            return res.status(200).json(pedidoAtualizado);
        } catch (erro) {
            const status = erro.status || 500;
            const mensagem = status === 500 ? 'Erro interno do servidor.' : erro.message;
            return res.status(status).json({ mensagem });
        }
    }
}

module.exports = new PedidoController();
