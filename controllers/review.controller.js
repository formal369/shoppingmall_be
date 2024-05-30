const Review = require('../models/Review');

const reviewController = {};

reviewController.addReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    const review = new Review({ userId, productId, rating, comment });
    await review.save();
    res.status(200).json({ status: "success", review });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

reviewController.getReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    const reviews = await Review.find({ productId }).populate('userId', 'username');
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = reviewController;
