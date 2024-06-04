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
    let summaryTotalSales = (document.getElementById("totalsales").textContent =
        "$" + formattedTotalSalesPrice);

    window.dataSummaryTotalSales = arrTotalSalesPrice;
    window.TotalSales = summaryTotalSales;
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
    let summaryAvgSales = (document.getElementById("avgSales").textContent =
        "$" + formattedAvgSalesPrice);

    window.dataSummaryAvgSales = arrAvgSalesPrice;
    window.avgSales = summaryAvgSales;
}

// Function Summary Total Unit Sales
function displayTotalUnitSales(arrTotalUnitSales) {
    var numTotalUnitSales = arrTotalUnitSales.length;
    var formattedTotalUnitSales = formatNumber(numTotalUnitSales);
    let summaryTotalUnit = (document.getElementById("totalUnit").textContent =
        formattedTotalUnitSales);

    window.dataSummaryTotalUnit = arrTotalUnitSales;
    window.totalUnit = summaryTotalUnit;
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
    window.dataArrSalesGrowth = arrSalesGrowth;
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
            maintainAspectRatio: false
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
            maintainAspectRatio: false
        },
    });
}

// Residential vs Commercial
function displayResidentialCommercial(data) {
    var ctx = document.getElementById("residential-commercial");

    var totalResidential = data.reduce(
        (acc, curr) => acc + +curr.RESIDENTIAL_UNITS,
        0
    );
    var totalCommercial = data.reduce(
        (acc, curr) => acc + +curr.COMMERCIAL_UNITS,
        0
    );

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

    window.dataResidentialCommercial = data;
    window.chartResidentialCommercial = new Chart(ctx, config);
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
    let Table = new DataTable("#table-building-class", {
        data: processedData,
        columns: [{ title: "Building Class" }, { title: "Total Sales" }],
        dom: "t",
        ordering: false,
    });
    window.dataDisplayProperty = data;
    window.tableDisplayProperty = Table;
}

// function total unit sales based on year built
function displayUnitSalesPerYearBuild(arrUnitPerYearBuild) {
    var ctx = document.getElementById("total-unit-based-year-build");

    // Menggabungkan jumlah unit untuk setiap tahun dibangun
    var unitPerYear = {};
    arrUnitPerYearBuild.forEach((item) => {
        if (item.YEAR_BUILT) {
            if (unitPerYear[item.YEAR_BUILT]) {
                unitPerYear[item.YEAR_BUILT] += parseInt(item.TOTAL_UNITS);
            } else {
                unitPerYear[item.YEAR_BUILT] = parseInt(item.TOTAL_UNITS);
            }
        }
    });

    // Mengubah objek menjadi array untuk memudahkan pengurutan
    var arrUnitPerYear = Object.keys(unitPerYear).map((key) => {
        return {
            YEAR_BUILT: key,
            TOTAL_UNITS: unitPerYear[key],
        };
    });

    // Mengurutkan data berdasarkan total unit dari yang terbesar ke yang terkecil
    arrUnitPerYear.sort((a, b) => b.TOTAL_UNITS - a.TOTAL_UNITS);

    // Mengambil 10 data pertama setelah diurutkan
    var top10Data = arrUnitPerYear.slice(0, 10);

    var arrYearBuild = [];
    var arrTotalUnit = [];

    top10Data.forEach((item) => {
        arrYearBuild.push(item.YEAR_BUILT);
        arrTotalUnit.push(item.TOTAL_UNITS);
    });

    var datasets = [
        {
            label: "Total Unit Sales Based on Year Built",
            data: arrTotalUnit,
            borderWidth: 1,
        },
    ];

    window.dataUniteSaleYearBuildChart = top10Data;

    window.top10UnitSaleYearBuild = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrYearBuild,
            datasets: datasets,
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Total Units Sales Based On Year Built",
                    font: {
                        size: 16,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        type: "linear",
                        display: true,
                        text: "Total Units Sold",
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Year Built",
                    },
                },
            },
            maintainAspectRatio: false
        },
    });
}

// function chart sales per tax class by year
function displaySalesTrendPerTax(arrSalesPerTax){
    var ctx = document.getElementById("sales-trend-per-tax").getContext("2d");
    var arrSaleYear = [];
    var taxSalesData = {};

    //ambil tahun
    function extractYear(saleDate) {
        return "20" + saleDate.slice(2, 4);
    }

    arrSalesPerTax.forEach((item) => {
        var saleYear = extractYear(item.SALE_DATE);
        if (!arrSaleYear.includes(saleYear)) {
            arrSaleYear.push(saleYear);
        }
    });

    arrSaleYear.sort();

    arrSalesPerTax.forEach((item) => {
        var saleYear = extractYear(item.SALE_DATE);
        var taxClass = item.TAX_CLASS_AT_PRESENT;
        if(taxClass){
            if (!taxSalesData[taxClass]) {
                taxSalesData[taxClass] = Array(arrSaleYear.length).fill(0);
            }
        }
    });

    arrSalesPerTax.forEach((item) => {
        var saleYear = extractYear(item.SALE_DATE);
        var yearIndex = arrSaleYear.indexOf(saleYear);
        var taxClass = item.TAX_CLASS_AT_PRESENT;
        if (taxClass) {
            taxSalesData[taxClass][yearIndex] += parseFloat(item.SALE_PRICE);
        }
    });

    var datasets = [];
    Object.keys(taxSalesData).forEach((taxClass) => {
        datasets.push({
            label: taxClass,
            data: taxSalesData[taxClass],
            borderWidth: 1,
            fill: false,
            yAxisID: "y",
        });
    });

    window.dataSalesPerTax = datasets;

    window.salesPerTaxChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: arrSaleYear,
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
                    text: "Sales Trend Based On Tax per Year",
                    font: {
                        size: 16,
                    },
                },
            },
            scales: {
                y: {
                    type: "linear",
                    display: true,
                    position: "left",
                    title: {
                        display: true,
                        text: "Total Sales",
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Year",
                    },
                },
            },
            maintainAspectRatio: false
        },
    });
}

// Filter By Neighborhood
// Filter Summary Total Sales Price By Neighborhood
function onSelectFilterNeighborhoodSummaryTotalSales(NEIGHBORHOOD) {
    var filteredData = window.dataSummaryTotalSales;
    if (NEIGHBORHOOD !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.NEIGHBORHOOD === NEIGHBORHOOD;
        });
    }
    var numTotalSalesPrice = 0;
    filteredData.forEach((item) => {
        numTotalSalesPrice += parseInt(item.SALE_PRICE);
    });

    var formattedTotalSalesPrice = formatNumber(numTotalSalesPrice);
    let summaryTotalSales = (document.getElementById("totalsales").textContent =
        "$" + formattedTotalSalesPrice);

    window.TotalSales.data = [summaryTotalSales];
}
// Filter Summary Average Sales By Neighborhood
function onSelectFilterNeighborhoodAvgSales(NEIGHBORHOOD) {
    var filteredData = window.dataSummaryAvgSales;
    if (NEIGHBORHOOD !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.NEIGHBORHOOD === NEIGHBORHOOD;
        });
    }
    var totalUnitSales = filteredData.length;
    var numAvgSalesPrice = 0;
    filteredData.forEach((item) => {
        numAvgSalesPrice += parseInt(item.SALE_PRICE);
    });
    let avgSalesPrice = numAvgSalesPrice / totalUnitSales;
    let formattedAvgSalesPrice = formatNumber(avgSalesPrice);
    let summaryAvgSales = (document.getElementById("avgSales").textContent =
        "$" + formattedAvgSalesPrice);

    window.avgSales.data = [summaryAvgSales];
}
// Filter Summary Total Unit Sales By Neighborhood
function onSelectFilterNeighborhoodTotalUnitSales(NEIGHBORHOOD) {
    var filteredData = window.dataSummaryTotalUnit;
    if (NEIGHBORHOOD !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.NEIGHBORHOOD === NEIGHBORHOOD;
        });
    }
    var numTotalUnitSales = filteredData.length;
    var formattedTotalUnitSales = formatNumber(numTotalUnitSales);
    let summaryTotalUnit = (document.getElementById("totalUnit").textContent =
        formattedTotalUnitSales);

    window.totalUnit = summaryTotalUnit;
}
// Filter Chart Sales Growth By Neighborhood
function onSelectFilterNeighborhoodSalesGrowth(NEIGHBORHOOD) {
    var filteredDataset = window.dataSalesGrowth;

    if (NEIGHBORHOOD === "All" || filteredDataset.length === 0) {
        filteredDataset = window.dataSalesGrowth;
    }
    window.salesGrowthChart.data.datasets = filteredDataset;
    window.salesGrowthChart.update();
}
// Filter Chart Unit Sales By Neighborhodo
function onSelectFilterNeighborhoodUniteSalesChart(NEIGHBORHOOD) {
    var filteredData = [];

    if (NEIGHBORHOOD === "All") {
        filteredData = window.dataUniteSaleBoroughChart;
    } else {
        filteredData = window.dataUniteSaleBoroughChart.filter((item) => {
            return item.NEIGHBORHOOD === NEIGHBORHOOD;
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
// Filter Chart Residential Commercial By Neighborhood
function onSelectFilterNeighborhoodResidentialCommercialChart(NEIGHBORHOOD) {
    var filteredData = window.dataResidentialCommercial;
    if (NEIGHBORHOOD !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.NEIGHBORHOOD === NEIGHBORHOOD;
        });
    }
    var totalResidential = filteredData.reduce(
        (acc, curr) => acc + +curr.RESIDENTIAL_UNITS,
        0
    );
    var totalCommercial = filteredData.reduce(
        (acc, curr) => acc + +curr.COMMERCIAL_UNITS,
        0
    );

    window.chartResidentialCommercial.data.datasets[0].data = [
        totalResidential,
        totalCommercial,
    ];
    window.chartResidentialCommercial.update();
}

// Filter By Borough
// Filter Summary Total Sales Price by Borough
function onSelectFilterBorougSummaryTotalSales(BOROUGH) {
    var filteredData = window.dataSummaryTotalSales;
    if (BOROUGH !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.BOROUGH === BOROUGH;
        });
    }
    var numTotalSalesPrice = 0;
    filteredData.forEach((item) => {
        numTotalSalesPrice += parseInt(item.SALE_PRICE);
    });

    var formattedTotalSalesPrice = formatNumber(numTotalSalesPrice);
    let summaryTotalSales = (document.getElementById("totalsales").textContent =
        "$" + formattedTotalSalesPrice);

    window.TotalSales.data = [summaryTotalSales];
}
// Filter Summary Average Sales Price by Borough
function onSelectFilterBoroughAvgSales(BOROUGH) {
    var filteredData = window.dataSummaryAvgSales;
    if (BOROUGH !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.BOROUGH === BOROUGH;
        });
    }
    var totalUnitSales = filteredData.length;
    var numAvgSalesPrice = 0;
    filteredData.forEach((item) => {
        numAvgSalesPrice += parseInt(item.SALE_PRICE);
    });
    let avgSalesPrice = numAvgSalesPrice / totalUnitSales;
    let formattedAvgSalesPrice = formatNumber(avgSalesPrice);
    let summaryAvgSales = (document.getElementById("avgSales").textContent =
        "$" + formattedAvgSalesPrice);

    window.avgSales.data = [summaryAvgSales];
}
// Filter Summary Total Unit Sales by Borough
function onSelectFilterBoroughTotalUnitSales(BOROUGH) {
    var filteredData = window.dataSummaryTotalUnit;
    if (BOROUGH !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.BOROUGH === BOROUGH;
        });
    }
    var numTotalUnitSales = filteredData.length;
    var formattedTotalUnitSales = formatNumber(numTotalUnitSales);
    let summaryTotalUnit = (document.getElementById("totalUnit").textContent =
        formattedTotalUnitSales);

    window.totalUnit = summaryTotalUnit;
}
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
// Filter Chart Residential Comemrcial by Borough
function onSelectFilterBoroughResidentialCommercialChart(BOROUGH) {
    var filteredData = window.dataResidentialCommercial;
    if (BOROUGH !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.BOROUGH === BOROUGH;
        });
    }
    var totalResidential = filteredData.reduce(
        (acc, curr) => acc + +curr.RESIDENTIAL_UNITS,
        0
    );
    var totalCommercial = filteredData.reduce(
        (acc, curr) => acc + +curr.COMMERCIAL_UNITS,
        0
    );

    window.chartResidentialCommercial.data.datasets[0].data = [
        totalResidential,
        totalCommercial,
    ];
    window.chartResidentialCommercial.update();
}
// Filter Table Display Property By Borough
function onSelectFilterBoroughTableDisplayProperty(BOROUGH) {
    var filteredData = window.dataDisplayProperty;
    if (BOROUGH !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.BOROUGH === BOROUGH;
        });
    }
    const result = {};
    filteredData.forEach((item) => {
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
    let Table = new DataTable("#table-building-class", {
        data: processedData,
        columns: [{ title: "Building Class" }, { title: "Total Sales" }],
        dom: "t",
        ordering: false,
    });

    window.dataDisplayProperty.data.datasets[0].data = Table;
    window.tableDisplayProperty.update();
}

// Filter By Quarter
// Filter Summary Total Sales By Quarter
function onSelectFilterQuarterSummaryTotalSales(SALE_DATE) {
    var filteredData = window.dataSummaryTotalSales;
    if (SALE_DATE !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.SALE_DATE === SALE_DATE;
        });
    }
    var numTotalSalesPrice = 0;
    filteredData.forEach((item) => {
        numTotalSalesPrice += parseInt(item.SALE_PRICE);
    });

    var formattedTotalSalesPrice = formatNumber(numTotalSalesPrice);
    let summaryTotalSales = (document.getElementById("totalsales").textContent =
        "$" + formattedTotalSalesPrice);

    window.TotalSales.data = [summaryTotalSales];
}
// Filter Summary Average Sales by Quarter
function onSelectFilterQuarterAvgSales(SALE_DATE) {
    var filteredData = window.dataSummaryAvgSales;
    if (SALE_DATE !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.SALE_DATE === SALE_DATE;
        });
    }
    var totalUnitSales = filteredData.length;
    var numAvgSalesPrice = 0;
    filteredData.forEach((item) => {
        numAvgSalesPrice += parseInt(item.SALE_PRICE);
    });
    let avgSalesPrice = numAvgSalesPrice / totalUnitSales;
    let formattedAvgSalesPrice = formatNumber(avgSalesPrice);
    let summaryAvgSales = (document.getElementById("avgSales").textContent =
        "$" + formattedAvgSalesPrice);

    window.avgSales.data = [summaryAvgSales];
}
// Filter Summary Total Unit Sales by Quarter
function onSelectFilterQuarterTotalUnitSales(SALE_DATE) {
    var filteredData = window.dataSummaryTotalUnit;
    if (SALE_DATE !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.SALE_DATE === SALE_DATE;
        });
    }
    var numTotalUnitSales = filteredData.length;
    var formattedTotalUnitSales = formatNumber(numTotalUnitSales);
    let summaryTotalUnit = (document.getElementById("totalUnit").textContent =
        formattedTotalUnitSales);

    window.totalUnit = summaryTotalUnit;
}
// Filter Chart Unit Sales Chart by quarter
function onSelectFilterQuarterUniteSalesChart(SALE_DATE) {
    var filteredData = [];

    if (SALE_DATE === "All") {
        filteredData = window.dataUniteSaleBoroughChart;
    } else {
        filteredData = window.dataUniteSaleBoroughChart.filter((item) => {
            return item.SALE_DATE === SALE_DATE;
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
// Filter Chart Residential Commerceial by Quarter
function onSelectFilterQuarterResidentialCommercialChart(SALE_DATE) {
    var filteredData = window.dataResidentialCommercial;
    if (SALE_DATE !== "All") {
        filteredData = filteredData.filter((item) => {
            return item.SALE_DATE === SALE_DATE;
        });
    }
    var totalResidential = filteredData.reduce(
        (acc, curr) => acc + +curr.RESIDENTIAL_UNITS,
        0
    );
    var totalCommercial = filteredData.reduce(
        (acc, curr) => acc + +curr.COMMERCIAL_UNITS,
        0
    );

    window.chartResidentialCommercial.data.datasets[0].data = [
        totalResidential,
        totalCommercial,
    ];
    window.chartResidentialCommercial.update();
}

// Fungsi yang mengumpulkan fungsi filtering Neighborhood
function onSelectFilterDashboardByNeighborhood(NEIGHBORHOOD) {
    onSelectFilterNeighborhoodSummaryTotalSales(NEIGHBORHOOD);
    onSelectFilterNeighborhoodAvgSales(NEIGHBORHOOD);
    onSelectFilterNeighborhoodTotalUnitSales(NEIGHBORHOOD);
    onSelectFilterNeighborhoodSalesGrowth(NEIGHBORHOOD);
    onSelectFilterNeighborhoodUniteSalesChart(NEIGHBORHOOD);
    onSelectFilterNeighborhoodResidentialCommercialChart(NEIGHBORHOOD);
}

// Fungsi yang mengumpulkan fungsi filtering borough
function onSelectFilterDashboardByBorough(BOROUGH) {
    onSelectFilterBoroughSalesGrowth(BOROUGH);
    onSelectFilterBoroughUniteSalesChart(BOROUGH);
    onSelectFilterBoroughResidentialCommercialChart(BOROUGH);
    onSelectFilterBorougSummaryTotalSales(BOROUGH);
    onSelectFilterBoroughAvgSales(BOROUGH);
    onSelectFilterBoroughTotalUnitSales(BOROUGH);
    onSelectFilterBoroughTableDisplayProperty(BOROUGH);
}

// Fungsi yang mengumpulkan fungsi filtering quarter
function onSelectFilterDashboardByQuarter(SALE_DATE) {
    onSelectFilterQuarterSummaryTotalSales(SALE_DATE);
    onSelectFilterQuarterAvgSales(SALE_DATE);
    onSelectFilterQuarterTotalUnitSales(SALE_DATE);
    onSelectFilterQuarterUniteSalesChart(SALE_DATE);
    onSelectFilterQuarterResidentialCommercialChart(SALE_DATE);
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
        displayResidentialCommercial(data);
        displayPropertyData(data);
        displayUnitSalesPerYearBuild(data);
    });


fetch("JSON-file/property-sales.json")
.then((response) => {
    return response.json();
})
.then((data) => {
    displaySalesTrendPerTax(data);
});
