const result = document.getElementById("result");
const currency = document.getElementById("currency");
const button = document.getElementById("searchButton");
const input = document.getElementById("quantity");

async function convertCurrency() {
  const res = await fetch("https://mindicador.cl/api/");
  const data = await res.json();
  console.log(data.bitcoin);
  for (var propt in data) {
    const currency = data[propt]; // If you have an object with properties that are themselves objects, you can iterate through the keys of the outer object and then access the nested objects and their properties.
    // The const currency is an object so if you console.log(currency) it displays an object whereas if you console.log(propt) it displays a property
    console.log(`El valor de ${propt} es ${currency.valor}`);
  }
  return data;
}
button.addEventListener("click", function () {
  console.log(input.value);
  console.log(data);
});
