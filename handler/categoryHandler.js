import { AppError } from "../utils/errorUtils.js";
import { parsePriceToCents, readDataFile } from "../utils/handlerUtils.js";
import { } from "../utils/handlerUtils.js";


export async function categoryHandler(req, res) {
    const categorySlug = req.params.slug;
    const { minPrice: minPriceQuery, maxPrice: maxPriceQuery } = req.query;

    const minPrice = parsePriceToCents(minPriceQuery) ?? -Infinity;
    const maxPrice = parsePriceToCents(maxPriceQuery) ?? Infinity;

    // 1. Leer el archivo JSON
    const data = await readDataFile();

    const category = data.categories.find(
      (category) => category.slug === categorySlug,
    );

    if (!category) {
        throw new AppError("Categoría no encontrada", 404);
    }

    const products = data.products.filter((product) => {
      const belongsToCategory = product.categoryId === category.id;
      const meetsMinPrice = product.price >= minPrice;
      const meetsMaxPrice = product.price <= maxPrice;
    
      return belongsToCategory && meetsMinPrice && meetsMaxPrice;
    });

    res.render("category", {
      category,
      products,
      // Enviamos los valores para volver a llenar el formulario
      minPrice: minPriceQuery ?? "",
      maxPrice: maxPriceQuery ?? ""
    });
};