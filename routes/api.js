const express = require('express');
const router = express.Router();
const verifications = require('./../controllers/verifications');

router.get('/test', verifications.test);
router.get('/verify', verifications.getVerification);
router.post('/verify', verifications.verify);

module.exports = router;