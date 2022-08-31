const router = require('express').Router();

//Import all API routes from /api/index.js (no need for index.js though since its implied )
const apiRoutes = require('./api');
const htmlRoutes = require('./html/html-routes');

//add prefix of `/api` to all api routes imported from `api` directory
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;
