const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getProduct = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([row, fieldData]) => {
      res.render("shop/product-detail", {
        product: row[0],
        pageTitle: row[0].title,
      });
    })
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, +product.price);
  });
  res.redirect("/cart");
};

exports.getCart = (req, res) => {
  Cart.getCartProducts((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.id);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};
