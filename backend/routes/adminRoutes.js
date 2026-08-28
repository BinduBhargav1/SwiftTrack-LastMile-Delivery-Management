const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.getDashboardStats);
router.get('/zones', adminController.getZones);
router.post('/zones', adminController.createZone);
router.get('/rates', adminController.getRates);
router.post('/rates', adminController.createRateCard);
router.get('/agents', adminController.getAllAgents);
router.post('/agents', adminController.createAgent);
router.get('/agents/pending', adminController.getPendingAgents);
router.post('/agents/approve', adminController.approveAgent);
router.delete('/agents/reject/:id', adminController.rejectAgent);
router.delete('/agents/:id', adminController.deleteAgent);
router.get('/points', adminController.getPoints);
router.post('/points', adminController.createPoint);

module.exports = router;
