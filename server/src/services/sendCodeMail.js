const nodemailer = require('nodemailer');
const { smtpConfig, logoUrl, privacyUrl, termsUrl } = require('../config');

const generateTemplate = code =>
  `
    <div style="margin: 0 auto 25px auto;padding-bottom: 10px; border-bottom: 1px solid #000;">
        <img width="300" border="0" style="display: inline-block;" src="${logoUrl}" title="Falcon" alt="Falcon" />
        <span style="display: inline-block;">Phone: <a href="tel:+0747215726"> +40 747 215 726 </a></span>
    </div>
    <div style="padding: 5px 0;">
    To reset your password, or confirm this email address, type in the required field the following code.
    </div>
    <div style="padding: 5px 0;">Confirmation code: <b>${code}</b></div>
    <div style="padding: 5px 0;">
    If you are still having trouble, please contact Technical Support at
    <a href="tel:+0747215726"> +40 747 215 726 </a>
    </div>
    <div style="padding: 5px 0;">
    Falcon Services<br />
    <a href="${privacyUrl}">Privacy Policy</a> | <a href="${termsUrl}">Terms & Conditions</a>
    </div>
  `;

module.exports = (userEmail, code) => {

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport(smtpConfig);
    
    const mailOptions = {
      from: '"Falcon Service" <support@falcon.io>', // sender address
      to: userEmail,
      subject: 'Confirmation Code',
      html: generateTemplate(code)
    };

    transporter.sendMail(mailOptions, function (error, info) {
      console.log(error);
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Message sent: ' + info.response);
        resolve(info.response);
      }
    });
  });
};
