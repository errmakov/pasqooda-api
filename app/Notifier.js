const nodemailer = require("nodemailer");
class Notifier {
    constructor(options) {
        this._options = options;
        this.transporter = nodemailer.createTransport({
            host: options.smtp.host,
            port: options.smtp.port,
            secure: true,
            auth: {
              user: options.smtp.user,
              pass: options.smtp.password
            }
          });
    }
    sendEmail(to, subject, message) {
        return this.transporter.sendMail({
            from: this._options.smtp.from,
            to: to,
            subject: subject,
            text: message // plain text body
          });
    }
}

module.exports = Notifier;