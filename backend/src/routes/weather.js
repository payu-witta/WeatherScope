const express = require('express');
const router = express.Router();
const controller = require('../controllers/weatherController');

router.get('/export', controller.exportData);
router.get('/current', controller.getCurrent);
router.get('/historical', controller.getHistorical);
router.get('/videos', controller.getVideos);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
