const express = require('express');
const app = express();
const fs = require('fs');
const QRCode = require('qrcode');

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/produtos', (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('./data/produtos.json'));
  const estoque = JSON.parse(fs.readFileSync('./data/estoque.json'));

  const combinado = produtos.map(p => {
    const e = estoque.find(x => x.nome === p.nome);
    return { ...p, estoque: e ? e.caixas : 0 };
  });

  res.json(combinado);
});

app.get('/pedidos', (req, res) => {
  const pedidos = JSON.parse(fs.readFileSync('./data/pedidos.json'));
  res.json(pedidos);
});

app.post('/pedido', async (req, res) => {

  const pedidos = JSON.parse(fs.readFileSync('./data/pedidos.json', 'utf8') || '[]');
  const estoque = JSON.parse(fs.readFileSync('./data/estoque.json'));

  const item = estoque.find(p => p.nome === req.body.nome);

  if (!item || item.caixas < req.body.qtd) {
    return res.json({ erro: "Sem estoque suficiente" });
  }

  item.caixas -= req.body.qtd;

  fs.writeFileSync('./data/estoque.json', JSON.stringify(estoque, null, 2));

  const novo = {
    id: Date.now(),
    status: "aguardando",
    ...req.body
  };

  pedidos.push(novo);

  fs.writeFileSync('./data/pedidos.json', JSON.stringify(pedidos, null, 2));

  const chavePix = "21993038280";
  const qr = await QRCode.toDataURL(chavePix);

  res.json({ ...novo, qr });

});

app.post('/pago/:id', (req, res) => {

  const pedidos = JSON.parse(fs.readFileSync('./data/pedidos.json'));

  const atualizado = pedidos.map(p => {
    if (p.id == req.params.id) {
      p.status = "pago";
    }
    return p;
  });

  fs.writeFileSync('./data/pedidos.json', JSON.stringify(atualizado, null, 2));

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log('🔥 SISTEMA COM ESTOQUE ONLINE');
});
