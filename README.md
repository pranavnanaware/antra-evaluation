# Shopping Cart Application

This is a simple shopping cart application built with vanilla JavaScript. The application allows users to view an inventory of items, add items to their cart, adjust item quantities, delete items from the cart, and checkout.

## Features

- View inventory of items
- Add items to cart
- Adjust item quantities in the inventory
- Delete items from the cart
- Checkout and clear the cart

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You need to have `node` and `npm` installed on your machine. You can download and install them from [Node.js](https://nodejs.org/).

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/pranavnanaware/antra-evaluation.git
   ```

````

2. Navigate to the project directory:

   ```sh
   cd antra-evaluation
   ```

3. Install NPM packages:

   ```sh
   npm install
   ```

4. Start the development server:

   ```sh
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

- **Inventory**: View the list of available items. Use the `+` and `-` buttons to adjust the quantity of each item.
- **Add to Cart**: Click the "add to cart" button to add the selected quantity of an item to the cart.
- **Cart**: View items in the cart, adjust quantities, and delete items.
- **Checkout**: Click the "Checkout" button to clear the cart.

## File Structure

- `index.html`: The main HTML file.
- `style.css`: The main CSS file for styling the application.
- `index.js`: The main JavaScript file containing the Model, View, and Controller modules.

## API

The application uses a simple RESTful API to interact with the backend.

- `GET /cart`: Get the list of items in the cart.
- `GET /inventory`: Get the list of items in the inventory.
- `POST /cart`: Add a new item to the cart.
- `PATCH /cart/:id`: Update the quantity of an item in the cart.
- `DELETE /cart/:id`: Delete an item from the cart.
- `POST /cart/checkout`: Checkout and clear the cart.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Pranav Nanaware - [LinkedIn](https://www.linkedin.com/in/pranavnanaware/) - nanawarepranav@gmail.com

Project Link: [https://github.com/pranavnanaware/antra-evaluation](https://github.com/pranavnanaware/antra-evaluation)



````
