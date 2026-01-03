const celebrantService = require('./birthday.service');

const createCelebrant = async (req, res) => {
    try {
        const newCelebrant = req.body;
        const response = await celebrantService.createCelebrant(newCelebrant);

        res.status(response.code).json({
            message: response.message,
            data: response.data
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error
        })
    }
}

const getCelebrants = async (req, res) => {
    try {
        const response = await celebrantService.getCelebrants()

        res.status(response.code).json({
            message: response.message,
            data: response.data
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error
        })
    }
}

module.exports = {
    createCelebrant,
    getCelebrants
}