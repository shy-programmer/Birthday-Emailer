const schedule = require('node-schedule');
const celebrantModel = require('../birthdayApi/birthday.model')


schedule.scheduleJob('0 7 * * *', async () => {
    console.log('Checking for birthdays today...');

    await birthdayChecker()

})

const birthdayChecker = async () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const celebrants = await celebrantModel.find({
        $expr: {
            $and: [
                { $eq: [{ $dayOfMonth: '$birthday' }, day] },
                { $eq: [{ $month: '$birthday' }, month] }
            ]
        }
    });

    if (celebrants) {
        for (const celebrant of celebrants) {
        await sendBirthdayEmail(celebrant.email, celebrant.username);
    }
}
}

const sendBirthdayEmail = async (email, username) => {
    // nodemailer
}

