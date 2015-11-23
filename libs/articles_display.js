'use strict';

const fs = require('fs');
const async = require('async');
const marked = require('marked');

module.exports = (function () {
    const path = './articles/';

    /**
     * Fetchs an array of article objects to draw a list of blog posts
     * @param {string} tag
     * @param {Function} done
     */
    function getArticlesArray(tag, done) {
        async.waterfall([
            //Read all files from the directory
            (next) => {
                fs.readdir(path, next);
            },

            //Process the files
            (files, next) => {
                let articles = [];
                async.each(files, (file, nextFile) => {
                    let date = file.substr(0, 10);
                    let slug = file.split('.')[0];
                    fs.readFile(path + '/' + file, 'utf8', (err, contents) => {
                        if (err) {
                            throw err;
                            return;
                        }

                        articles.push(
                            Object.assign({date:date, slug:slug}, processContents(contents))
                        );
                        nextFile();
                    });
                }, function(err) {
                    next(err, articles);
                });
            },

            // Filter on any provided tag
            (articles, next) => {
                //If there is a tag, filter
                if (tag) {
                    next(null, articles.filter(article => article.tags.indexOf(tag) !== -1 ));
                } else {
                    next(null, articles);
                }
            },

            // Sort the articles
            (articles, next) => {
                let sortedArticles = articles.sort(function(a, b) {
                    if (a.date === b.date) {
                        return 0;
                    }
                    if (a.date > b.date) {
                        return -1;
                    } else {
                        return 1;
                    }

                });
                next(null, sortedArticles);
            }],

            // Return the articles to the router
            (err, articles) => {
                done(articles);
            }
        )
    }

    /**
     * Get an individual article for display
     * @param {string} slug
     * @param {Function} done
     */
    function getArticle(slug, done) {
        fs.readFile(path + '/' + slug + '.md' , 'utf8', (err, contents) => {
            if (err) {
                throw err;
                return;
            }

            // Split the file on newline character
            const lines = contents.split('\n');

            // We now want just the markdown, which is the file minus the first four lines
            lines[0] = lines[1] = lines[2] = lines[3] = '';

            done(Object.assign(
                {contents: marked(lines.join('\n'))},
                processContents(contents)
            ));
        });
    }


    /**
     * Retrieves the title and tags from the file contents
     *
     * @private
     * @param {string} contents
     * @returns {{title: string, tags: [string]}}
     */
    function processContents(contents) {
        'use strict';

        let title,
            tags;

        // Split the file on newline character
        const lines = contents.split('\n');

        lines.some(function(line) {
            let chunks = line.split(':');
            switch (chunks[0]) {
                case 'title':
                    // Hey, we've found the title.  Trim off any whitespace and assign to our title var
                    let trimmedTitle = chunks[1].trim(); // Remove whitespace
                    title = trimmedTitle.trim().substr(1, trimmedTitle.length - 2); //Remove "
                    break;
                case 'tags':
                    //We've found our tags
                    tags = chunks[1].trim().split(' ');
                    break;
            }

            //Should we stop processing lines?
            return Boolean(title && tags)
        });

        return {
            title: title,
            tags: tags
        };

    }

    return {
        getArticlesArray: getArticlesArray,
        getArticle: getArticle
    }
}());

