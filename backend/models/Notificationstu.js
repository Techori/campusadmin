const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['alert', 'system', 'reminder'], default: 'alert' },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
module.exports = mongoose.model('Notification', NotificationSchema);