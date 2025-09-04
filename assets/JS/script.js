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
