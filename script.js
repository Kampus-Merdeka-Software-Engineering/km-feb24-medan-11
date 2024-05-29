const body = document.querySelector("body"),
  sidebar = body.querySelector(".sidebar"),
  toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text"),
  toggle_top = body.querySelector(".toggleTop");

// Variabel penampung chart
var salesGrowthChart = null;
var totalUnitSalesChart = null;
var dataSalesGrowth = null;
var dataUniteSaleBoroughChart = null;
var uniteSaleBoroughChart = null;

// Sidebar Section
toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});
toggle_top.addEventListener("click", () => {
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

// Fungsi untuk meringkas angka menjadi format ribuan (k) atau miliaran (b)
function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

// function total-sales-price
function displayTotalSalesPrice(arrTotalSalesPrice) {
  var numTotalSalesPrice = 0;
  arrTotalSalesPrice.forEach((item) => {
    numTotalSalesPrice += parseInt(item.sale_price);
  });
  var formattedTotalSalesPrice = formatNumber(numTotalSalesPrice);
  document.getElementById("total-sales-price").textContent =
    "$" + formattedTotalSalesPrice;
}

// function total-unit-sales
function displayTotalUnitSales(arrTotalUnitSales) {
  var numTotalUnitSales = 0;
  arrTotalUnitSales.forEach((item) => {
    numTotalUnitSales = parseInt(arrTotalUnitSales.length);
  });
  var formattedTotalUnitSales = formatNumber(numTotalUnitSales);
  document.getElementById("total-unit-sales").textContent =
    formattedTotalUnitSales;
}

// Fungsi untuk mengurai kuartal dan tahun dari string
function parseQuarterAndYear(quarterYear) {
  const [quarter, year] = quarterYear.split(" ");
  const quarterNumber = parseInt(quarter.replace("Q", ""));
  return { quarterNumber, year: parseInt(year) };
}

// Fungsi untuk membandingkan kuartal dan tahun
function compareQuarterAndYear(a, b) {
  const parsedA = parseQuarterAndYear(a);
  const parsedB = parseQuarterAndYear(b);

  if (parsedA.year !== parsedB.year) {
    return parsedA.year - parsedB.year;
  } else {
    return parsedA.quarterNumber - parsedB.quarterNumber;
  }
}

// function sales growth
function displaySalesGrowthChart(arrSalesGrowth) {
  var ctx = document.getElementById("sales-growth-chart").getContext("2d");
  var arrSaleDate = [];
  var boroughSalesData = {};

  arrSalesGrowth.forEach((item) => {
    if (!arrSaleDate.includes(item.sale_date)) {
      arrSaleDate.push(item.sale_date);
    }
    if (!boroughSalesData[item.borough]) {
      boroughSalesData[item.borough] = Array(arrSaleDate.length).fill(0);
    }
  });

  // Urutkan arrSaleDate berdasarkan kuartal dan tahun
  arrSaleDate.sort(compareQuarterAndYear);

  // Perbarui panjang array boroughSalesData setelah pengurutan
  Object.keys(boroughSalesData).forEach((borough) => {
    boroughSalesData[borough] = Array(arrSaleDate.length).fill(0);
  });

  arrSalesGrowth.forEach((item) => {
    var dateIndex = arrSaleDate.indexOf(item.sale_date);
    boroughSalesData[item.borough][dateIndex] =
      (boroughSalesData[item.borough][dateIndex] || 0) +
      parseFloat(item.sale_price);
  });

  var datasets = [];
  Object.keys(boroughSalesData).forEach((borough) => {
    datasets.push({
      label: borough,
      data: boroughSalesData[borough],
      borderWidth: 1,
      fill: false,
      yAxisID: "y",
    });
  });

  window.dataSalesGrowth = datasets;

  window.salesGrowthChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: arrSaleDate,
      datasets: datasets,
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      plugins: {
        // title: {
        //   display: true,
        //   text: 'Chart.js Line Chart - Multi Axis'
        // }
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
        },
      },
    },
  });
}

// function total unit sales
function displayTotalUnitSalesChart(arrTotalUnitSales) {
  var ctx = document.getElementById("unit-sales-chart");
  var arrBorough = [];
  var arrTotalUnit = [];
  arrTotalUnitSales.forEach((item) => {
    if (!arrBorough.includes(item.borough)) {
      arrBorough.push(item.borough);
      arrTotalUnit.push(parseInt(item.total_unit_sale));
    } else {
      var index = arrBorough.indexOf(item.borough);
      arrTotalUnit[index] += parseInt(item.total_unit_sale);
    }
  });

  var datasets = [
    {
      label: "Total of Unit Sales",
      data: arrTotalUnit,
      borderWidth: 1,
    },
  ];

  // Simpan dataset asli untuk referensi
  window.dataUniteSaleBoroughChart = arrTotalUnitSales;

  window.uniteSaleBoroughChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: arrBorough,
      datasets: datasets,
    },
    options: {
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// narik data scorecard-total-sales-price.json
fetch("JSON-file/scorecard.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displayTotalSalesPrice(data);
  });

// narik data scorecard-total-unit-sales.json
fetch("JSON-file/scorecard.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displayTotalUnitSales(data);
  });

// narik data chart-sales-growth.json
fetch("JSON-file/scorecard.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displaySalesGrowthChart(data);
  });

// narik data chart-unite-sale-borough.json
fetch("JSON-file/chart-unite-sale-borough.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    displayTotalUnitSalesChart(data);
  });

function onSelectFilterBoroughSalesGrowth(borough) {
  var filteredDataset = window.dataSalesGrowth.filter((dataset) => {
    return dataset.label === borough;
  });
  if (borough === "All" || filteredDataset.length === 0) {
    filteredDataset = window.dataSalesGrowth;
  }
  window.salesGrowthChart.data.datasets = filteredDataset;
  window.salesGrowthChart.update();
}

function onSelectFilterBoroughUniteSalesChart(borough) {
  var filteredData = [];

  if (borough === "All") {
    filteredData = window.dataUniteSaleBoroughChart;
  } else {
    filteredData = window.dataUniteSaleBoroughChart.filter((item) => {
      return item.borough === borough;
    });
  }

  var arrBorough = [];
  var arrTotalUnit = [];
  filteredData.forEach((item) => {
    if (!arrBorough.includes(item.borough)) {
      arrBorough.push(item.borough);
      arrTotalUnit.push(parseInt(item.total_unit_sale));
    } else {
      var index = arrBorough.indexOf(item.borough);
      arrTotalUnit[index] += parseInt(item.total_unit_sale);
    }
  });

  window.uniteSaleBoroughChart.data.labels = arrBorough;
  window.uniteSaleBoroughChart.data.datasets[0].data = arrTotalUnit;
  window.uniteSaleBoroughChart.update();
}
