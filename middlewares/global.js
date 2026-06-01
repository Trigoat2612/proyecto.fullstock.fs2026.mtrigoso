import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.join("data", "data.json");
export async function countCartItems(_req, res, next) {
  const dbJson = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(dbJson);
 
  const cart = db.carts[0];
  const cartItemsCount = cart
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;
 
  // Al guardar el dato en res.locals, estará disponible en TODAS las vistas
  // sin tener que pasarlo manualmente en cada res.render
  res.locals.cartItemsCount = cartItemsCount;
 
  // Es fundamental llamar a next() para que la petición siga su curso hacia las rutas
  next();
}