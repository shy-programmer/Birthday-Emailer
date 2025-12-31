const nodemailer = require('nodemailer')
const schedule = require('node-schedule');
const celebrantModel = require('../birthdayApi/birthday.model')
const dotenv = require('dotenv')
dotenv.config();
const fs = require('fs');
const path = require("path");

const sender = process.env.MY_MAIL

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    scope: "https://mail.google.com/",
    port: 587,
    secure: false,
    auth: {
        type: "OAuth2",
        user: "earforsound@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    }
});


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

const sendBirthdayEmail = async (email, username) => {
    try {
        const htmlContent = getBirthdayTemplate(username);

        await transporter.sendMail({
            "from": `"Birthday-Emailer" ${sender}`,
            "to": `${email}`,
            "subject": `Hapy Birthday! ${username}`,
            "html": htmlContent
        })
    } catch (err) {
        console.error(`Error sending email to ${email}:`, err);
    }
}

const getBirthdayTemplate = (username) => {
    const filePath = path.join(__dirname, 'birthdayMail.html');
    let html = fs.readFileSync(filePath, 'utf8');

    html = html.replace('{{username}}', username);

    return html;
};
