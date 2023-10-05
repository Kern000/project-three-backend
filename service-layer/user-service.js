const userDataAccess = require('../data-access-layer/user-dal');

const postNewUserProduct = async (payload) => {
    await userDataAccess.addUserProductListing(payload);
}

const updateUserProduct = async (payload) => {
    await userDataAccess.updateUserProductListing(payload);
}

module.exports = { postNewUserProduct, updateUserProduct };