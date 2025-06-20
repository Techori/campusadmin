const express = require('express');
const router = express.Router();
const { getAllStudents } = require('../../controllers/admin/studentController');
const { getAllColleges } = require('../../controllers/admin/studentController');
const { getAllCompanies } = require('../../controllers/admin/studentController');

router.get('/students', getAllStudents);
router.get('/colleges', getAllColleges);
router.get('/companies', getAllCompanies);

module.exports = router;
