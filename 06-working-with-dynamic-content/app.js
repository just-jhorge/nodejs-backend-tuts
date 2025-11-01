const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");

const rootDir = require("./util/path");

const app = express();

// Using EJS templating engine
app.set("view engine", "ejs");
app.set("views", "views");

// Using Express Handlebars templating engine
// NOTE => the name given, hbs in this case, should be used as the file extension for the 'html'
// app.engine(
//   "handlebars",
//   engine({ layoutsDir: "views/layouts/", defaultLayout: "main" })
// );
// app.set("view engine", "handlebars");
// app.set("views", "views");

// Using Pug templating engine
// app.set("view engine", "pug");
// app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
  res
    .status(404)
    .render("404", {
      pageTitle: "Not Found",
      formsCss: false,
      productCss: false,
    });
});

app.listen(3001);
