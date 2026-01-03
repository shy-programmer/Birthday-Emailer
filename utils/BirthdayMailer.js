const sgMail = require('@sendgrid/mail');
const schedule = require('node-schedule');
const celebrantModel = require('../birthdayApi/birthday.model')
const dotenv = require('dotenv')
dotenv.config();
const fs = require('fs');
const path = require("path");

// Setting sg mail API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Setting my mail
const SENDER = process.env.MY_MAIL

// Cron job for sending
schedule.scheduleJob('0 7 * * *', async () => {
    console.log('Checking for birthdays today...');

    await birthdayChecker()

})

// Checking who has a birthday today
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
    if (celebrants.length === 0) {
        console.log("No birthdays today");
        return
    }
    else {
        for (const celebrant of celebrants) {
            await sendBirthdayEmail(celebrant.email, celebrant.username);
        }
    }
}

// Mail sending logic
const sendBirthdayEmail = async (email, username) => {
    try {
        const htmlContent = getBirthdayTemplate(username);

        const msg = {
            to: email,
            from: {
                email: SENDER,
                name: 'Birthday Emailer'
            },
            subject: `Happy Birthday 🎉 ${username}`,
            html: htmlContent
        };

        await sgMail.send(msg);
        console.log(`Email sent to ${email}`);
    } catch (err) {
        console.error(`Failed to send to ${email}:`, err.response?.body || err.message);
    }
};

// Setting mail username
const getBirthdayTemplate = (username) => {
    const filePath = path.join(__dirname, '../views/birthdayMail.html');
    let html = fs.readFileSync(filePath, 'utf8');

    html = html.replace('{{username}}', username);

    return html;
};
