const express = require('express');
const router = express.Router();
const controller = require('../controllers/weatherController');

router.get('/current', controller.getCurrent);
router.get('/', controller.getAll);
router.post('/', controller.create);

module.exports = router;
