const Product = require('../models/Product');

const productController = {};
const PAGE_SIZE = 5;

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, image, category, description, price, stock, size, status } = req.body;
    const product = new Product({ sku, name, image, category, description, price, stock, size, status });
    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page, name } = req.query;
    // const condition = name ? { name: { $regex: name, $options: 'i' } } : {};
    const condition = {
      isDeleted: false, ...name ? { name: { $regex: name, $options: 'i' } } : {}
    };
    let query = Product.find(condition);
    const response = { status: "success" }
    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      // 최종 몇개 페이지인지 확인
      const totalItemNum = await Product.find(condition).count();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }
    const productList = await query.exec();
    response.data = productList;
    res.status(200).json({ ...response });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { sku, name, image, category, description, price, stock, size, status } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { sku, name, image, category, description, price, stock, size, status },
      { new: true }
    );
    if (!product) throw new Error("Product not found");
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true },
      { new: true }
    );
    if (!product) throw new Error("Product not found");
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.checkStock = async (item) => {
  // 사려는 아이템 재고정보 들고오기
  const product = await Product.findById(item.productId);
  // 사려는 아이템 qtyd와 재고 비교
  if (product.stock[item.size] < item.qty) {
    // 재고가 충분하지 않으면 불충분 메세지와 함께 해당 아이템 정보 리턴
    return { isVerify: false, message: `${product.name}의 ${item.size} 사이즈 재고가 부족합니다. 현재 ${product.stock[item.size]}개 남았습니다.` };
  }
  // 충분하다면, 재고에서 아이템 qty만큼 빼고 성공 메세지 리턴
  const newStock = { ...product.stock };
  newStock[item.size] -= item.qty;
  product.stock = newStock;

  await product.save();
  return { isVerify: true };
};

productController.checkItemListStock = async (itemList) => {
  const insufficientStockItems = [];
  // 재고확인 로직
  await Promise.all(
    itemList.map(async (item) => {
      const checkStock = await productController.checkStock(item);
      if (!checkStock.isVerify) {
        insufficientStockItems.push({ ...item, message: checkStock.message });
      }
      return checkStock;
    })
  );
  return insufficientStockItems;
};


module.exports = productController;