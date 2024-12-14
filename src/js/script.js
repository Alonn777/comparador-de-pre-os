/* 
Logica de progamação
[x] Pegar os dados do input. quando o botão for clicado
[x] ir ate o servidor e trazer os produtos
[x]Colocor os produtos na tela
[]Criar o grafico de preços
*/
//dados do input pegado aqui abaixo
const searchForm = document.querySelector('.search-form');
const productList = document.querySelector('.product-list');
const priceChart = document.querySelector('.price-chart')

let myChart = ''
searchForm.addEventListener('submit', async function (event) {
  event.preventDefault()
  const inputValue = (event.target[0].value)

  // fomos ate o servidor do mercado livre e colocamos a API dos produtos
  const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${inputValue}`)

  const products = (await data.json()).results.slice(0, 10)
  displayItems(products)
  updatePriceChart(products)
})

function displayItems(products) {
  console.log(products)
  productList.innerHTML = products.map(product => `
   <div class="product-card">
     <img src="${product.thumbnail.replace(/\w\.jpg/gi, 'W.jpg')}" alt="${product.title}">
     <h3> ${product.title} </h3>
     <p class="price"> ${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </p>
     <p> Loja: ${product.seller.nickname}</p>
   </div> `).join('')
}
function updatePriceChart(products) {
  const ctx = priceChart.getContext('2d');

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: products.map(product => product.title.substring(0, 20) + '...'),
      datasets: [{
        label: 'Preços (R$)',
        data: products.map(product => product.price),
        backgroundColor: 'rgba(46, 204, 113, 0.6)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return 'R$ ' + value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              });
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Comparador de Preços',
          font: {
            size: 18
          }
        }
      }
    }
  });
}
//
//"http://http2.mlstatic.com/D_922013-MLM51559385450_092022-I.jpg"