const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//     to: 'saiprasaddash07@gmail.com',
//     from: 'saiprasaddash07@gmail.com',
//     subject: 'This is my first creation!',
//     text: 'I hope this one actually get to you',
// });

const sendWelcomemail = (email,name) => {
    sgMail.send({
        to:email,
        from:'saiprasaddash07@gmail.com',
        subject:'Thanks for joing in',
        text: `Welcome to the app ${name} . Let me know how you get along with the app!`,
    })
}

const bidFarewellmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'saiprasaddash07@gmail.com',
        subject:'Thanks for joing in',
        text: `Goodbye ${name} . What we could have done to keep you on board?`,
    })
}

module.exports = {
    sendWelcomemail,
    bidFarewellmail
}