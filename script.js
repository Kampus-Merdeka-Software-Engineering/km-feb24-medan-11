const body = document.querySelector("body"),
  sidebar = body.querySelector(".sidebar"),
  toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    modeText.innerText = "Light Mode";
  } else {
    modeText.innerText = "Dark Mode";
  }
});

//Fungsi untuk menampilkan total sales price dan total unit sales berupa data total
function displayTotalSalesPrice(arrTotalSalePrice) {
  var numTotalSalePrice = 0;

  // Looping untuk menghitung total sales price dari data yang diterima (JSON Object)
  arrTotalSalePrice.forEach((item) => {
    numTotalSalePrice += parseInt(item.total);
  });

  //DOM Manipulation untuk menampilkan total sales price dan total unit sales
  document.getElementById("total-sales-price").textContent =
    "$" + numTotalSalePrice;
  document.getElementById("total-unit-sales").textContent =
    arrTotalSalePrice.length;
}

//Fungsi untuk menampilkan chart sales growth berupa data borough dan sale price
function displaySalesGrowthChart(arrSalesGrowth) {
  
    //ctx adalah variabel yang digunakan untuk menampung chart dalam bentuk html tag <canvas>
  var ctx = document.getElementById("sales-growth-chart");

  //Penampung data untuk array 1 dimensi yang isinya nama borough dan angka dari sale price per borough
  var arrBorough = [];
  var arrSales = [];

  //Mengelompokkan data berdasarkan borough dan sale price
  arrSalesGrowth.forEach((item) => {
    if (!arrBorough.includes(item.borough)) {
      arrBorough.push(item.borough);
      arrSales.push(parseFloat(item.sale_price));
    } else {
      var index = arrBorough.indexOf(item.borough);
      arrSales[index] += parseFloat(item.sale_price);
    }
  });

  //Melakukan transformasi array 1 dimensi menjadi array 2 dimensi
  var objArrSalesGrowth = [];
  arrBorough.forEach((item, index) => {
    objArrSalesGrowth.push({
      borough: item,
      sales: arrSales[index],
    });
  });

  //Mengurutkan data berdasarkan sale price lewat array 2 dimensi
  objArrSalesGrowth.sort((a, b) => a.sales - b.sales);

  //Mengembalikan data yang sudah diurutkan (sort) dari array 2 dimensi ke array 1 dimensi
  objArrSalesGrowth.forEach((item, index) => {
    arrBorough[index] = item.borough;
    arrSales[index] = item.sales;
  });

  //Contoh melakukan generate chart. Perhatikan opsi labels dan data!
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: arrBorough,
      datasets: [
        {
          label: "Total of Sale Price",
          data: arrSales,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

//Melakukan penarikan data dari scorecard-total-sale-price.json
fetch("JSON_file/scorecard-total-sale-price.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displayTotalSalesPrice(data);
  });

//Melakukan penarikan data dari chart-sales-growth.json
fetch("JSON_file/chart-sales-growth.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displaySalesGrowthChart(data);
  });
