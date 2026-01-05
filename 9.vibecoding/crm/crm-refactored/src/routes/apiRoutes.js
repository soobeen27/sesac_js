const express = require('express');
const router = express.Router();
const controller = require('../controllers/crmController');

// Standard CRUD (Read only)
router.get('/data/:table', controller.getList);
router.get('/data/:table/:id', controller.getDetail);

// CRM Analytics
router.get('/crm/:type/:id', controller.getCrmData);

module.exports = router;