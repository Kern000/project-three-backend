const productsDataAccess = require('../data-access-layer/products-dal');

const retrieveAllProducts = async () => {
    await productsDataAccess.retrieveAllProducts();
}

const retrieveAllPostCategories = async () => {
    await productsDataAccess.retrieveAllPostCategories();
}

const retrieveAllGenres = async () => {
    await productsDataAccess.retrieveAllGenres();
}

const findProductById = async (productId) => {
    await productsDataAccess.findProductById(productId);
}

const findProductsByUser = async (userName) => {
    await productsDataAccess.findProductsByUser(userName);
}

const addProductListing = async (productForm) => {
    await productsDataAccess.addProductListing(productForm);
}

module.exports= {
                    retrieveAllProducts,
                    retrieveAllPostCategories,
                    retrieveAllGenres,
                    findProductById,
                    findProductsByUser,
                    addProductListing
                }