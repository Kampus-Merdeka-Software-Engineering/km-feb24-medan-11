const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    toggle_top = body.querySelector(".toggleTop"),
    box_Desc = body.querySelector(".boxDesc"),
    box_Arrow = body.querySelector(".boxArrow");
// Sidebar Section
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});
toggle_top.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});
box_Arrow.addEventListener("click", () => {
    box_Desc.classList.toggle("close");
});
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Light Mode";
    } else {
        modeText.innerText = "Dark Mode";
    }
});

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

function formatNumberTables(num) {
    return "$ " + (num / 1000000000).toFixed(1) + " M";
}

// Function Summary Total Sales Price
function displayTotalSalesPrice(arrTotalSalesPrice) {
    var numTotalSalesPrice = 0;
    arrTotalSalesPrice.forEach((item) => {
        numTotalSalesPrice += parseInt(item.SALE_PRICE);
    });
    var formattedTotalSalesPrice = formatNumber(numTotalSalesPrice);
    document.getElementById("totalsales").textContent =
        "$" + formattedTotalSalesPrice;
}
// Function Sumary Average Sales Price
function displayAvgSalesPrice(arrAvgSalesPrice) {
    var totalUnitSales = arrAvgSalesPrice.length;
    var numAvgSalesPrice = 0;
    arrAvgSalesPrice.forEach((item) => {
        numAvgSalesPrice += parseInt(item.SALE_PRICE);
    });
    let avgSalesPrice = numAvgSalesPrice / totalUnitSales;
    let formattedAvgSalesPrice = formatNumber(avgSalesPrice);
    document.getElementById("avgSales").textContent =
        "$" + formattedAvgSalesPrice;
}
// Function Summary Total Unit Sales
function displayTotalUnitSales(arrTotalUnitSales) {
    var numTotalUnitSales = arrTotalUnitSales.length;
    var formattedTotalUnitSales = formatNumber(numTotalUnitSales);
    document.getElementById("totalUnit").textContent = formattedTotalUnitSales;
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

// Function Chart Sales Growth
function displaySalesGrowthChart(arrSalesGrowth) {
    var ctx = document.getElementById("sales-growth-chart").getContext("2d");
    var arrSaleDate = [];
    var boroughSalesData = {};

    arrSalesGrowth.forEach((item) => {
        if (!arrSaleDate.includes(item.SALE_DATE)) {
            arrSaleDate.push(item.SALE_DATE);
        }
        if (!boroughSalesData[item.BOROUGH]) {
            boroughSalesData[item.BOROUGH] = Array(arrSaleDate.length).fill(0);
        }
    });

    // Urutkan arrSaleDate berdasarkan kuartal dan tahun
    arrSaleDate.sort(compareQuarterAndYear);

    // Perbarui panjang array boroughSalesData setelah pengurutan
    Object.keys(boroughSalesData).forEach((BOROUGH) => {
        boroughSalesData[BOROUGH] = Array(arrSaleDate.length).fill(0);
    });

    arrSalesGrowth.forEach((item) => {
        var dateIndex = arrSaleDate.indexOf(item.SALE_DATE);
        boroughSalesData[item.BOROUGH][dateIndex] =
            (boroughSalesData[item.BOROUGH][dateIndex] || 0) +
            parseFloat(item.SALE_PRICE);
    });

    var datasets = [];
    Object.keys(boroughSalesData).forEach((BOROUGH) => {
        datasets.push({
            label: BOROUGH,
            data: boroughSalesData[BOROUGH],
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
            responsive: true,
            interaction: {
                mode: "index",
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: "Total Sales Growth Based On Borough Per Quarter",
                    font: {
                        size: 16,
                    },
                },
            },
            scales: {
                y: {
                    title: {
                        type: "linear",
                        display: true,
                        position: "left",
                        text: "Total Sales",
                    },
                },
                x: {
                    title: {
                        type: "linear",
                        display: true,
                        position: "bottom",
                        text: "Year Quarter",
                    },
                },
            },
        },
    });
}

// Function Total Unit Sales
function displayTotalUnitSalesChart(arrTotalUnitSales) {
    var ctx = document.getElementById("unit-sales-chart");
    var arrBorough = [];
    var arrTotalUnit = [];
    arrTotalUnitSales.forEach((item) => {
        if (!arrBorough.includes(item.BOROUGH)) {
            arrBorough.push(item.BOROUGH);
            arrTotalUnit.push(parseInt(item.SALE_PRICE * 0 + 1));
        } else {
            var index = arrBorough.indexOf(item.BOROUGH);
            arrTotalUnit[index] += parseInt(item.SALE_PRICE * 0 + 1);
        }
    });
    //Melakukan transformasi array 1 dimensi menjadi array 2 dimensi
    var objArrTotalUnitSales = [];
    arrBorough.forEach((item, index) => {
        objArrTotalUnitSales.push({
            borough: item,
            unit: arrTotalUnit[index],
        });
    });

    //Mengurutkan data berdasarkan sale price lewat array 2 dimensi
    objArrTotalUnitSales.sort((a, b) => b.unit - a.unit);

    //Mengembalikan data yang sudah diurutkan (sort) dari array 2 dimensi ke array 1 dimensi
    objArrTotalUnitSales.forEach((item, index) => {
        arrBorough[index] = item.borough;
        arrTotalUnit[index] = item.unit;
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
            indexAxis: "y",
            plugins: {
                title: {
                    display: true,
                    text: "Total Units Sold by Borough",
                    font: {
                        size: 16,
                    },
                },
            },
            scales: {
                y: {
                    title: {
                        type: "linear",
                        display: true,
                        position: "left",
                        text: "Borough",
                    },
                },
                x: {
                    title: {
                        type: "linear",
                        display: true,
                        position: "bottom",
                        text: "Total Units Sold",
                    },
                },
            },
        },
    });
}
// Function Total Sales by Neighborhood
// function displayNeighborhoodSalesChart(arrNeighborhoodSales) {
//     var ctx = document.getElementById("neighborhood-sales").getContext("2d");
//     var arrSaleDate = [];
//     var neighborhoodSalesData = {};
//     // Menghitung total sales ditiap neighborhood
//     var totalSalesPerNeighborhood = {};

//     arrNeighborhoodSales.forEach((item) => {
//         if (!arrSaleDate.includes(item.SALE_DATE)) {
//             arrSaleDate.push(item.SALE_DATE);
//         }
//         if (!totalSalesPerNeighborhood[item.NEIGHBORHOOD]) {
//             totalSalesPerNeighborhood[item.NEIGHBORHOOD] = 0;
//         }

//         totalSalesPerNeighborhood[item.NEIGHBORHOOD] += parseFloat(
//             item.SALE_PRICE
//         );
//     });
//     // Mengurutkan dan ambil top 5
//     var top5Neighborhoods = Object.keys(totalSalesPerNeighborhood)
//         .sort(
//             (a, b) =>
//                 totalSalesPerNeighborhood[b] - totalSalesPerNeighborhood[a]
//         )
//         .slice(0, 5);

//     top5Neighborhoods.forEach((NEIGHBORHOOD) => {
//         neighborhoodSalesData[NEIGHBORHOOD] = Array(arrSaleDate.length).fill(0);
//     });
//     // Urutkan arrSaleDate berdasarkan kuartal dan tahun
//     arrSaleDate.sort(compareQuarterAndYear);

//     arrNeighborhoodSales.forEach((item) => {
//         if (top5Neighborhoods.includes(item.NEIGHBORHOOD)) {
//             var dateIndex = arrSaleDate.indexOf(item.SALE_DATE);
//             neighborhoodSalesData[item.NEIGHBORHOOD][dateIndex] += parseFloat(
//                 item.SALE_PRICE
//             );
//         }
//     });

//     var datasets = [];
//     top5Neighborhoods.forEach((NEIGHBORHOOD) => {
//         datasets.push({
//             label: NEIGHBORHOOD,
//             data: neighborhoodSalesData[NEIGHBORHOOD],
//             borderWidth: 1,
//             fill: false,
//             yAxisID: "y",
//         });
//     });

//     window.dataNeighborhoodSales = datasets;

//     window.salesNeighborhoodChart = new Chart(ctx, {
//         type: "line",
//         data: {
//             labels: arrSaleDate,
//             datasets: datasets,
//         },
//         options: {
//             maintainAspectRatio: false,
//             responsive: true,
//             interaction: {
//                 mode: "index",
//                 intersect: false,
//             },
//             stacked: false,
//             plugins: {
//                 // title: {
//                 //   display: true,
//                 //   text: 'Chart.js Line Chart - Multi Axis'
//                 // }
//             },
//             scales: {
//                 y: {
//                     title: {
//                         type: "linear",
//                         display: true,
//                         position: "left",
//                         text: "Total Sales",
//                     },
//                 },
//                 x: {
//                     title: {
//                         type: "linear",
//                         display: true,
//                         position: "bottom",
//                         text: "Year Quarter",
//                     },
//                 },
//             },
//         },
//     });
// }
// Filter Chart Sales Growth By Borough
function onSelectFilterBoroughSalesGrowth(BOROUGH) {
    var filteredDataset = window.dataSalesGrowth.filter((dataset) => {
        return dataset.label === BOROUGH;
    });
    if (BOROUGH === "All" || filteredDataset.length === 0) {
        filteredDataset = window.dataSalesGrowth;
    }
    window.salesGrowthChart.data.datasets = filteredDataset;
    window.salesGrowthChart.update();
}
// Filter Chart Unit Sales Chart by Borough
function onSelectFilterBoroughUniteSalesChart(BOROUGH) {
    var filteredData = [];

    if (BOROUGH === "All") {
        filteredData = window.dataUniteSaleBoroughChart;
    } else {
        filteredData = window.dataUniteSaleBoroughChart.filter((item) => {
            return item.BOROUGH === BOROUGH;
        });
    }

    var arrBorough = [];
    var arrTotalUnit = [];
    filteredData.forEach((item) => {
        if (!arrBorough.includes(item.BOROUGH)) {
            arrBorough.push(item.BOROUGH);
            arrTotalUnit.push(parseInt(item.SALE_PRICE * 0 + 1));
        } else {
            var index = arrBorough.indexOf(item.BOROUGH);
            arrTotalUnit[index] += parseInt(item.SALE_PRICE * 0 + 1);
        }
    });

    //Melakukan transformasi array 1 dimensi menjadi array 2 dimensi
    var objArrTotalUnitSales = [];
    arrBorough.forEach((item, index) => {
        objArrTotalUnitSales.push({
            borough: item,
            unit: arrTotalUnit[index],
        });
    });

    //Mengurutkan data berdasarkan sale price lewat array 2 dimensi
    objArrTotalUnitSales.sort((a, b) => b.unit - a.unit);

    //Mengembalikan data yang sudah diurutkan (sort) dari array 2 dimensi ke array 1 dimensi
    objArrTotalUnitSales.forEach((item, index) => {
        arrBorough[index] = item.borough;
        arrTotalUnit[index] = item.unit;
    });

    window.uniteSaleBoroughChart.data.labels = arrBorough;
    window.uniteSaleBoroughChart.data.datasets[0].data = arrTotalUnit;
    window.uniteSaleBoroughChart.update();
}
function onSelectUpdateFourCharts(BOROUGH) {
    onSelectFilterBoroughSalesGrowth(BOROUGH);
    onSelectFilterBoroughUniteSalesChart(BOROUGH);
}
// Residential vs Commercial
function displayResidentialCommercial(data) {
    var ctx = document.getElementById("residential-commercial");
    // console.log(data);
    var totalResidential = data.reduce(
        (acc, curr) => acc + +curr.RESIDENTIAL_UNITS,
        0
    );
    var totalCommercial = data.reduce(
        (acc, curr) => acc + +curr.COMMERCIAL_UNITS,
        0
    );

    console.log("Total Residential Units:", totalResidential);
    console.log("Total Commercial Units:", totalCommercial);

    var chartData = {
        labels: ["Residential", "Commercial"],
        datasets: [
            {
                data: [totalResidential, totalCommercial],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                ],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 1,
            },
        ],
    };

    const config = {
        type: "pie",
        data: chartData,
        options: {
            responsive: true,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Residential vs Commercial",
                    font: {
                        size: 16,
                    },
                },
            },
        },
    };

    //   console.log(ctx);

    var myChart = new Chart(ctx, config);
}

// Datatables
function displayPropertyData(data) {
    // Mengelompokkan dan menjumlahkan penjualan berdasarkan kelas bangunan
    const result = {};
    data.forEach((item) => {
        const buildingClass = item.BUILDING_CLASS_CATEGORY;
        const salePrice = parseFloat(item.SALE_PRICE) || 0; // Mengkonversi SALE_PRICE ke float
        if (result[buildingClass]) {
            result[buildingClass] += salePrice;
        } else {
            result[buildingClass] = salePrice;
        }
    });

    const sortedData = Object.entries(result)
        .sort((a, b) => b[1] - a[1]) // Mengurutkan data dari yang terbesar ke yang terkecil
        .slice(0, 10); // Mengambil 10 penjualan terbesar

    // Mengubah hasil pengelompokan menjadi array, mengurutkan, dan mengambil 10 terbesar
    const processedData = sortedData.map(([buildingClass, totalSales]) => [
        buildingClass,
        formatNumberTables(totalSales),
    ]);

    // Membuat DataTable dengan data yang telah diolah
    new DataTable("#table-building-class", {
        data: processedData,
        columns: [{ title: "Building Class" }, { title: "Total Sales" }],
        dom: "t",
        ordering: false,
    });
}

// Ambil data Json
fetch("JSON-file/nyc_property_sales.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        displayTotalSalesPrice(data);
        displayAvgSalesPrice(data);
        displayTotalUnitSales(data);
        displaySalesGrowthChart(data);
        displayTotalUnitSalesChart(data);
        // displayNeighborhoodSalesChart(data);
        displayResidentialCommercial(data);
        displayPropertyData(data);
    });
