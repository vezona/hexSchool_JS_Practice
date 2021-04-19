// Api Swagger 文件 https://hexschoollivejs.herokuapp.com/api-docs/jinjin

// 產品 https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/jinjin/products

let data = {};
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
    });
}

function renderProducts() {
  let productWrap = document.querySelector(".productWrap");
  data.products.forEach(function (item, index) {
    // console.log(item);
    productWrap.innerHTML += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${item.images}"
      alt=""
    />
    <a href="#" id="addCardBtn">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
  </li>`;
  });
}

getProductData();
