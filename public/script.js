fetch('/produtos')
.then(res => res.json())
.then(produtos => {

  const container = document.getElementById('produtos');

  produtos.forEach(p => {

    let qtd = 1;

    let lucroUnit = 1.2;
    if (p.custo > 10) {
      lucroUnit = p.custo * 0.3;
    }

    const precoUnit = p.custo + lucroUnit;

    function render() {

      const total = precoUnit * p.caixa * qtd;

      return `
      <div class="produto">
        <h2>${p.nome}</h2>
        <p>Total: R$${total.toFixed(2)}</p>

        <div>
          <button onclick="menos('${p.nome}')">-</button>
          ${qtd}
          <button onclick="mais('${p.nome}')">+</button>
        </div>

        <button onclick="pedido('${p.nome}', ${total}, ${qtd})">
          PAGAR AGORA
        </button>
      </div>`;
    }

    container.innerHTML += `<div id="p-${p.nome}">${render()}</div>`;

    window.mais = (nome) => {
      if (nome === p.nome) {
        qtd++;
        document.getElementById("p-" + p.nome).innerHTML = render();
      }
    }

    window.menos = (nome) => {
      if (nome === p.nome && qtd > 1) {
        qtd--;
        document.getElementById("p-" + p.nome).innerHTML = render();
      }
    }

  });

});

function pedido(nome, total, qtd) {
  fetch('/pedido', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, total, qtd })
  })
  .then(res => res.json())
  .then(p => {

    document.body.innerHTML = `
      <div style="text-align:center; color:white; background:#111; padding:20px;">
        <h2>Pedido #${p.id}</h2>
        <p>Total: R$${total}</p>

        <h3>📲 Pague via PIX</h3>
        <img src="${p.qr}" width="250"/>

        <p>Status: AGUARDANDO</p>

        <button onclick="confirmar(${p.id})">
          JÁ PAGUEI
        </button>
      </div>
    `;

  });
}

function confirmar(id) {
  fetch('/pago/' + id, { method: 'POST' })
  .then(() => {
    alert('Pagamento confirmado!');
    location.reload();
  });
}
