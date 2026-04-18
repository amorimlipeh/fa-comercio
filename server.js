const express = require('express');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/produtos', (req, res) => {
  const produtos = JSON.parse(fs.readFileSync('./data/produtos.json'));
  res.json(produtos);
});

app.listen(PORT, () => {
  console.log('🔥 ONLINE NA PORTA ' + PORT);
});
