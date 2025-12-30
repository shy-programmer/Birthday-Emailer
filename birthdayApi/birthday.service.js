const celebrantModel = require('./birthday.model')

const createCelebrant = async (data) => {
    const {username, email, birthday} = data
    const newCelebrant = await celebrantModel.create({
        username,
        email,
        birthday
    })
    return {
        code: 201,
        message: 'Celebrant created successfully',
        data: newCelebrant
    }
}

const getCelebrants = async () => {
    const allCelebrants = await celebrantModel.find();
    return {
        code: 200,
        message: 'All celebrants gotten successfully',
        data: allCelebrants
    }
}

module.exports = {
    createCelebrant,
    getCelebrants
}