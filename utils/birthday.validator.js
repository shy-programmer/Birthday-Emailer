const joi = require('joi');
const celebrantModel = require('../birthdayApi/birthday.model')

// Validating celebrant input
const ValidateCelebrant = async (req, res, next) => {
    const schema = joi.object({
        username: joi.string().alphanum().required(),
        email: joi.string().email({ minDomainSegments: 2 }).required(),
        birthday: joi.date().required()
    })

    try {
        await schema.validateAsync(req.body);

        const existingMail = await celebrantModel.findOne({ email: req.body.email });
        if (existingMail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        next();
    }
    catch (error) {
        res.status(400).json({
            message: error.details ? error.details[0].message : "Validation error"
        });
    }
}

module.exports = ValidateCelebrant;
