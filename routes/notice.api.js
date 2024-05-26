const express = require('express');
const authController = require('../controllers/auth.controller');
const noticeController = require('../controllers/notice.controller');
const router = express.Router();

router.post('/',
  authController.authenticate,
  authController.checkAdminPermission,
  noticeController.createNotice
);

router.get('/', noticeController.getNotices);

router.put('/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  noticeController.updateNotice
);

router.delete('/:id',
  authController.authenticate,
  authController.checkAdminPermission,
  noticeController.deleteNotice
);

router.get('/:id',
  noticeController.getNoticeById
);

module.exports = router;