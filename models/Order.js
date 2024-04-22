const mongoose = require('mongoose');
const User = require('./User');
const Cart = require('./Cart');
const Product = require('./Product');
const Schema = mongoose.Schema;

const orderSchema = Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: User
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    default: "preparing" // types : preparing, shipping, delivered  
  },
  shipTo: {
    type: Object,
    required: true
  },
  contact: {
    type: Object,
    required: true
  },
  orderNum: {
    type: String,
  },
  items: [{
    productId: {
      type: mongoose.ObjectId,
      ref: Product
    },
    size: {
      type: String,
      required: true
    },
    qty: {
      type: Number,
      default: 1,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }]
}, { timeStamps: true });

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
}

orderSchema.post('save', async function () {
  const cart = await Cart.findOne({ userId: this.userId });
  cart.items = [];
  await cart.save();
});

// const Order = mongoose.model('Order', orderSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;