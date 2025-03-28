"use strict";
const form = document.querySelector("#addItemForm");
const itemName = document.querySelector("#itemName");
const itemQuantity = document.querySelector("#itemQuantity");
const itemLocation = document.querySelector("#itemLocation");
const ulInventory = document.querySelector("#inventoryList");
const ulStockAlert = document.querySelector("#stockAlertList");
const lowStockAlert = document.querySelector("#lowStockAlert");

const editModal = document.querySelector("#modal");
const btnCloseModal = document.querySelector("#m-close-btn");

const btnClearLocalStorage = document.querySelector("#clearLocalStorage");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  setItem(itemName.value, itemQuantity.value, itemLocation.value);
  getItemsAndDisplay();
  form.reset();
});

function setItem(itemName, itemQuantity, itemLocation) {
  let items = JSON.parse(localStorage.getItem("items")) || [];
  console.log(items);
  const item = {
    id: Date.now(),
    itemName: itemName,
    itemQuantity: Number(itemQuantity),
    itemLocation: itemLocation,
  };

  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
}

function getItemsAndDisplay() {
  const data = JSON.parse(localStorage.getItem("items"));
  if (data) {
    console.log(data);
    ulInventory.innerHTML = "";

    data.forEach((item, index) => {
      const li = document.createElement("li");
      li.dataset.id = item.id;
      const h3Name = document.createElement("h3");
      h3Name.textContent = `Name: ${item.itemName}`;

      const pStock = document.createElement("p");
      pStock.textContent = `Stock: ${item.itemQuantity}`;

      const pLocation = document.createElement("p");
      pLocation.textContent = `Location: ${item.itemLocation}`;

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "Edit";

      li.append(h3Name, pStock, pLocation, editBtn);

      ulInventory.append(li);

      editBtn.addEventListener("click", (e) => {
        const currentItem = e.target.closest("li");

        editModal.classList.remove("hidden");
        btnCloseModal.addEventListener("click", () => {
          editModal.classList.add("hidden");
        });
        console.log(inputNewName);
        // currentItem.innerHTML = "";
        currentItem.append(inputNewName);
        console.log(currentItem.dataset.id);
      });
    });
    checkForLowStock(data);
  } else {
    ulInventory.innerHTML = "";
    const message = document.createElement("li");
    message.dataset.errMessage = "Nothing stored. Please add items";
    message.textContent = message.dataset.errMessage;
    ulInventory.append(message);
  }
}

function checkForLowStock(item = []) {
  const lowStock =
    item.length > 0 ? item.filter((item) => item.itemQuantity < 5) : [];

  ulStockAlert.innerHTML = "";

  if (lowStock.length > 0) {
    lowStockAlert.classList.remove("hidden");

    lowStock.forEach((item) => {
      const li = document.createElement("li");
      const h3Name = document.createElement("h3");
      h3Name.textContent = `Name: ${item.itemName}`;

      const pStock = document.createElement("p");
      pStock.textContent = `Stock: ${item.itemQuantity}`;

      const pLocation = document.createElement("p");
      pLocation.textContent = `Location: ${item.itemLocation}`;

      li.append(h3Name, pStock, pLocation);
      ulStockAlert.append(li);
    });
  } else {
    ulStockAlert.innerHTML = "";
    lowStockAlert.classList.add("hidden");
  }

  console.log(lowStock);
}

function clearLocalStorage() {
  localStorage.clear();
  getItemsAndDisplay();
  checkForLowStock();
}

btnClearLocalStorage.addEventListener("click", clearLocalStorage);

getItemsAndDisplay();
