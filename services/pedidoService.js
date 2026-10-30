const STATUS_PERMITIDOS = ['recebido', 'em_preparacao', 'enviado', 'entregue', 'cancelado'];
const TIPOS_PERMITIDOS = ['entrega', 'retirada'];
const PRIORIDADES_PERMITIDAS = ['baixa', 'normal', 'alta', 'urgente'];

// Armazenamento em memória
let pedidos = [];
let proximoId = 1;

class PedidoService {
    criar({ cliente, tipo, valor, prioridade }) {
        if (!cliente || typeof cliente !== 'string' || cliente.trim().length === 0) {
            const erro = new Error('O campo "cliente" é obrigatório e deve ser um texto não vazio.');
            erro.status = 400;
            throw erro;
        }

        if (valor === undefined || valor === null || typeof valor !== 'number' || isNaN(valor) || valor <= 0) {
            const erro = new Error('O campo "valor" é obrigatório, deve ser numérico e maior que zero.');
            erro.status = 400;
            throw erro;
        }

        const tipoNormalizado = typeof tipo === 'string' ? tipo.trim().toLowerCase() : '';
        if (!TIPOS_PERMITIDOS.includes(tipoNormalizado)) {
            const erro = new Error(`O campo 'tipo' deve ser um dos seguintes valores: ${TIPOS_PERMITIDOS.join(', ')}.`);
            erro.status = 400;
            throw erro;
        }

        const prioridadeNormalizada = typeof prioridade === 'string' ? prioridade.trim().toLowerCase() : '';
        if (!PRIORIDADES_PERMITIDAS.includes(prioridadeNormalizada)) {
            const erro = new Error(`O campo 'prioridade' deve ser um dos seguintes valores: ${PRIORIDADES_PERMITIDAS.join(', ')}.`);
            erro.status = 400;
            throw erro;
        }

        const novoPedido = {
            id: proximoId++,
            cliente: cliente.trim(),
            tipo: tipoNormalizado,
            valor: Number(valor),
            prioridade: prioridadeNormalizada,
            status: 'recebido'
        };

        pedidos.push(novoPedido);
        return novoPedido;
    }

    listar() {
        return pedidos;
    }

    buscarPorId(id) {
        const idNumero = Number(id);
        if (!Number.isInteger(idNumero) || idNumero <= 0) {
            const erro = new Error('O identificador do pedido deve ser um número inteiro positivo.');
            erro.status = 400;
            throw erro;
        }

        const pedido = pedidos.find(p => p.id === idNumero);
        if (!pedido) {
            const erro = new Error(`Pedido com ID ${idNumero} não encontrado.`);
            erro.status = 404;
            throw erro;
        }

        return pedido;
    }

    atualizarStatus(id, novoStatus) {
        const pedido = this.buscarPorId(id);

        if (!novoStatus || typeof novoStatus !== 'string') {
            const erro = new Error('O campo "status" é obrigatório e deve ser uma string.');
            erro.status = 400;
            throw erro;
        }

        const statusNormalizado = novoStatus.trim().toLowerCase();
        if (!STATUS_PERMITIDOS.includes(statusNormalizado)) {
            const erro = new Error(`Status inválido. Valores permitidos: ${STATUS_PERMITIDOS.join(', ')}.`);
            erro.status = 400;
            throw erro;
        }

        pedido.status = statusNormalizado;
        return pedido;
    }

    // Método utilitário para resetar memória (útil em testes automatizados)
    limpar() {
        pedidos = [];
        proximoId = 1;
    }
}

module.exports = new PedidoService();
