const express = require('express');
const app = express();
const fs = require('fs');
const QRCode = require('qrcode');

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

app.post('/pedido', async (req, res) => {

  const pedidos = JSON.parse(fs.readFileSync('./data/pedidos.json', 'utf8') || '[]');

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
  console.log('🔥 SISTEMA MASTER ONLINE');
});
