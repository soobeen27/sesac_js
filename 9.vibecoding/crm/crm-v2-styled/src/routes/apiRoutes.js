const express = require('express');
const router = express.Router();
const controller = require('../controllers/crmController');

router.get('/data/:table', controller.getList);
router.get('/data/:table/:id', controller.getDetail);
router.get('/crm/:type/:id', controller.getCrmData);
router.post('/orders', controller.createOrder); // POST 요청 연결

module.exports = router;