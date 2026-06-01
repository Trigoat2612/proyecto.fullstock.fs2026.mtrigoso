import express from "express";
import expressLayouts from "express-ejs-layouts";
import { categoryHandler } from "./handler/categoryHandler.js";
import { productsHandler } from "./handler/productHandler.js";
import { addCartHandler, cartHandler, updateCartItemQuantityHandler } from "./handler/cartHandler.js";
import { countCartItems } from "./middlewares/global.js";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(expressLayouts);

//middleware
app.use(countCartItems);

//Rutas
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" });
});

app.get("/cart", cartHandler);

app.get("/category", (req, res) => {
    res.render("category", { title: "Categories" });
});

app.get("/category/:slug", categoryHandler);

app.get("/product/:productKey", productsHandler);

app.get("/checkout", (req, res) => {
    res.render("checkout", { title: "Checkout" });
});

app.get("/order-confirmation", (req, res) => {
    res.render("order-confirmation", { title: "Order Confirmation" });
});

app.get("/privacy", (req, res) => {
    res.render("privacy", { title: "Privacy" });
});

app.get("/terms", (req, res) => {
    res.render("terms", { title: "Terms and Conditions" });
});

app.post("/cart/add-item", addCartHandler);
app.post("/cart/item/update", updateCartItemQuantityHandler);

app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});