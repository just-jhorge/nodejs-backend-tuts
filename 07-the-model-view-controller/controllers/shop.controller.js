const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

// Gets all products on the index page
exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.error(err));
};

// Gets all products on the shop page
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

// Gets a single product for the product details page
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
      });
    })
    .catch((err) => console.error(err));
};

// Get all products in the cart
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.error(err));
};

// Adds a product to the cart
exports.postAddProductToCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    // Every user has a cart so we get the cart of that user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      // Then we get the products in the users cart
      // Proceeding to check if the product we are trying to add
      // is already in the cart
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      // Did we get the product in the cart?
      if (products.length > 0) {
        product = products[0];
      }
      // If the product is already in the cart
      if (product) {
        const oldQty = product.cartItem.quantity;
        newQuantity = oldQty + 1;
        return product;
      }
      // If the product is not in the cart, let us find the product
      // to the fetchedCart
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.error(err);
    });
};

// Removes a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

// Get all orders by the user
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.error(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .then(() => {
          return fetchedCart.setProducts(null);
        })
        .then(() => {
          res.redirect("/orders");
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};
