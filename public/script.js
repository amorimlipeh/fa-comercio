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

      const precoCaixa = precoUnit * p.caixa * qtd;
      const revenda = precoUnit * 2;
      const lucroTotal = (revenda - precoUnit) * p.caixa * qtd;

      return `
      <div class="produto">
        <h2>${p.nome}</h2>

        <p>📦 Caixa com ${p.caixa} unidades</p>

        <p>💰 Você paga: R$${precoUnit.toFixed(2)}</p>

        <h3>💣 Total: R$${precoCaixa.toFixed(2)}</h3>

        <p>🚀 Revenda sugerida: R$${revenda.toFixed(2)}</p>
        <p>💸 Lucro estimado: R$${lucroTotal.toFixed(2)}</p>

        <p>⚠️ ESTOQUE LIMITADO</p>

        <div>
          <button onclick="menos('${p.nome}')">-</button>
          <span id="qtd-${p.nome}">${qtd}</span>
          <button onclick="mais('${p.nome}')">+</button>
        </div>

        <button onclick="comprar('${p.nome}', ${precoCaixa}, ${qtd})">
          COMPRAR AGORA
        </button>
      </div>`;
    }

    container.innerHTML += `<div id="produto-${p.nome}">${render()}</div>`;

    window.mais = (nome) => {
      if (nome === p.nome) {
        qtd++;
        document.getElementById("produto-" + p.nome).innerHTML = render();
      }
    }

    window.menos = (nome) => {
      if (nome === p.nome && qtd > 1) {
        qtd--;
        document.getElementById("produto-" + p.nome).innerHTML = render();
      }
    }

  });

});

function comprar(nome, preco, qtd) {
  const msg = `🔥 Quero comprar ${qtd} caixa(s) de ${nome}  
💰 Total: R$${preco}`;
  window.open(`https://wa.me/5521SEUNUMERO?text=${encodeURIComponent(msg)}`);
}
