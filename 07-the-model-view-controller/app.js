const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/db");
const shopRoutes = require("./routes/shop.routes");
const adminRoutes = require("./routes/admin.routes");
const errorController = require("./controllers/error.controller");

const User = require("./models/user.model");
const Cart = require("./models/cart.model");
const Order = require("./models/order.model");
const Product = require("./models/product.model");
const CartItem = require("./models/cart-item.model");
const OrderItem = require("./models/order-item.model");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.error(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// A product belongs to a user => 1 to 1 relation
Product.belongsTo(User);
// User has many products => 1 to n relation
User.hasMany(Product);
// A user has one cart => 1 to 1 relation
User.hasOne(Cart);
// A cart belongs to a user => 1 to 1 relation
Cart.belongsTo(User);
// Many carts may have many products also through the CartItem table
Cart.belongsToMany(Product, { through: CartItem });
// Many products may be found in many carts through the cartItem
Product.belongsToMany(Cart, { through: CartItem });
// An order belongs to one user
Order.belongsTo(User);
// A user may have many orders
User.hasMany(Order);
// Many orders may have many products which can be found in the order item table
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "George Afrifa",
        email: "gsafrifa@gmail.com",
      });
    }
    return user;
  })
  .then((user) => {
    // console.log("User created successfully");
    return user.createCart();
  })
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => console.error(err));
