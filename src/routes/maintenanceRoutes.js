const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// GET /api/maintenance?vehicleId=2
router.get('/', maintenanceController.getMaintenance);

// POST /api/maintenance
router.post('/', maintenanceController.createMaintenance);

// PUT /api/maintenance/:id
router.put('/:id', maintenanceController.updateMaintenance);

// DELETE /api/maintenance/:id
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;
