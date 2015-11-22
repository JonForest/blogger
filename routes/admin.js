const express = require('express');
const router = express.Router();
const articleJson = require('../articles/articleJson.json');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('admin/enter_markdown', {
        blogId: 1
    });
});

module.exports = router;
