// Api Swagger 文件 https://hexschoollivejs.herokuapp.com/api-docs/jinjin

// 產品 https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/jinjin/products

// 全域共用拉出來
let data = {};
let cartData = [];
const productWrap = document.querySelector(".productWrap");
let str = "";
const selection = document.querySelector(".productSelect");
const shoppingCartList = document.querySelector(".shoppingCart-tableBody");
const shoppingCartFoot = document.querySelector(".shoppingCart-tableFoot");
const delAll = document.querySelector(".discardAllBtn");

// 初始化
function init() {
  getProductData();
}
// 串api抓商品資料
function getProductData() {
  axios
    .get(
      "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/jinjin/products"
    )
    .then(function (res) {
      //   console.log(res.data.products);
      data = res.data;
      //   console.log(data);
      renderProducts();
      getCartList();
    });
}
// 抓出重複的render product
function combineProductHTML(item) {
  return `<li class="productCard">
  <h4 class="productType">新品</h4>
  <img
    src="${item.images}"
    alt=""
  />
  <a href="#" class="js-addCart" id="addCardBtn" data-id=${item.id}>加入購物車</a>
  <h3>${item.title}</h3>
  <del class="originPrice">NT$${item.origin_price}</del>
  <p class="nowPrice">NT$${item.price}</p>
</li>`;
}

// 抓到的資料秀出產品列表
function renderProducts() {
  data.products.forEach(function (item, index) {
    // console.log(item);
    str += combineProductHTML(item);
  });

  productWrap.innerHTML = str;
}

// 篩選區
selection.addEventListener("change", function (e) {
  // console.log(selection.value);
  const category = e.target.value;
  console.log(category);
  // 這裡要做category==全部 是因為raw data裡面沒有全部這個選項
  if (category == "全部") {
    renderProducts();
    return;
  }

  // category 不是全部的時候
  let str = "";
  data.products.forEach(function (item) {
    if (item.category == category) {
      str += combineProductHTML(item);
    }
    productWrap.innerHTML = str;
  });
});

// 加入購物車按鈕
productWrap.addEventListener("click", function (e) {
  // 先阻止預設回到#的行為，以免它一直往上彈
  e.preventDefault();
  // console.log(e.target.getAttribute("id"));
  let addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "js-addCart") {
    return;
  }
  let productId = e.target.getAttribute("data-id");

  // 現在做點擊時加入後台資料的動作
  let cartnumber = 1;
  cartData.forEach(function (item) {
    if (item.product.id == productId) {
      cartnumber = item.quantity += 1;
    }
  });

  // 實際串接購物車資料
  axios
    .post(
      "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/jinjin/carts",
      {
        data: {
          productId: productId,
          quantity: cartnumber,
        },
      }
    )
    .then(function (res) {
      // console.log(res);
      // alert("加入成功");
      getCartList();
    });
});

// 串購物車籃api，抓購物車資料
function getCartList() {
  axios
    .get(
      "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/jinjin/carts"
    )
    .then(function (res) {
      // console.log(res.data.carts);
      // console.log(res.data.finalTotal);
      cartData = res.data.carts;
      // 計算總金額
      document.querySelector(".totalMoney").textContent = res.data.finalTotal;
      renderCartList();
    });
}

// render購物車內資料
function renderCartList() {
  let str = "";
  cartData.forEach(function (item) {
    // console.log(item);
    str += `<tr>
    <td>
      <div class="cardItem-title">
        <img src="${item.product.images}" alt="" />
        <p>${item.product.title}</p>
      </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>NT$${item.product.price * item.quantity}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" data-id=${item.id} data-title='${
      item.product.title
    }'> clear </a>
    </td>
  </tr>`;
  });
  shoppingCartList.innerHTML = str;
}

// 刪除單筆-購物車列表刪除鈕
shoppingCartList.addEventListener("click", function (e) {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id");
  const carttitle = e.target.getAttribute("data-title");
  if (cartId == null) {
    alert("not this");
    return;
  }
  // console.log(carttitle);
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/jinjin/carts/${cartId}`
    )
    .then(function (res) {
      alert(`刪除${carttitle}成功`);
      getCartList();
    });
});

// tfoot監聽，刪除全部與總金額異動
shoppingCartFoot.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.getAttribute("class") == "discardAllBtn") {
    axios
      .delete(
        `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/jinjin/carts`
      )
      .then(function (res) {
        alert(`刪除全部成功`);
        getCartList();
      })
      .catch(function (res) {
        alert("購物車空空如也");
      });
  }
});

init();
