/* global describe, it */
'use strict';
const fs = require('fs');
const should = require('should');

describe('Articles', function() {
    let articles;
    const testJsonName = 'articleJsonTest.json';
    const filePath ='./articlesTest/';
    const testJson = filePath + testJsonName;

    beforeEach(function() {

        fs.mkdirSync(filePath);

        articles = require('../libs/articles.js')(filePath, testJsonName);
    });

    it('can add a new article', function(done) {
        fs.writeFileSync(testJson, '[]', 'utf8');
        articles.save({
            articleId: null,
            markDown: "This is some **markdown**",
            title: 'Test Post'
        }, function (err, articleId) {
            console.log(err);
            (err === null).should.equal(true);
            try {
                let content = fs.readFileSync(filePath + articleId + '.md', 'utf8');
                content.should.containEql('**markdown**');
            } catch(e) {
                //FAIL
                console.log(e);
                (false).should.equal(true);
            }
            done();

        })
    });

    it('new article can be edited', function() {
        // Prepare the test
        fs.writeFileSync(testJson, '[{"date":"2015-11-22T08:15:54.984Z","title":"Test Post"}]', 'utf8');
        articles.update({
            articleId: 1,
            content: 'No, this is markdown',
            title: 'Article Title'
        })
    });

    it('saved article is immediately published');

    it('article can be published');

    it('published article can be updated, with changes not appearing on published article');

    it('changes to published article are only visible when "re-publish" is selected');


    it('articles can be deleted');


    afterEach(function() {
        //Tidy up the files in the test dir
        fs.unlinkSync(testJson);
        for(let x=0; x<2; x++) {
            try {
                fs.unlinkSync(filePath + x + '.md');
                fs.unlinkSync(filePath + x + '_publish.md');
            } catch (e) {
                //Do nothing
            }

        }
        fs.rmdirSync(filePath);
    });
});