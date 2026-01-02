const nodemailer = require('nodemailer')
const schedule = require('node-schedule');
// const { google } = require("googleapis");
const celebrantModel = require('../birthdayApi/birthday.model')
const dotenv = require('dotenv')
dotenv.config();
const fs = require('fs');
const path = require("path");

const SENDER = process.env.MY_MAIL
// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REDIRECT_URI = "https://developers.google.com/oauthplayground";
// const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
    try {

        // const accessToken = await oAuth2Client.getAccessToken(); // Automatically refresh token
        // if (!accessToken.token) {
        //     throw new Error("Failed to retrieve access token");
        // }
        return nodemailer.createTransport({
            service: "gmail",
            // host: "smtp.gmail.com",
            // scope: "https://mail.google.com/",
            // port: 465,
            // secure: true,
            auth: {
                // type: "OAuth2",
                user: SENDER,
                pass: process.env.GOOGLE_APP_PASSWORD,
                // clientId: process.env.GOOGLE_CLIENT_ID,
                // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                // refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                // accessToken: accessToken.token,
            },
        });
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        return null;
    }
}

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     scope: "https://mail.google.com/",
//     port: 587,
//     secure: false,
//     auth: {
//         type: "OAuth2",
//         user: SENDER,
//         // pass: process.env.GOOGLE_APP_PASSWORD
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//     }
// });


schedule.scheduleJob('* * * * *', async () => {
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
        console.log({
            mail: SENDER,
            password: process.env.GOOGLE_APP_PASSWORD
        })
        for (const celebrant of celebrants) {
            await sendBirthdayEmail(celebrant.email, celebrant.username);
        }
    }
}

const sendBirthdayEmail = async (email, username) => {
    try {
        const htmlContent = getBirthdayTemplate(username);
        const transporter = await createTransporter()

        transporter.sendMail({
            "from": `"Birthday-Emailer" ${SENDER}`,
            "to": `${email}`,
            "subject": `Hapy Birthday! ${username}`,
            "html": htmlContent
        })
    } catch (err) {
        console.error(`Error sending email to ${email}:`, err);
    }
}

const getBirthdayTemplate = (username) => {
    const filePath = path.join(__dirname, '../views/birthdayMail.html');
    let html = fs.readFileSync(filePath, 'utf8');

    html = html.replace('{{username}}', username);

    return html;
};
