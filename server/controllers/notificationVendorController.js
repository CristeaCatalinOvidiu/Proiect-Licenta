import nodemailer from 'nodemailer'
import {google} from 'googleapis'
import dotenv from "dotenv"

dotenv.config()


const {OAuth2}  = google.auth
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    OAUTH_PLAYGROUND
)

// send mail
const notifyVendor = async (to, details) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    google.options({ auth: oauth2Client })

    const accessToken = oauth2Client.getAccessToken()
    
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "A product is no longer in stock...... Save Ukraine Site",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">From Save Ukraine Site</h2>
            <p>
                Dear vendor, I'm sorry to notify you , but a product is no longer on stock <br>
            </p>

            <p>
             ${details} <br>
            </p>


            <p>
            Please update the product when you will have it back in stock.
            </p>           


            Have a nice Day ! <br>

            <footer>
	        <p>Created by Save Ukraine  PWEB-IDP Team © 2022</p>
            </footer>
            
            </div>
        `
    }
    

    return await smtpTransport.sendMail(mailOptions)
}
export default notifyVendor