# API para Gerenciamento de Pedidos

Arquitetura implementada com o formato MVC [ Routes; Controller; Services ]

<br>

## Como Executar

 1. Comando para instalar os pacotes: 
 ``` 
 npm install 
 ```
 
 2. Comando para compilar o código: 
 ``` 
 npm start
 ```

 <br>

## 🌐 Endpoints Implementados

| Método | Rota | Descrição | Status Sucesso | Status Erros |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/pedidos` | Cadastra um novo pedido | `201 Created` | `400 Bad Request` |
| `GET` | `/pedidos` | Lista todos os pedidos cadastrados | `200 OK` | `500 Internal Server Error` |
| `GET` | `/pedidos/:id` | Consulta um pedido pelo ID | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `PATCH` | `/pedidos/:id/status` | Atualiza o status de um pedido | `200 OK` | `400 Bad Request`, `404 Not Found` |

### 1. Criar Pedido (`POST /pedidos`)
- **Corpo da Requisição (JSON):**
  ```json
  {
    "cliente": "Carlos Silva",
    "tipo": "entrega",
    "valor": 350,
    "prioridade": "normal"
  }
  ```
- **Campos e Validações:**
  - `cliente`: Obrigatório, texto não vazio (espaços em branco nas pontas são desconsiderados).
  - `tipo`: Obrigatório, valores permitidos: `"entrega"` ou `"retirada"`.
  - `valor`: Obrigatório, numérico e maior que zero (`> 0`).
  - `prioridade`: Obrigatório, valores permitidos: `"baixa"`, `"normal"`, `"alta"` ou `"urgente"`.
- **Resposta de Sucesso (`201 Created`):**
  ```json
  {
    "id": 1,
    "cliente": "Carlos Silva",
    "tipo": "entrega",
    "valor": 350,
    "prioridade": "normal",
    "status": "recebido"
  }
  ```

---

### 2. Listar Pedidos (`GET /pedidos`)
- **Resposta de Sucesso (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "cliente": "Carlos Silva",
      "tipo": "entrega",
      "valor": 350,
      "prioridade": "normal",
      "status": "recebido"
    }
  ]
  ```

---

### 3. Consultar Pedido por ID (`GET /pedidos/:id`)
- **Parâmetros de Rota:** `id` (inteiro positivo).
- **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "id": 1,
    "cliente": "Carlos Silva",
    "tipo": "entrega",
    "valor": 350,
    "prioridade": "normal",
    "status": "recebido"
  }
  ```
- **Resposta de Erro (`404 Not Found`):**
  ```json
  {
    "mensagem": "Pedido com ID 999 não encontrado."
  }
  ```

---

### 4. Atualizar Status do Pedido (`PATCH /pedidos/:id/status`)
- **Parâmetros de Rota:** `id` (inteiro positivo).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "status": "em_preparacao"
  }
  ```
- **Resposta de Sucesso (`200 OK`):**
  ```json
  {
    "id": 1,
    "cliente": "Carlos Silva",
    "tipo": "entrega",
    "valor": 350,
    "prioridade": "normal",
    "status": "em_preparacao"
  }
  ```
- **Resposta de Erro (`400 Bad Request`):**
  ```json
  {
    "mensagem": "Status inválido. Valores permitidos: recebido, em_preparacao, enviado, entregue, cancelado."
  }
  ```

<br><br><br>

## 🔄 Rastreamento de Estado de Pedido

Os pedidos podem ser atualizado para refletir o seu momento mais precisamente; Deve iniciar sempre no estado `recebido`.

### Estados Permitidos
- `recebido`: Estado inicial ao cadastrar o pedido.
- `em_preparacao`: Pedido em processo de confecção/separação.
- `enviado`: Pedido despachado para entrega ou pronto para retirada.
- `entregue`: Pedido finalizado com sucesso (estado terminal).
- `cancelado`: Pedido cancelado (estado terminal).

### Diagrama Sugerido

```text
  [ recebido ] ─────────► [ cancelado ]
       │                         ▲
       ▼                         │
  [ em_preparacao ] ─────────────┤
       │                         │
       ▼                         │
  [ enviado ] ───────────────────┘
       │
       ▼
  [ entregue ]
```

| Status Atual | Transições Sugeridas | Observação |
| :--- | :--- | :--- |
| `recebido` | `em_preparacao`, `cancelado` | Início do fluxo |
| `em_preparacao` | `enviado`, `cancelado` | Em processamento |
| `enviado` | `entregue`, `cancelado` | A caminho ou para retirada |
| `entregue` | *Nenhuma* | Estado final (não permite novas alterações) |
| `cancelado` | *Nenhuma* | Estado final (não permite novas alterações) |


<br><br><br>

## 🧪 Testes Automatizados

O projeto utiliza o framework **Jest** em conjunto com **Supertest** para garantir a integridade dos endpoints e regras de negócio.

### Como Executar os Testes
Para rodar a suíte completa de testes:
```bash
npm test
```

### Cobertura dos Cenários
- **Criação (`POST /pedidos`):**
  - Cadastro de pedido válido com status HTTP 201 e dados persistidos.
  - Validações de erro (HTTP 400) para cliente vazio, valor inválido/negativo, tipo não reconhecido e prioridade inválida.
- **Listagem (`GET /pedidos`):**
  - Retorno de lista vazia quando não há pedidos.
  - Listagem completa dos pedidos cadastrados com HTTP 200.
- **Consulta (`GET /pedidos/:id`):**
  - Consulta bem-sucedida de pedido existente por ID (HTTP 200).
  - Tratamento de ID não encontrado (HTTP 404).
  - Tratamento de identificador inválido/não numérico (HTTP 400).
- **Atualização de Status (`PATCH /pedidos/:id/status`):**
  - Atualização bem-sucedida de status (HTTP 200).
  - Rejeição de status inválido (HTTP 400).
  - Atualização em ID inexistente (HTTP 404).



<br>


## Registro de Uso de IA
Durante o desenvolvimento um agente de modelo de linguagem foi utilizado em apoio. 

Acompanha em destaque trechos que pode ser mencionado diretamente como assistência: 

 - Código com regras para validar os campos de dados (arquivo pedidoService.js)
 - Adpatar o código de repositório para criar o documento com o formato MARKDOWN.md

 Dessa forma, com as respostas geradas para o código pude identificar possiveis desvio do funcionamento previsto da lógica, e  o tratamento para preservar o comportamento esperado. Além disso o template pôde ser convertido para refletir o código ao documento README.md