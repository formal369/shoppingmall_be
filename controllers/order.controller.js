const Order = require('../models/Order');
const productController = require('./product.controller');
const { randomStringGenerator } = require('../utils/randomStringGenerator');

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body;
    // 재고확인 & 재고업데이트
    const insufficientStockItems = await productController.checkItemListStock(orderList);
    // 재고가 부족한 아이템이 있으면 에러메세지와 함께 리턴
    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce((total, item) => {
        return total + item.message;
      }, '');
      throw new Error(errorMessage);
    }

    // order 생성
    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();
    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrder = async (req, res, next) => {
  try {
    const { userId } = req;

    const orderList = await Order.find({ userId: userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "image name",
      },
    });
    // const totalItemNum = await Order.find({ userId: userId }).count();

    // const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
    res.status(200).json({ status: "success", data: orderList });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;