const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: User,
    required: true
  },
  productId: {
    type: mongoose.ObjectId,
    ref: Product,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5  // 변경된 부분
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
