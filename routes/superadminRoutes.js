const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');

router.get('/users', superadminController.getUsers);
router.post('/approve/:id', superadminController.approveUser);
router.post('/block/:id', superadminController.blockUser);
router.post('/unblock/:id', superadminController.unblockUser);

module.exports = router;
