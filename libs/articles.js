'use strict';

const fs = require('fs');
const async = require('async');

module.exports = function (fileLoc, articlesJsonLocLoc) {
    const articlesJsonLoc = fileLoc + articlesJsonLocLoc;


    function save(article, callback) {
        let articlesInfo;

        async.series([
            function(done) {
                //Load the json file
                try {
                    articlesInfo = JSON.parse(fs.readFileSync(articlesJsonLoc, 'utf8'));
                } catch (e) {
                    console.log('error', e);
                }

                //Does it exist?
                if (!article.articleId || !articlesInfo[article.articleId]) {
                    //Add
                    const today = new Date();
                    articlesInfo.push({
                        date: today,
                        title: article.title
                    });
                    article.articleId = articlesInfo.length - 1;
                } else {
                    articlesInfo[article.articleId] = article.title;
                }
                done();
            },
            function(done) {
                //Delete the existing json file
                fs.unlink(articlesJsonLoc, done);
            },
            function(done) {
                //write the json file with new information
                console.log(articlesInfo);
                fs.writeFile(articlesJsonLoc, JSON.stringify(articlesInfo), done)
            },
            function(done) {
                fs.writeFile(fileLoc + article.articleId + '.md', article.markDown, done);
            }],
            function(err) {
                callback(err, article.articleId);
            }
        );
    }

    function saveAndPublish(articleId, markdown, callback) {
        //Write to file
        async.parallel([
            function(done) {
                // Write to regular file
                fs.writeFile(fileLoc + articleId + '.md', markdown, done);
            },
            function(done) {
                // Write to publish file
                fs.writeFile(fileLoc + articleId + '_publish.md', markdown, done);
            }
        ], function(err) {
            callback(err, articleId);
        });
    }

    function deleteArticle(articleId, callback) {
        async([
            function(done) {
                //Delete file
                fs.deleteFile(fileLoc + articleId + '.md', done);
            },
            function(done) {
                //Delete publish file if exists
                fs.deleteFile(fileLoc + articleId + '.md', done);
            }
        ], callback)

    }


    return {
        save: save,
        saveAndPublish: saveAndPublish,
        "delete": deleteArticle //delete is a js keyword
    }

};


