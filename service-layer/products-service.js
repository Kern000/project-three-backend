const productsDataAccess = require('../data-access-layer/products-dal');

const retrieveAllProducts = async () => {
    let products = await productsDataAccess.retrieveAllProducts();
    return products;
}

const retrieveAllPostCategories = async () => {
    let postCategories = await productsDataAccess.retrieveAllPostCategories();
    return postCategories;
}

const retrieveAllGenres = async () => {
    let genres = await productsDataAccess.retrieveAllGenres();
    return genres;
}

const findProductById = async (productId) => {
    let product = await productsDataAccess.findProductById(productId);
    return product;
}

const findProductsByUserId = async (userId) => {
    let products = await productsDataAccess.findProductsByUserId(userId);
    return products;
}

const addProductListing = async (productForm) => {
    let addProduct = await productsDataAccess.addProductListing(productForm);
    return addProduct;
}

module.exports= {
                    retrieveAllProducts,
                    retrieveAllPostCategories,
                    retrieveAllGenres,
                    findProductById,
                    findProductsByUserId,
                    addProductListing
                }