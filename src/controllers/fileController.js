const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const File = require('../models/File');
const AiInsight = require('../models/AiInsight');
const { analyzeFileWithGemini } = require('../utils/geminiClient');
const streamifier = require('streamifier');

// configure multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('file');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    console.log('📤 Uploading file to Cloudinary...');

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: `healthmate/${req.user._id}` },
      async (error, result) => {
        if (error) {
          console.error('❌ Cloudinary error:', error);
          return res.status(500).json({ message: 'Cloudinary upload error', error });
        }

        console.log('✅ Cloudinary upload complete:', result.secure_url);

        // save file record
        const newFile = await File.create({
          user: req.user._id,
          originalName: req.file.originalname,
          url: result.secure_url,
          cloudinary_public_id: result.public_id,
          fileType: req.file.mimetype,
        });

        // analyze with Gemini
        let aiResult = null;
        try {
          console.log('🤖 Sending file to Gemini:', result.secure_url);
          aiResult = await analyzeFileWithGemini(result.secure_url);
          console.log('✅ Gemini analysis success:', aiResult);

          await AiInsight.create({
            file: newFile._id,
            user: req.user._id,
            summary: aiResult.summary || 'No summary',
            romanUrduSummary: aiResult.romanUrduSummary || 'No Roman Urdu summary',
            questionsForDoctor: aiResult.questions || [],
          });
        } catch (err) {
          console.warn('⚠️ Gemini analysis failed:', err.message || err);
        }

        res.status(200).json({
          message: 'File uploaded successfully',
          file: newFile,
          ai: aiResult,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error('UploadFile error:', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ FIX: include Gemini insight when fetching a file
exports.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const aiInsight = await AiInsight.findOne({ file: file._id });

    res.json({
      file,
      ai: aiInsight || null,
    });
  } catch (err) {
    console.error('GetFile error:', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Fetch all user files WITH AI status
exports.listFiles = async (req, res) => {
  try {
    // Get all user files
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Attach AI analysis info
    const filesWithAI = await Promise.all(
      files.map(async (file) => {
        const ai = await AiInsight.findOne({ file: file._id });
        return {
          ...file.toObject(),
          aiAnalyzed: !!ai, // ✅ Add boolean field
        };
      })
    );

    res.json(filesWithAI);
  } catch (err) {
    console.error('ListFiles error:', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
};

