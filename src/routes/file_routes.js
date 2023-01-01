const router = require('express').Router();
const upload = require('./../middlewares/file_upload');
router.post("/single", upload.single('image'), async function (req, res) {
    const uploadedFile = req.file;

    if (!uploadedFile) {
        res.json({ success: false, error: "file-not-uploaded" });
        return;
    }

    res.json({ success: true, url : "http://localhost:5000/" + uploadedFile.filename , data: uploadedFile});
});

router.post("/multiple", upload.array('images' , 10), async function (req, res) {
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0 ) {
        res.json({ success: false, error: "files-not-uploaded" });
        return;
    }

    var downloads = [];
    uploadedFiles.forEach(function (uploadedFile) {
        const downloadUrl = "http://localhost:5000/" + uploadedFile.filename;
        downloads.push(downloadUrl);
    });

    res.json({success: true , data : downloads});

});

module.exports = router;