const userDataAccess = require('../data-access-layer/user-dal');

const postNewUserProduct = async (payload) => {
    await userDataAccess.addUserProductListing(payload);
}

module.exports = { postNewUserProduct };