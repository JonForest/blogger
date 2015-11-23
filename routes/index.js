/* global require, module */
'use strict';

const articles = require('../libs/articles_display');
var express = require('express');
const router = express.Router();

/** GET List of articles. */
router.get('/', displayList);
router.get('/tag/:tag', displayList);
function displayList(req, res) {
    let tag = req.params.tag;
    articles.getArticlesArray(tag, function(articles) {
        res.render('index', {
            articles: articles,
            tag: tag
        });
    });
}

/** Display an article **/
router.get('/article/:slug', function(req, res) {
    articles.getArticle(req.params.slug, function(article) {
        res.render('article', {article: article});
    });
});

module.exports = router;
