import { DATA_PATH, readDataFile} from "../utils/handlerUtils.js";
import fs from "node:fs/promises";

export async function cartHandler(req, res) {

    const data = await readDataFile();
    // 2. Obtener o crear el carrito (por ahora usaremos el primero)
    const cart = data.carts[0] || { id: 1, items: [] };

    // Armar arreglo con los datos del producto + cantidad
    const cartProducts = cart.items
        .map((item) => {
        const product = data.products.find(
            (product) =>
            product.id === item.productId &&
            product.categoryId === item.categoryId
        );

        if (!product) {
            return null;
        }

        return {
            productId: product.id,
            categoryId: product.categoryId,
            name: product.name,
            price: product.price,
            imgSrc: product.imgSrc,
            quantity: item.quantity,
            subtotal: product.price * item.quantity
        };
    }).filter((item) => item !== null);

    const total = cartProducts.reduce( (acc, item) => acc + item.subtotal, 0 );
    res.render("cart", {cart, cartProducts, total});
}

export async function addCartHandler(req, res) {

    const productId = Number(req.body.productId);
    const categoryId = Number(req.body.categoryId); 

    const data = await readDataFile();

    // 1. Verificar que el producto existe
    const product = data.products.find(
      (product) => product.id === productId && product.categoryId === categoryId,
    );
    if (!product) {
        return res.status(404).render("404"); // Vista de error
    }
    // 2. Obtener o crear el carrito (por ahora usaremos el primero)
    const cart = data.carts[0] || { id: 1, items: [] };

    // 3. Buscar si el producto ya está en el carrito
    const cartItem = cart.items.find((item) => item.productId === productId  && item.categoryId === categoryId);

    if (cartItem) {
        cartItem.quantity += 1; // Incrementar si existe
    } else {
        cart.items.push({ productId, categoryId, quantity: 1 }); // Agregar si no
    }

    // 4. Guardar cambios
    data.carts[0] = cart;
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

    res.redirect("/cart");
}

export async function updateCartItemQuantityHandler(req, res) {
    const productId = Number(req.body.productId);
    const categoryId = Number(req.body.categoryId);
    const action = req.body.action;

    if (!Number.isInteger(productId) || !Number.isInteger(categoryId)) {
        return res.status(400).send("Producto inválido");
    }

    const data = await readDataFile();

    const cart = data.carts[0];

    if (!cart) {
        return res.redirect("/cart");
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId && item.categoryId === categoryId
    );

    if (itemIndex === -1) { return res.redirect("/cart"); }

    if (action === "increase") {
        cart.items[itemIndex].quantity += 1;
    } else if (action === "decrease") {
        cart.items[itemIndex].quantity -= 1;

        if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
        }
    } else if (action === "remove") {
        cart.items.splice(itemIndex, 1);
    } else {
        return res.status(400).send("Acción inválida");
    }

    data.carts[0] = cart;

    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

    return res.redirect("/cart");
}