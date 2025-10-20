const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    cloudinary_public_id: { type: String },
    fileType: { type: String }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('File', FileSchema);

