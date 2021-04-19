//https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json

let data = [];
function getData() {
  axios
    .get(
      "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
    )
    .then(function (res) {
      data = res.data;
      console.log(data);
      renderData();
      filterData();
    });
}

//   CS 資料呈現
function filterData() {
  //   先整理資料
  let totalObj = {};
  data.data.forEach(function (item, index) {
    if (totalObj[item.area] == undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  });
  console.log(totalObj);

  // C3格式
  let csData = [];
  let newdata = Object.keys(totalObj);
  console.log(newdata);
  newdata.forEach(function (item, index) {
    let ary = [];
    ary.push(item);
    //   console.log(totalObj[item]);
    ary.push(totalObj[item]);
    //   console.log(ary);
    csData.push(ary);
  });
  console.log(csData);

  // 將 csData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: csData,
      type: "donut",
    },
    donut: {
      title: "地區",
    },
  });
}

// 下方卡片呈現
function renderData() {
  const card_area = document.querySelector(".ticketCard-area");
  data.data.forEach(function (item) {
    console.log(item);
    card_area.innerHTML += `<li class="ticketCard">
            <div class="ticketCard-img">
                <a href="#">
                    <img src="${item.imgUrl}" alt="">
                </a>
                <div class="ticketCard-region">${item.area}</div>
                <div class="ticketCard-rank">${item.rate}</div>
            </div>
            <div class="ticketCard-content">
                <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                    ${item.description}
                    </p>
                </div>
                <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${item.price}</span>
                    </p>
                </div>
            </div>
            </li>`;
  });
}

getData();
