const express = require('express');
const router = express.Router();
const auth = require('../services/authentication');

const{ 
     getSurveyreport,
     createSurveyreport,
     updateSurveyreport,
     deleteSurveyreport,
     getSurveyreports
} = require('../controllers/surveyreports');

router.get('/getSurveyreports', auth.authenticateToken, getSurveyreports);
router.post('/createSurveyreport', auth.authenticateToken, createSurveyreport);
router.patch('/updateSurveyreport/:id', auth.authenticateToken, updateSurveyreport);
router.delete('/deleteSurveyreport/:id', auth.authenticateToken, deleteSurveyreport);
router.get('/getSurveyreport/:id', auth.authenticateToken, getSurveyreport);

module.exports = router ;