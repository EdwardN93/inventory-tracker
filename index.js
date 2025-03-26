"use strict";
const form = document.querySelector("#addItemSection");
const itemName = document.querySelector("#itemName");
const itemQuantity = document.querySelector("#itemQuantity");
const itemLocation = document.querySelector("#itemLocation");
const ul = document.querySelector("#inventoryList");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  setItem(itemName.value, itemQuantity.value, itemLocation.value);
  getItemsAndDisplay();
});

function setItem(itemName, itemQuantity, itemLocation) {
  let items = JSON.parse(localStorage.getItem("items")) || [];
  console.log(items);
  const item = {
    itemName: itemName,
    itemQuantity: itemQuantity,
    itemLocation: itemLocation,
  };

  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
}

function getItemsAndDisplay() {
  const data = JSON.parse(localStorage.getItem("items"));
  if (data) {
    console.log(data);
    ul.innerHTML = "";

    data.forEach((item) => {
      const li = document.createElement("li");
      const h3Name = document.createElement("h3");
      h3Name.textContent = `Name: ${item.itemName}`;

      const pStock = document.createElement("p");
      pStock.textContent = `Stock: ${item.itemQuantity}`;

      const pLocation = document.createElement("p");
      pLocation.textContent = `Location: ${item.itemLocation}`;

      li.append(h3Name, pStock, pLocation);
      ul.append(li);
    });
  } else console.log(`Nothing in storage`);
}
getItemsAndDisplay();
