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

        articles = require('../libs/articles_admin.js')(filePath, testJsonName);
    });

    it('can add a new article', function(done) {
        fs.writeFileSync(testJson, '[]', 'utf8');
        articles.save({
            articleId: null,
            markDown: "This is some **markdown**",
            title: 'Test Post'
        }, function (err, articleId) {
            (err === null).should.equal(true);
            let content = fs.readFileSync(filePath + articleId + '.md', 'utf8');
            content.should.containEql('**markdown**');
            done();
        })
    });

    it('new article can be edited', function(done) {
        // Prepare the test
        fs.writeFileSync(testJson, '[{"date":"2015-11-22T08:15:54.984Z","title":"Test Post"}]', 'utf8');

        articles.save({
            articleId: 0,
            markDown: 'No, this is markdown',
            title: 'Article Title'
        }, function(err, articleId) {
            (err === null).should.equal(true);

            //Regular file exists
            let content = fs.readFileSync(filePath + '0.md', 'utf8');
            content.should.containEql('No, this is');
            done();
        });

    });

    it('article can be published', function(done) {
        //Prepare the test
        fs.writeFileSync(testJson, '[]', 'utf8');

        articles.saveAndPublish({
            articleId: null,
            markDown: "This is some **markdown**",
            title: 'Test Post'
        }, function (err, articleId) {
            (err === null).should.equal(true);
            let content = fs.readFileSync(filePath + articleId + '.md', 'utf8');
            content.should.containEql('**markdown**');

             // publish file exists
            let publishContent = fs.readFileSync(filePath + '0_publish.md', 'utf8');
            publishContent.should.containEql('**markdown**');
            done();

        })
    });

    it('published article can be updated, with changes not appearing on published article', function(done) {
        // Set-up test
        fs.writeFileSync(testJson, '[{"date":"2015-11-22T08:15:54.984Z","title":"Test Post","Published": true}]', 'utf8');
        fs.writeFileSync(filePath + '0.md', 'This is some **markdown**');
        fs.writeFileSync(filePath + '0_publish.md', 'This is some **markdown**');


        articles.save({
            articleId: 0,
            markDown: 'No, this is markdown',
            title: 'Article Title'
        }, function(err, articleId) {
            (err === null).should.equal(true);

            //Regular file exists
            let content = fs.readFileSync(filePath + '0.md', 'utf8');
            content.should.containEql('No, this is');

            let publishContent = fs.readFileSync(filePath + '0_publish.md', 'utf8');
            publishContent.should.containEql('**markdown**');

            done();
        });
    });

    it('articles can be deleted - all files', function(done) {
        // Set-up test
        fs.writeFileSync(testJson, '[{"date":"2015-11-22T08:15:54.984Z","title":"Test Post","Published": true}]', 'utf8');
        fs.writeFileSync(filePath + '0.md', 'This is some **markdown**');
        fs.writeFileSync(filePath + '0_publish.md', 'This is some **markdown**');

        articles.delete(0, function(err) {
            (err === null).should.equal(true);
            try {
                fs.lstatSync(filePath + '0.md');
            } catch (err) {
                err.message.should.containEql('no such file');
            }
            try {
                fs.lstatSync(filePath + '0_publish.md');
            } catch (err) {
                err.message.should.containEql('no such file');
            }
            done();
        });
    });

    it('articles can be deleted - no published files', function(done) {
        // Set-up test
        fs.writeFileSync(testJson, '[{"date":"2015-11-22T08:15:54.984Z","title":"Test Post","Published": true}]', 'utf8');
        fs.writeFileSync(filePath + '0.md', 'This is some **markdown**');

        articles.delete(0, function(err) {
            (err === null).should.equal(true);
            try {
                fs.lstatSync(filePath + '0_publish.md');
            } catch (err) {
                err.message.should.containEql('no such file');
            }
            done();
        });
    });

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