const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  // We did not use a constructor because we do not wish to create any cart
  // since there will always be a cart for the app
  static addProduct(id, productPrice) {
    // fetch the prev cart
    fs.readFile(p, (err, fileContent) => {
      // Initialize the cart
      let cart = { products: [], totalPrice: 0 };

      // If there is no problem reading the file then set the cart to what is in the cart.json file
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // Check if product exist
      // We first find the index if there exist a product
      const existingProductIndex = cart.products.findIndex((p) => p.id === id);

      // The we find the actual product ny using the index of the found product
      const existingProduct = cart.products[existingProductIndex];

      // We initialize an updated product
      let updatedProduct;

      // If we found an existing product,
      if (existingProduct) {
        // we pour the products k,v into the initialized updated product
        updatedProduct = { ...existingProduct };

        // we increate the quantity of that product
        updatedProduct.qty = updatedProduct.qty + 1;

        cart.products = [...cart.products];

        // we replace the product at the index where we found the product with the updated product
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // But if there is no product found
        // The updated product then becomes the updated product with a quantity of 1
        updatedProduct = { id, qty: 1 };

        // We then add the new updated product to the old cart of products
        cart.products = [...cart.products, updatedProduct];
      }

      // after all this, the total price of the cart then becomes,
      // the old total price plus the passed price of the product we are adding to the cart
      cart.totalPrice = cart.totalPrice + productPrice;

      // We then update the cart file by writing to it.
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.error(err);
      });
    });
  }
};
