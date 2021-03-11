const router = require('express').Router()

const routes = () => {

  router.route('/')
    .get((req, res) => {
      res.render('index');
    });

  return router;
}

module.exports = routes;