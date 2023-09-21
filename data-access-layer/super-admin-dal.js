const { User } = require('../models');

const retrieveAllUsers = async () => {
    console.log('retrieve all users hit')
    try{
        return await User.fetchAll({
            withRelated: ['order_items', 'products']
        });
    } catch (error) {
        console.error('error retrieving all Users', error)
    }
}

const findUserById = async (userId) => {
    console.log('findUserById dal hit');
    try{
        const userFoundById = await User.where({
            'id': userId
        }).fetch({
            require:true,
            withRelated: ['order_items', 'products']
        })
        return userFoundById;
    } catch (error){
        console.error('error finding user by Id', error)
    }
}

module.exports = {retrieveAllUsers,findUserById};

