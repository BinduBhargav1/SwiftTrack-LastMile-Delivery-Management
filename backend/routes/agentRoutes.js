const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.get('/', agentController.getAgents);
router.post('/assign', agentController.assignAgent);
router.get('/:id/availability', agentController.getAvailability);
router.put('/:id/availability', agentController.updateAvailability);

module.exports = router;
