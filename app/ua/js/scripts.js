let list = $('#products-container .list'),
  curtButton = $('#curt-button'),
  cart = {},
  countProduct = 0,
  quantityGoods = 0,
  cartPopup = $('#curt-popup');

if(JSON.parse(localStorage.getItem('quantityGoods'))){
  quantityGoods = JSON.parse(localStorage.getItem('quantityGoods'));
} else {
  quantityGoods = 0;
}

const init = () => {
  $.getJSON('../price.json').done(productsOut);
};

// виводимо продукти в рядок пошуку
const productsOut = (data) => {
  let out = "",
    id = 0,
    value = $('#search-product').val();

  // перевірка кількості товарів
  if(JSON.parse(localStorage.getItem('cart'))){
    var cartItems = JSON.parse(localStorage.getItem('cart'));
    quantityGoods = 0;

    for (let id in cartItems){
      quantityGoods = quantityGoods + 1;
    }
  }
  localStorage.setItem('quantityGoods', JSON.stringify((quantityGoods)));
  // перевірка кількості товарів

  for (let key in data) {
    let product = data[id]['Товар'].toLowerCase();

    value = value.toLowerCase();

    if (product.match(value) !== null) {
      list.fadeIn(300);

      out += `<div class="product">`;
      out += `<h2>${data[id]['Товар']}</h2>`;
      out += `<div class="container">`;
      out += `<div class="price">${data[id]['Цена']} грн.</div>`;
      out += `<div class="manufacturer">${data[id]["Производитель"]}</div>`;
      out += `<div>${data[id]["Наличие"]}</div>`;
      if (quantityGoods < 3){
        out += `<button class="add-to-cart" data-product='${id}' type="button">В Корзину</button>`;
      } else {
        out += `<button class="disabled" data-product='${id}' type="button" disabled>Корзина заповнена</button>`;
      }
      out += `</div>`;
      out += `</div>`;
    }

    id++;
  }

  if(out === ""){
    list.text('Нет результатов');
  } else {
    list.html(out);
  }

  $('.add-to-cart').on('click', addToCart);
};

// добавити в корзину
function addToCart() {
  let id = $(this).attr('data-product');
  id = +id;

  if (cart[id] === undefined) {
    cart[id] = 1;
    curtButton.addClass('hide');
  } else {
    cart[id]++;
  }

  countProduct++;
  curtButton.find('.count').text(countProduct);

  curtButton.removeClass('hide');
  showCart();
  saveCart();
};



// показати кнопку якщо в корзині є товар
const showPopupToCart = () => {
  if (localStorage.getItem('cartCount')) {
    countProduct = JSON.parse(localStorage.getItem('cartCount'));

    if (countProduct > 0 && countProduct !== 0) {
      curtButton.removeClass('hide').find('.count').text(countProduct);
    } else {
      curtButton.addClass('hide');

      $.magnificPopup.close({
        mainClass: 'mfp-zoom-in'
      });
    }
  }
};

// завантаження товарів в попап
const loadCart = () => {
  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    showCart();
  }
};

function showCart() {
  $.getJSON('../price.json', function (data) {
    let product = data;
    let out = '';

    for (let id in cart) {
      out += `<div class="product">`;
      out += `<div class="description">`;
      out += `<h3 class="name">${product[id]["Товар"]}</h3>`;
      out += `<p class="manufacturer">${product[id]['Производитель']}</p>`;
      out += `</div>`;
      out += `<div class="count-delete">`;
      out += `<div class="calc">`;
      out += `<button type="button" class="minus calc-btn" data-id="${id}" data-count="${cart[id]}">-</button>`;
      out += `<div class="count">${cart[id]}</div>`;
      out += `<button type="button" class="plus calc-btn" data-id="${id}" data-count="${cart[id]}">+</button>`;
      out += `</div>`;
      out += `<div class="price"><span class="count-sum">${(cart[id] * product[id]["Цена"]).toFixed(2)}</span> грн.</div>`;
      out += `<button class="delete" type="button" data-id="${id}" data-count="${cart[id]}">Видалити</button>`;
      out += `</div>`;
      out += `</div>`;
    }

    $('#mini-cart').html(out);
    $('#mini-cart .delete').on('click', delProduct);
    $('.plus.calc-btn').on('click', plusProduct);
    $('.minus.calc-btn').on('click', minusProduct);
    totalSum();
  });
};

function totalSum() {
  let totalSum = 0;

  $('#mini-cart .count-sum').each(function () {
    let price = $(this).text();
    totalSum = totalSum + +price;
  });

  totalSum = totalSum.toFixed(2);

  $('#total-sum').val(totalSum + " грн.");
}

function plusProduct() {
  let $this = $(this);
  let id = $this.attr('data-id');

  cart[id]++;
  countProduct++;
  localStorage.setItem('cartCount', JSON.stringify((countProduct)));
  curtButton.find('.count').text(countProduct);
  saveCart();
  showCart();
}

function minusProduct() {
  let $this = $(this);
  let id = $this.attr('data-id');

  if(cart[id] > 1 ){
    cart[id]--;
    countProduct--;

    localStorage.setItem('cartCount', JSON.stringify((countProduct)));
    curtButton.find('.count').text(countProduct);
    saveCart();
    showCart();
  }
}

function delProduct() {
  quantityGoods--;
  localStorage.setItem('quantityGoods', JSON.stringify((quantityGoods)));

  let $this = $(this),
    id = $this.attr('data-id'),
    count = $this.attr('data-count');

  count = +count;
  delete cart[id];
  countProduct = countProduct - count;
  localStorage.setItem('cartCount', JSON.stringify((countProduct)));
  curtButton.find('.count').text(countProduct);
  showPopupToCart();
  saveCart();
  showCart();
}

// зберігає данні в localStorage
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify((cart)));
  localStorage.setItem('cartCount', JSON.stringify((countProduct)));
};

function sendEmail(url) {
  let urlLink = url;
  let name = cartPopup.find('#name-input').val();
  let tel = cartPopup.find('#tel-input').val();
  let totalSum = cartPopup.find('#total-sum').val();
  let pharmacy = cartPopup.find('#pharmacy-select').val();

  if (name !== '' && tel !== '') {

    $.post(
      urlLink,
      {
        "name": name,
        "tel": tel,
        "totalSum": totalSum,
        "pharmacy": pharmacy,
        "cart": cart
      },
      function (data) {
        if (data === 'mail_success') {
          localStorage.clear();
          location.reload();

          $.magnificPopup.close({
            mainClass: 'mfp-zoom-in'
          });

          curtButton.addClass('hide');
        }
      }
    )
  }
};

function send_callback(element, mail) {
  var form = '#' + element;
  var msg = $(form).serialize();

  $.ajax({
    type: 'POST',
    url: mail,
    data: msg,
    success: function(data) {
      if (data == "mail error") {
        alert('Ошибка отправки!');
      }

      else if (data == "mail success") {
        $(form)[0].reset();

        $.magnificPopup.close({
          mainClass: 'mfp-zoom-in'
        });
      }
    },
    error: function(xhr, str){
      alert('Error: ' + xhr.responseCode + ' Please, try again later.');
    }
  });
}

$(function () {
  showPopupToCart();
  loadCart();

  const $searchProduct = $("#search-product");

  document.onkeydown = function (e) {
    init();

    if (e.keyCode == 8) {
      init();
    }
  };

  $searchProduct.focusout(function () {
    list.fadeOut(300);
  });

  $('.popup').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',

    closeBtnInside: true,
    preloader: false,

    midClick: true,
    removalDelay: 300,
    mainClass: 'mfp-zoom-in'
  });

  $('.send-email').on('click', sendEmail);

  $(".go-to").on('click',function(e){

    e.preventDefault();

    var anchor = $(this).attr("href");

    if ($(anchor).length) {
      var run = $(anchor).offset().top;
      $('body,html').stop().animate({scrollTop: run}, 1500);
    } else {
      console.warn("ID don't search!")
    }
  });

  $('.popup-youtube').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });
});
