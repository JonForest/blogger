'use strict';

const fs = require('fs');
const async = require('async');

module.exports = function (fileLoc, articlesJsonLocLoc) {
    const articlesJsonLoc = fileLoc + articlesJsonLocLoc;


    function save(article, callback) {

        async.parallel([
            function(done) {
                updateJsonSave(article, done);
            },
            function(done) {
                fs.writeFile(fileLoc + article.articleId + '.md', article.markDown, done);
            }],
            function(err) {
                callback(err, article.articleId);
            }
        );
    }

    function saveAndPublish(article, callback) {
        async.parallel([
            function(done) {
                updateJsonPublish(article, done);
            },
            function(done) {
                fs.writeFile(fileLoc + article.articleId + '.md', article.markDown, done);
            },
            function(done) {
                // Write to publish file
                fs.writeFile(fileLoc + article.articleId + '_publish.md', article.markDown, done);
            }],
            function(err) {
                callback(err, article.articleId);
            }
        );
    }

    function deleteArticle(articleId, callback) {
        async.series([
            function(done) {
                deleteJson(articleId, done);
            },
            function(done) {
                //Delete file
                fs.unlink(fileLoc + articleId + '.md', done);
            },
            function(done) {
                //Delete publish file if exists
                fs.unlink(fileLoc + articleId + '_publish.md', done);
            }
        ], function(err) {
            // We don't care about errors that mean the file doesn't exist, as the publish file may not
            if (err && err.errno === -2 && err.message.indexOf('no such file or directory') !== -1) {
               err = null;
            }
            callback(err);
        })

    }


    function updateJsonSave(article, done) {
        updateJson(article, {title: article.title}, done);
    }

    function updateJsonPublish(article, done) {
       updateJson(article, {title: article.title, published: true}, done);
    }

    function updateJson(article, saveObject, done) {
        let articlesInfo;

        async.series([
            function(next) {
                //Load the json file
                try {
                    articlesInfo = JSON.parse(fs.readFileSync(articlesJsonLoc, 'utf8'));
                } catch (e) {
                    console.log('error', e);
                }

                //Does it exist?
                if (article.articleId == null || !articlesInfo[article.articleId]) {
                    //Add
                    const today = new Date();
                    articlesInfo.push(Object.assign({date:today}, saveObject));
                    article.articleId = articlesInfo.length - 1;
                } else {
                    articlesInfo[article.articleId] =
                        Object.assign({}, articlesInfo[article.articleId], saveObject);
                }
                next();
            },
            function(next) {
                //Delete the existing json file
                fs.unlink(articlesJsonLoc, next);
            },
            function(next) {
                //write the json file with new information
                fs.writeFile(articlesJsonLoc, JSON.stringify(articlesInfo), next)
            }],
            function(err) {
               done(err, article.articleId);
            }
        )
    }


    function deleteJson(articleId, done) {
        let articlesInfo;

        //TODO: Some duplication in here that I don't like
        async.series([
            function(next) {
                //Load the json file
                try {
                    articlesInfo = JSON.parse(fs.readFileSync(articlesJsonLoc, 'utf8'));
                } catch (e) {
                    console.log('error', e);
                }

                //Does it exist?
                if (articleId == null || !articlesInfo[articleId]) {
                    done();
                } else {
                    delete articlesInfo[articleId];
                }
                next();
            },
            function(next) {
                //Delete the existing json file
                fs.unlink(articlesJsonLoc, function() {
                    next(null);
                });
            },
            function(next) {
                //write the json file with new information
                fs.writeFile(articlesJsonLoc, JSON.stringify(articlesInfo), next)
            }],
            function(err) {
                done(err, articleId);
            }
        )
    }

    return {
        save: save,
        saveAndPublish: saveAndPublish,
        "delete": deleteArticle //delete is a js keyword
    }

};


