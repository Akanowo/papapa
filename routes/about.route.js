const router = require('express').Router()

const routes = () => {

  router.route('/')
    .get((req, res) => {
      res.render('about');
    });

  return router;
}

module.exports = routes;