const Cart = require('../models/CART');

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;
    // 유저를 이용해서 카트찾기
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // 유저가 만든 카트가 없으면 만들어주기
      cart = new Cart({ userId });
      await cart.save();
    };
    // 카트에 이미 아이템이 있는지 확인하기
    const existItem = cart.items.find(item => item.productId.equals(productId) && item.size === size);
    if (existItem) {
      throw new Error("アイテムはすでにカートにあります。");

    }
    // 카트에 아이템 추가하기
    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();
    res.status(200).json({ status: "success", cart, cartItemQty: cart.items.length });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    });
    res.status(200).json({ status: "success", data: cart.items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    cart.items = cart.items.filter((item) => !item._id.equals(id));

    await cart.save();
    res.status(200).json({ status: 200, cartItemQty: cart.items.length });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.editCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    });
    if (!cart) throw new Error("カートがありません。");
    const index = cart.items.findIndex((item) => item._id.equals(id));
    if (index === -1) throw new Error("アイテムがありません。");
    cart.items[index].qty = qty;
    await cart.save();
    res.status(200).json({ status: "success", data: cart.items });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCartQty = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("カートがありません。");
    res.status(200).json({ status: "success", qty: cart.items.length });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;