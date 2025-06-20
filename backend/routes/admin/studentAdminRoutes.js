const express = require('express');
const router = express.Router();
const { getAllStudents } = require('../../controllers/admin/studentController');

router.get('/students', getAllStudents);

module.exports = router;
