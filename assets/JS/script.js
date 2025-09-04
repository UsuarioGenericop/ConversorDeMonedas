const result = document.getElementById("result");
const currency = document.getElementById("currency");
const button = document.getElementById("searchButton");
const input = document.getElementById("quantity");

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function unCapitalizeFirstLetter(val) {
  return String(val).charAt(0).toLocaleLowerCase() + String(val).slice(1);
}

async function convertCurrency() {
  const res = await fetch("https://mindicador.cl/api/");
  const data = await res.json();
  console.log(data);
  console.log(data.bitcoin);
  return data;
}

async function renderData() {
  const objects = await convertCurrency();
  let template = "";
  // Convert object to array of values and filter out objects that have 'nombre' property
  /* Did with Cursor*/ Object.values(objects).forEach((object) => {
    if (object && typeof object === "object" && object.codigo) {
      template += `<option>${capitalizeFirstLetter(object.codigo)}</option>`;
    }
  });
  currency.innerHTML = template;
}
renderData();
async function calculateTotal() {
  const data = await convertCurrency();
  for (var propt in data) {
    const currencyData = data[propt]; // If you have an object with properties that are themselves objects, you can iterate through the keys of the outer object and then access the nested objects and their properties.
    // The const currencyData is an object so if you console.log(currencyData) it displays an object whereas if you console.log(propt) it displays a property
    console.log(`El valor de ${propt} es ${currencyData.valor}`);
    if (
      input.value > 0 &&
      unCapitalizeFirstLetter(currency.value) == currencyData.codigo
    ) {
      console.log("Yes");
      const operation = input.value * currencyData.valor;
      console.log(operation);
      result.innerHTML = `Resultado: $${operation}`;
    } else {
      // alert("Introduce una cantidad valida");
    }
  }
}

button.addEventListener("click", async function () {
  console.log(input.value);
  await calculateTotal();
  console.log(currency.value);
});

// Update chart when currency selection changes
currency.addEventListener("change", async function () {
  const selectedCurrency = unCapitalizeFirstLetter(currency.value);
  console.log("Currency changed to:", selectedCurrency);
  await renderGrafica(selectedCurrency);
});
async function getAndCreateDataToChart(selectedCurrency = "uf") {
  // Get historical data for the selected currency
  const res = await fetch(`https://mindicador.cl/api/${selectedCurrency}`);
  const data = await res.json();
  console.log("Chart data:", data); // Debug log to see the structure

  // Check if serie exists and has data
  if (!data.serie || !Array.isArray(data.serie)) {
    console.error("No historical data available for", selectedCurrency);
    return { labels: [], datasets: [] };
  }

  // Get the last 10 values for the chart
  const tenValues = data.serie.slice(0, 10);
  const labels = tenValues.map((object) => {
    return new Date(object.fecha).toLocaleDateString();
  });
  const values = tenValues.map((object) => {
    return object.valor;
  });

  const datasets = [
    {
      label: `${selectedCurrency.toUpperCase()} (CLP)`,
      borderColor: "rgb(255, 99, 132)",
      data: values,
    },
  ];
  return { labels, datasets };
}
let chartInstance = null; // Store chart instance for updates

async function renderGrafica(selectedCurrency = "uf") {
  try {
    const chartData = await getAndCreateDataToChart(selectedCurrency);

    // Check if we have data to display
    if (!chartData.labels || chartData.labels.length === 0) {
      console.warn("No chart data available");
      return;
    }

    const config = {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    };

    const myChart = document.getElementById("myChart");
    if (myChart) {
      myChart.style.backgroundColor = "white";

      // Destroy existing chart if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create new chart
      chartInstance = new Chart(myChart, config);
    } else {
      console.error("Chart canvas element not found");
    }
  } catch (error) {
    console.error("Error rendering chart:", error);
  }
}
renderGrafica();
