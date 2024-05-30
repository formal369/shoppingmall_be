const express = require('express');
const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.post('/',
  authController.authenticate,
  reviewController.addReview
);

router.get('/',
  reviewController.getReviews
);

module.exports = router;
