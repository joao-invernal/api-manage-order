const express = require('express');

const app = express();
const PORT = 3000;

// Permite o app ler JSON no corpo das requisições
app.use(express.json());


app.listen(PORT, () => {
    console.log('Máquina serve à porta ' + PORT);
});

module.exports = app;