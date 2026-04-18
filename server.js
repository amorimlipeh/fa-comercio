const express = require('express');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/produtos', (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('./data/produtos.json'));
  res.json(produtos);
});

app.get('/pedidos', (req, res) => {
  const pedidos = JSON.parse(fs.readFileSync('./data/pedidos.json'));
  res.json(pedidos);
});

app.post('/pedido', (req, res) => {
  const pedidos = JSON.parse(fs.readFileSync('./data/pedidos.json', 'utf8') || '[]');

  const novo = {
    id: Date.now(),
    ...req.body
  };

  pedidos.push(novo);

  fs.writeFileSync('./data/pedidos.json', JSON.stringify(pedidos, null, 2));

  res.json(novo);
});

app.listen(PORT, () => {
  console.log('🔥 SISTEMA ONLINE');
});
