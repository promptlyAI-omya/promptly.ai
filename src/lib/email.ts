import nodemailer from 'nodemailer';

type EmailPayload = {
    to: string;
    subject: string;
    html: string;
};

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
export const sendEmail = async (data: EmailPayload) => {
    let transporter;

    if (process.env.SMTP_HOST) {
        // Production / Configured SMTP
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Dev / Ethereal
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    const info = await transporter.sendMail({
        from: '"Promptly AI" <contact@promptly.ai>', // sender address
        to: data.to,
        subject: data.subject,
        html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    if (!process.env.SMTP_HOST) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
};
