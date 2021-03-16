const axios = require('axios').default;
const nodemailer = require('nodemailer');
const router = require('express').Router()

const routes = () => {

  router.route('/')
    .get((req, res) => {
      return res.render('contact');
    }).post( async (req, res) => {
      if(!req.body.name || !req.body.email || !req.body.message || !req.body.token) {
        return res.status(400).json({
          status: 'failed',
          error: 'one or more fields missing, please refresh and try again'
        });
      }

      // Verify recaptcha token

      const captchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', {}, {
        params: {
          secret: '6Le2XH8aAAAAAP6072jb0FtOw-6lSsxG7u0MMx_a',
          response: req.body.token
        }
      });

      // Log captcha response

      // Validate captcha response
      if(captchaResponse && captchaResponse.data.success === true) {

        console.log(process.env.RECIEPIENT_EMAIL);
        console.log(process.env.RECIEPIENT_PWD);

        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.RECIEPIENT_EMAIL,
            pass: process.env.RECIEPIENT_PWD
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
              status: 'failed',
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
              status: 'success',
              message: 'Message sent successfully',
              response: replyInfo
            });
          });
        });
      } else {
        return res.json({
          status: 'failed',
          message: 'Bots not allowed',
          data: req.body,
          'captcha-validation-response': captchaResponse.data
        });
      }
    });

  return router;
};

module.exports = routes;