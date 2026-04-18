fetch('/produtos')
.then(res => res.json())
.then(produtos => {

  const container = document.getElementById('produtos');

  produtos.forEach(p => {

    let lucroUnit = 1.2;
    if (p.custo > 10) {
      lucroUnit = p.custo * 0.3;
    }

    const precoUnit = p.custo + lucroUnit;
    const precoCaixa = precoUnit * p.caixa;

    const revenda = precoUnit * 2;
    const lucroTotal = (revenda - precoUnit) * p.caixa;

    container.innerHTML += `
    <div class="produto">
      <h2>${p.nome}</h2>

      <p>📦 Caixa com ${p.caixa} unidades</p>

      <p>💰 Você paga: R$${precoUnit.toFixed(2)}</p>

      <h3>💣 Caixa: R$${precoCaixa.toFixed(2)}</h3>

      <p>🚀 Revenda sugerida: R$${revenda.toFixed(2)}</p>
      <p>💸 Lucro estimado: R$${lucroTotal.toFixed(2)}</p>

      <p>⚠️ ESTOQUE LIMITADO</p>

      <button onclick="comprar('${p.nome}', ${precoCaixa})">
        COMPRAR CAIXA
      </button>
    </div>`;
  });

});

function comprar(nome, preco) {
  const msg = `Quero comprar a caixa de ${nome} por R$${preco}`;
  window.open(`https://wa.me/5521SEUNUMERO?text=${encodeURIComponent(msg)}`);
}
