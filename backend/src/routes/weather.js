const express = require('express');
const router = express.Router();
const controller = require('../controllers/weatherController');

router.get('/current', controller.getCurrent);
router.get('/historical', controller.getHistorical);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);

module.exports = router;
