
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(receiverEmail: string, otpCode: string) {

    // Create a transporter object
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // use SSL
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    });
    
    // Configure the mailoptions object
    const mailOptions = {
        from: '"VeNtura E-commerce" <noreply@yourapp.com>',
        to: receiverEmail,
        subject: 'Email Verification',
        text: `Hello! Use this code to verify your email address: ${otpCode}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log("Send verification mail error:", error);
        console.log('Email sent: ' + info.response);
    });
}
