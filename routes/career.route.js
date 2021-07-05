const router = require('express').Router()

const routes = () => {

  router.route('/')
    .get((req, res) => {
      res.render('career');
    });

  return router;
};

module.exports = routes;