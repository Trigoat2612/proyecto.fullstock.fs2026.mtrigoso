import { readDataFile } from "../utils/handlerUtils.js";

export async function productsHandler(req, res) {

    const productKey = req.params.productKey;
    const [categoryIdStr, productIdStr] = productKey.split(".");
    const categoryId = Number(categoryIdStr);
    const productId = Number(productIdStr);
    // 1. Leer el archivo JSON
    const data = await readDataFile();

    const product = data.products.find(
      (product) => product.id === productId && product.categoryId === categoryId,
    );

    if (!product) {
        return res.status(404).render("404");
    }
    res.render("product", { product });
}