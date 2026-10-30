const express = require('express');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
const PORT = 3000;

// Permite o app ler JSON no corpo das requisições
app.use(express.json());

// Rotas da aplicação
app.use('/pedidos', pedidoRoutes);

// Middleware para tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('Máquina serve à porta ' + PORT);
    });
}

module.exports = app;