"use strict";
const form = document.querySelector("#addItemForm");
const itemName = document.querySelector("#itemName");
const itemQuantity = document.querySelector("#itemQuantity");
const itemLocation = document.querySelector("#itemLocation");
const ulInventory = document.querySelector("#inventoryList");
const ulStockAlert = document.querySelector("#stockAlertList");
const lowStockAlert = document.querySelector("#lowStockAlert");

const modalTitle = document.querySelector("#m-title");
const modalForm = document.querySelector("#modal-form");
const editModal = document.querySelector("#modal");
const modalInputId = document.querySelector("#m-id");
const modalProductName = document.querySelector("#m-product-name");
const modalProductQuantity = document.querySelector("#m-product-qty");
const modalProductLocation = document.querySelector("#m-product-location");
const btnCloseModal = document.querySelector("#m-close-btn");
const btnSaveModal = document.querySelector("#m-save-btn");

const btnClearLocalStorage = document.querySelector("#clearLocalStorage");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  setItem(itemName.value, itemQuantity.value, itemLocation.value);
  getItemsAndDisplay();
  showInfoModal(`Item: ${itemName.value} added successfully`);
  form.reset();
});

function setItem(itemName, itemQuantity, itemLocation) {
  let items = JSON.parse(localStorage.getItem("items")) || [];

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
    ulInventory.innerHTML = "";

    data.forEach((item) => {
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

      editBtn.addEventListener("click", () => {
        modalInputId.value = item.id;
        modalProductName.value = item.itemName;
        modalProductQuantity.value = item.itemQuantity;
        modalProductLocation.value = item.itemLocation;

        editModal.classList.remove("hidden");
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
}

function editItem() {
  let storage = JSON.parse(localStorage.getItem("items")) || [];

  let index = storage.findIndex(
    (item) => item.id == Number(modalInputId.value)
  );

  if (index !== -1) {
    storage[index] = {
      id: modalInputId.value,
      itemName: modalProductName.value,
      itemQuantity: Number(modalProductQuantity.value),
      itemLocation: modalProductLocation.value,
    };

    localStorage.setItem("items", JSON.stringify(storage));

    getItemsAndDisplay();
    checkForLowStock(storage);
  } else {
    showInfoModal("Item not found");
  }
}

function clearLocalStorage() {
  localStorage.clear();
  getItemsAndDisplay();
  checkForLowStock();
}

btnClearLocalStorage.addEventListener("click", clearLocalStorage);
btnCloseModal.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

btnSaveModal.addEventListener("click", (e) => {
  e.preventDefault();
  editItem();

  showInfoModal("Item updated successfully");
});

function showInfoModal(message) {
  modalTitle.textContent = message;
  editModal.classList.remove("hidden");
  modalForm.classList.add("hidden");

  const interval = setInterval(() => {
    editModal.classList.add("hidden");
    modalTitle.textContent = "Edit item's details:";
    modalForm.classList.remove("hidden");
    clearInterval(interval);
  }, 2000);
}

getItemsAndDisplay();
