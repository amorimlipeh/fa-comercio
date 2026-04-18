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
      const revenda = precoUnit * 2;
      const lucro = (revenda - precoUnit) * p.caixa * qtd;

      return `
      <div class="produto">
        <h2>${p.nome}</h2>

        <p>📦 Caixa com ${p.caixa}</p>
        <p>💣 Total: R$${total.toFixed(2)}</p>
        <p>💸 Lucro: R$${lucro.toFixed(2)}</p>

        <div>
          <button onclick="menos('${p.nome}')">-</button>
          ${qtd}
          <button onclick="mais('${p.nome}')">+</button>
        </div>

        <button onclick="pedido('${p.nome}', ${total}, ${qtd})">
          FINALIZAR PEDIDO
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, total, qtd })
  })
  .then(res => res.json())
  .then(p => {
    alert('Pedido #' + p.id + ' criado com sucesso!');
  });
}
