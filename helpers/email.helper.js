import nodemailer from 'nodemailer'


// create reusable transporter object using the default SMTP transport


const send = async infoObj => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SMTP,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        // send mail with defined transport object
  let info = await transporter.sendMail(infoObj);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    } catch (error) {
        console.log(error)
    }
}

const emailProcessor = ({ fname, email, pin, subject, text, html }) => {
    let info = {
            from: `"EShop 👻" <${process.env.EMAIL_USER}>`, // sender address
            to: email, // list of receivers
            subject,  // Subject line
            text,
            html,
    }
            send(info)

}

export const sendEmailVerificationLink = (emailObj) => {
    const {fname, pin, email} = emailObj

    const link = `http://localhost:3000/email-varification?pin=${pin}&email=${email}`
    const obj = {
        ...emailObj,
subject: "Email confirmation required",
text: `Hi ${fname}, please follow the link below to confirm your email. ${link}`, // plain text body
html: `
Hello there,
<br/>

Please follow the link below to confirm your email. <br/>
${link}

<br/><br/>
Thank you<br/><br/>

Kind Regards, <br/><br/>
--some company information--
`, // html body
}

    emailProcessor(obj)
}

//send the email confirm welcome message

export const sendEmailVerificationCOnfirmation = (emailObj) => {
    const {fname} = emailObj

    const obj = {
        ...emailObj,
subject: "Email confirmation required",
text: `Hi ${fname}, Your email has been verified. You can now log in!`, // plain text body
html: `
Hello ${fname},
<br/>

Your email has been verified. You can now log in!

<br/><br/>
Thank you<br/><br/>

Kind Regards, <br/><br/>
--some company information--
`, // html body
}

    emailProcessor(obj)
}
