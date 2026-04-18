fetch('/produtos')
.then(res => res.json())
.then(produtos => {

  const container = document.getElementById('produtos');

  produtos.forEach(p => {

    let qtd = 1;

    function render() {

      return `
      <div class="produto">
        <h2>${p.nome}</h2>

        <p>📦 Estoque: ${p.estoque} caixas</p>

        <div>
          <button onclick="menos('${p.nome}')">-</button>
          ${qtd}
          <button onclick="mais('${p.nome}')">+</button>
        </div>

        <button onclick="pedido('${p.nome}', ${qtd})">
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

function pedido(nome, qtd) {
  fetch('/pedido', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, qtd })
  })
  .then(res => res.json())
  .then(p => {

    if (p.erro) {
      alert("❌ Sem estoque");
      return;
    }

    document.body.innerHTML = `
      <h2>Pedido criado</h2>
      <p>ID: ${p.id}</p>
      <img src="${p.qr}" width="250"/>
    `;
  });
}
