// jshint esversion:9
const axios = require('axios').default;
const nodemailer = require('nodemailer');
const router = require('express').Router();

const routes = () => {

  router.route('/')
    .get((req, res) => {
      return res.render('contact');
    }).post( async (req, res) => {
      if(!req.body.name || !req.body.email || !req.body.message || !req.body.token) {
        return res.status(400).json({
          status: false,
          error: 'one or more fields missing, please refresh and try again'
        });
      }

      // Verify recaptcha token

      const captchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', {}, {
        params: {
          secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
          response: req.body.token
        }
      });

      // Validate captcha response
      if(captchaResponse && captchaResponse.data.success === true) {

        const transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
          }
        });

        // initialize mail options
        const mailOptions = {
          from: req.body.email,
          to: process.env.RECIEPIENT_EMAIL,
          subject: 'Customer Mail',
          html: `
          <h3>New Message from ${req.body.name}</h3>
          <p>${req.body.message}</p>
          `
        };

        // initialize reply options
        const replyOptions = {
          from: `Papapa <${process.env.RECIEPIENT_EMAIL}>`,
          to: req.body.email,
          subject: 'Thank You!',
          html: `
          <h3>Hello ${req.body.name}</h3>
          <p>Thank you for reaching out to us, please keep an eye out for more replies from us.</p>
          <p>Regards,</p>
          <p>Management.</p>
          `
        };

        // Send mail with transport
        return transport.sendMail(mailOptions, (error, info) => {
          if(error) {
            console.log(error);
            return res.status(422).json({
              status: false,
              error: error.message
            });
          }

          // Send automated reply
          return transport.sendMail(replyOptions, (replyErr, replyInfo) => {
            if(replyErr) {
              return res.status(422).json({
                status: 'failed',
                error: replyErr.message
              });
            }

            return res.status(200).json({
              status: true,
              message: 'Message sent successfully',
              response: replyInfo
            });
          });
        });
      } else {
        return res.json({
          status: false,
          message: 'Bots not allowed',
          data: req.body,
          'captcha-validation-response': captchaResponse.data
        });
      }
    });

  return router;
};

module.exports = routes;