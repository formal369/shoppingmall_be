const Notice = require('../models/Notice');

const noticeController = {};

noticeController.createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = new Notice({ title, content });
    await notice.save();
    res.status(200).json({ status: "success", notice });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

noticeController.getNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const notices = await Notice.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalNotices = await Notice.countDocuments({ isDeleted: false });
    const totalPageNum = Math.ceil(totalNotices / limit);

    res.status(200).json({ status: "success", data: notices, totalPageNum });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};


noticeController.updateNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const { title, content } = req.body;
    const notice = await Notice.findByIdAndUpdate(
      { _id: noticeId },
      { title, content },
      { new: true }
    );
    if (!notice) throw new Error("Notice not found");
    res.status(200).json({ status: "success", notice });
  }
  catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  };
};

noticeController.deleteNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const notice = await Notice.findByIdAndUpdate
      ({ _id: noticeId },
        { isDeleted: true },
        { new: true }
      );
    if (!notice) throw new Error("Notice not found");
    res.status(200).json({ status: "success", notice });
  }
  catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  };
};

noticeController.getNoticeById = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const notice = await Notice.findById(noticeId);
    if (!notice) throw new Error("Notice not found");
    res.status(200).json({ status: "success", notice });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.message });
  };
};

module.exports = noticeController;