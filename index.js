const API = (() => {
  const URL = "http://localhost:3000";

  const getCart = () => {
    return fetch(`${URL}/cart`).then((res) => res.json());
  };

  const getInventory = () => {
    return fetch(`${URL}/inventory`).then((res) => res.json());
  };

  const addToCart = (item) => {
    return fetch(`${URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }).then((res) => res.json());
  };

  const updateCart = (id, newAmount) => {
    return fetch(`${URL}/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newAmount }),
    }).then((res) => res.json());
  };

  const deleteFromCart = (id) => {
    return fetch(`${URL}/cart/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  const checkout = () => {
    return getCart().then((data) =>
      Promise.all(data.map((item) => deleteFromCart(item.id)))
    );
  };

  return {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

const Model = (() => {
  class State {
    #onChange;
    #inventory;
    #cart;
    constructor() {
      this.#inventory = [];
      this.#cart = [];
      this.#onChange = () => {};
    }

    set inventory(newInventory) {
      console.log(newInventory);
      this.#inventory = newInventory.map((item) => ({
        ...item,
        selectedQuantity: isNaN(item.selectedQuantity)
          ? 0
          : item.selectedQuantity,
      }));
      this.#onChange();
    }

    get cart() {
      return this.#cart;
    }

    get inventory() {
      return this.#inventory;
    }

    set cart(newCart) {
      this.#cart = newCart;
      this.#onChange();
    }

    subscribe(cb) {
      this.#onChange = cb;
    }
  }

  const state = new State();

  return {
    state,
    ...API,
    initialize: () => {
      API.getCart().then(
        (cart) =>
          (state.cart = cart.map((item) => ({
            ...item,
            quantity: isNaN(item.quantity) ? 0 : item.quantity,
          })))
      );
      API.getInventory().then((inventory) => {
        console.log("inventory: ", inventory);
        state.inventory = inventory;
      });
    },
  };
})();

Model.initialize();

const View = (() => {
  const renderInventory = (inventory) => {
    const inventoryList = document.querySelector("#inventory-list");
    inventoryList.innerHTML = inventory
      .map(
        (item) => `
      <li data-id="${item.id}" class="inventory-item">
        ${item.content}
        <button class="decrement-btn">-</button>
        <span class="quantity">${item.selectedQuantity}</span>
        <button class="increment-btn">+</button>
        <button class="add-to-cart-btn">add to cart</button>
      </li>
    `
      )
      .join("");
  };

  const renderCart = (cart) => {
    const cartList = document.querySelector("#cart-list");
    cartList.innerHTML = cart
      .map(
        (item) => `
      <li data-id="${item.id}" class="cart-item">
        ${item.content}
        <span>x ${item.quantity}</span>
        <button class="delete-btn">delete</button>
      </li>
    `
      )
      .join("");
  };

  return {
    renderInventory,
    renderCart,
  };
})();

const Controller = ((model, view) => {
  const state = model.state;

  const init = () => {
    state.subscribe(() => {
      view.renderInventory(state.inventory);
      view.renderCart(state.cart);
    });
  };

  const handleUpdateAmount = (item, amount) => {
    item.quantity += amount;
    if (item.quantity <= 0) {
      model.deleteFromCart(item.id).then(() => {
        model.state.cart = model.state.cart.filter(
          (cartItem) => cartItem.id !== item.id
        );
      });
    } else {
      model.updateCart(item.id, item.quantity).then(() => {
        model.state.cart = model.state.cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: item.quantity }
            : cartItem
        );
      });
    }
  };

  const handleIncreaseAmount = (item) => {
    item.selectedQuantity++;
    model.state.inventory = [...model.state.inventory];
  };

  const handleDecreaseAmount = (item) => {
    if (item.selectedQuantity > 0) {
      item.selectedQuantity--;
      model.state.inventory = [...model.state.inventory];
    }
  };

  const handleAddToCart = (item) => {
    if (item.selectedQuantity === 0) return;
    const cartItem = model.state.cart.find((i) => i.content === item.content);
    if (cartItem) {
      handleUpdateAmount(cartItem, item.selectedQuantity);
    } else {
      model
        .addToCart({
          ...item,
          quantity: isNaN(item.selectedQuantity) ? 0 : item.selectedQuantity,
        })
        .then((newItem) => {
          model.state.cart = [...model.state.cart, newItem];
        });
    }
    model.state.inventory = [...model.state.inventory];
  };

  const handleDelete = (item) => {
    model.deleteFromCart(item.id).then(() => {
      model.state.cart = model.state.cart.filter(
        (cartItem) => cartItem.id !== item.id
      );
    });
  };

  const handleCheckout = () => {
    document
      .querySelector(".checkout-btn")
      .addEventListener("click", async () => {
        await model.checkout();
        state.cart = await model.getCart();
      });
  };

  const bootstrap = () => {
    init();
    document.addEventListener("click", (event) => {
      const parentElement = event.target.parentElement;
      if (!parentElement) return;

      const itemId = parentElement.getAttribute("data-id");
      if (!itemId) return;

      const item =
        model.state.inventory.find((i) => i.id === Number(itemId)) ||
        model.state.cart.find((i) => i.id === Number(itemId));
      if (!item) return;

      if (event.target.matches(".increment-btn")) {
        handleIncreaseAmount(item);
      } else if (event.target.matches(".decrement-btn")) {
        handleDecreaseAmount(item);
      } else if (event.target.matches(".add-to-cart-btn")) {
        handleAddToCart(item);
      } else if (event.target.matches(".delete-btn")) {
        const cartItem = state.cart.find((i) => i.id === Number(itemId));
        handleDelete(cartItem);
      } else if (event.target.matches(".checkout-btn")) {
        handleCheckout();
      }
      handleCheckout();
    });
  };

  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
