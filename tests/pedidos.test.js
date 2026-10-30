const request = require('supertest');
const app = require('../index');
const pedidoService = require('../services/pedidoService');

describe('Testes Automatizados - API de Gerenciamento de Pedidos', () => {
    beforeEach(() => {
        // Reseta o estado em memória dos pedidos antes de cada teste
        pedidoService.limpar();
    });

    describe('POST /pedidos', () => {
        it('deve cadastrar um pedido válido com sucesso (HTTP 201)', async () => {
            const pedidoValido = {
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            };

            const res = await request(app)
                .post('/pedidos')
                .send(pedidoValido);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 1);
            expect(res.body.cliente).toBe('Carlos Silva');
            expect(res.body.tipo).toBe('entrega');
            expect(res.body.valor).toBe(350);
            expect(res.body.prioridade).toBe('normal');
            expect(res.body.status).toBe('recebido');
        });

        it('deve retornar erro 400 se o cliente for vazio ou não informado', async () => {
            const res = await request(app)
                .post('/pedidos')
                .send({
                    cliente: '   ',
                    tipo: 'entrega',
                    valor: 100,
                    prioridade: 'normal'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/cliente/i);
        });

        it('deve retornar erro 400 se o valor for menor ou igual a zero', async () => {
            const res = await request(app)
                .post('/pedidos')
                .send({
                    cliente: 'Ana Paula',
                    tipo: 'retirada',
                    valor: -10,
                    prioridade: 'alta'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/valor/i);
        });

        it('deve retornar erro 400 se o tipo de pedido for inválido', async () => {
            const res = await request(app)
                .post('/pedidos')
                .send({
                    cliente: 'Marcos Souza',
                    tipo: 'desconhecido',
                    valor: 50,
                    prioridade: 'baixa'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/tipo/i);
        });

        it('deve retornar erro 400 se a prioridade for inválida', async () => {
            const res = await request(app)
                .post('/pedidos')
                .send({
                    cliente: 'Marcos Souza',
                    tipo: 'entrega',
                    valor: 50,
                    prioridade: 'invalida'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/prioridade/i);
        });
    });

    describe('GET /pedidos', () => {
        it('deve retornar uma lista vazia quando não houver pedidos cadastrados', async () => {
            const res = await request(app).get('/pedidos');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });

        it('deve listar todos os pedidos cadastrados', async () => {
            await request(app).post('/pedidos').send({
                cliente: 'Cliente 1',
                tipo: 'entrega',
                valor: 100,
                prioridade: 'baixa'
            });

            await request(app).post('/pedidos').send({
                cliente: 'Cliente 2',
                tipo: 'retirada',
                valor: 200,
                prioridade: 'alta'
            });

            const res = await request(app).get('/pedidos');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].cliente).toBe('Cliente 1');
            expect(res.body[1].cliente).toBe('Cliente 2');
        });
    });

    describe('GET /pedidos/:id', () => {
        it('deve consultar um pedido existente pelo ID com sucesso (HTTP 200)', async () => {
            const criacao = await request(app).post('/pedidos').send({
                cliente: 'Mariana Lima',
                tipo: 'entrega',
                valor: 150,
                prioridade: 'normal'
            });

            const idCriado = criacao.body.id;

            const res = await request(app).get(`/pedidos/${idCriado}`);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(idCriado);
            expect(res.body.cliente).toBe('Mariana Lima');
        });

        it('deve retornar 404 se o pedido não for encontrado', async () => {
            const res = await request(app).get('/pedidos/999');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/não encontrado/i);
        });

        it('deve retornar 400 se o identificador não for um número válido', async () => {
            const res = await request(app).get('/pedidos/abc');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/identificador/i);
        });
    });

    describe('PATCH /pedidos/:id/status', () => {
        it('deve atualizar o status de um pedido com sucesso (HTTP 200)', async () => {
            const criacao = await request(app).post('/pedidos').send({
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            });

            const idCriado = criacao.body.id;

            const res = await request(app)
                .patch(`/pedidos/${idCriado}/status`)
                .send({ status: 'em_preparacao' });

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(idCriado);
            expect(res.body.status).toBe('em_preparacao');
        });

        it('deve retornar 400 se o status for inválido', async () => {
            const criacao = await request(app).post('/pedidos').send({
                cliente: 'Carlos Silva',
                tipo: 'entrega',
                valor: 350,
                prioridade: 'normal'
            });

            const res = await request(app)
                .patch(`/pedidos/${criacao.body.id}/status`)
                .send({ status: 'status_inexistente' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/status inválido/i);
        });

        it('deve retornar 404 ao tentar atualizar status de pedido inexistente', async () => {
            const res = await request(app)
                .patch('/pedidos/999/status')
                .send({ status: 'cancelado' });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('mensagem');
            expect(res.body.mensagem).toMatch(/não encontrado/i);
        });
    });
});
