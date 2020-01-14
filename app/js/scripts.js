let list = $('#products-container .list');

const init = () => {
  $.getJSON('../price.json').done(productsOut);
};

const productsOut = (data) => {
  // let products = JSON.parse(data);
  // console.log(data);

  let out = "",
      id = 0,
      value = $('#search-product').val();


  for(let key in data){
    let product = data[id]['Товар'].toLowerCase();

    value = value.toLowerCase();

    if(product.indexOf(value) === 0){
      list.fadeIn(300);

      out += `<div class="product">`;
      out +=`<h2>${data[id]['Товар']}</h2>`;
      out += `<div class="container">`;
      out += `<div class="price">${data[id]['Цена']} грн.</div>`;
      out += `<button class="button" type="button">В Корзину</button>`;
      out += `</div>`;
      out += `</div>`;
    }

    id++;
  }

  list.html(out);
};

$(function () {
  const $searchProduct = $("#search-product");
  document.onkeydown = function(e) {
    init();

    if (e.keyCode == 8) {
      init();
    }
  };

  $searchProduct.focusout(function () {
    list.fadeOut(300);
  });

  $searchProduct.focus(function () {
    init();
    list.fadeIn(300);
  })
});
