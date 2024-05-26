const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noticeSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
  }, { timestamps: true }
);


const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
