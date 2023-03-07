import { products } from "./data";
const cartButton = document.querySelector("#cart-button");
const cartDropdown = document.querySelector("#cart-dropdown");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector(".cart-count");
let cart = JSON.parse(localStorage.getItem("cart")) || {
  count: 0,
  products: []
};
cartCount.textContent = Number(cart.count);
const uniqueProducts = [
  ...new Set(
    products.map((item) => {
      return item;
    })
  )
];

function createNode(node) {
  let element = document.createElement(node);
  return element;
}
function appendNode(parent, element) {
  parent.appendChild(element);
}
function getDiv(container) {
  return document.getElementById(container);
}
function openModal(modal) {
  modal.style.display = "block";
}
function closeModal(modal) {
  modal.style.display = "none";
}

function displayCard(product) {
  let item_node = createNode("div");
  item_node.setAttribute("id", product.id);
  item_node.classList.add("card");
  let img = createNode("img");
  img.src = product.product_image;
  appendNode(item_node, img);
  item_node.innerHTML += `
  <h2>${product.product_name}</h2>
  <p> ${product.product_price} </p>
  `;
  return item_node;
}
function addToCart(product) {
  let res = cart?.items?.find((item) => item.id == product.id);
  if (res === undefined || cart.length === 0) {
    cart.items.push(product);
    product.added_to_cart = true;
    cart.count = cart.count + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.textContent = Number(cart.count);
  }

  displayCart();
}
displayCart();

function displayProducts(products, container) {
  let items_container = getDiv(container);
  for (let i = 0; i < products.length; i++) {
    let product = uniqueProducts[i];
    let item_node = displayCard(product);
    const containerButtons = createNode("div");
    containerButtons.classList.add("buttons-card");
    let add_to_cart = createNode("button");
    let QuickView = createNode("button");
    QuickView.innerHTML = `Quick View`;
    QuickView.id = product.id;
    add_to_cart.id = product.id;
    const modal = document.createElement("div");
    modal.classList.add("modal");
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    const modalClose = document.createElement("span");
    modalClose.classList.add("close");
    modalClose.innerHTML = "&times;";
    modalContent.appendChild(modalClose);
    modalContent.innerHTML += `
      <img src = ${product.product_image} width="500px" height="300px"  style="object-fit:cover"  />
      <h2> ${product.product_name}  </h2>
      <p> ${product.product_price} </p>
    `;
    const findProduct = cart.items.find((item) => item.id == product.id);
    if (findProduct) {
      addToCart(product);
      add_to_cart.textContent = `Remove`;
    } else if (product.added_to_cart) {
      addToCart(product);
      add_to_cart.textContent = `Remove`;
    } else {
      add_to_cart.textContent = `Add`;
    }

    add_to_cart.addEventListener("click", () => {
      if (add_to_cart.textContent == `Add`) {
        addToCart(product);
        product.added_to_cart = true;
        add_to_cart.textContent = `Remove`;

        console.log(cart, "Cart");
      } else {
        if (cart.items.length > 0) {
          let temp = cart.items.filter((item) => item.id != product.id);
          cart.items = [...temp];
          console.log(temp);
          cart.count = cart.count - 1;
          cartCount.textContent = Number(cart.count);
          localStorage.setItem("cart", JSON.stringify(cart));
          displayCart();
          add_to_cart.textContent = `Add`;
          product.added_to_cart = false;
        }
      }
    });

    appendNode(modal, modalContent);
    appendNode(containerButtons, add_to_cart);
    appendNode(containerButtons, QuickView);
    appendNode(item_node, containerButtons);
    appendNode(items_container, item_node);
    appendNode(items_container, modal);
    QuickView.addEventListener("click", () => {
      openModal(modal);
    });

    const closeBtn = modal.querySelector(".close");
    closeBtn.addEventListener("click", () => {
      closeModal(modal);
    });
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  }
}
displayProducts(products, "items");

cartButton.addEventListener("click", () => {
  console.log("hi");
  cartDropdown.style.display =
    cartDropdown.style.display === "none" ? "block" : "none";
});
function displayCart() {
  cartItems.innerHTML = cart.items
    .map((item) => {
      let { product_name, product_price, product_image } = item;
      return `
      <div class='cart-item'>
      <div class='row-img'>
          <img class='rowimg' src=${product_image}>
      </div>
      <p style='font-size:16px;'>${product_name}</p>
      <h4 style='font-size: 16px;'>$ ${product_price}.00</h4>`;
    })
    .join("");
}
