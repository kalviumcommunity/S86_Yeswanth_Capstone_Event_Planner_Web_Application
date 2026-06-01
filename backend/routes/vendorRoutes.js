const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/', auth, authorize(['organizer']), vendorController.getVendors);
router.post('/', auth, authorize(['organizer']), vendorController.createVendor);
router.put('/:id', auth, authorize(['organizer']), vendorController.updateVendor);
router.delete('/:id', auth, authorize(['organizer']), vendorController.deleteVendor);

module.exports = router;
