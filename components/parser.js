const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const settings = require('../config/settings');
const helpers = require('./helpers');
const rule = require('../rules/' + process.argv[2] + '.json');
const config = {...settings, ...rule};

class Parser {

    static async build() {

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        await browser.userAgent(config.userAgent);

        const page = await browser.newPage();
        await page.setViewport({width: config.scr.width, height: config.scr.height});

        if (config.disableImgs) {

            await page.setRequestInterception(true);

            page.on('request', req => {
                if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font')
                    req.abort();
                else
                    req.continue();
            });
        }

        const parser = new Parser(page);

        return new Proxy(parser, {
            get: function (target, property) {
                return parser[property] || browser[property] || page[property];
            }
        });
    }

    constructor(page) {
        this.page = page;
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    async getBody() {
        return this.page.evaluate(() => document.body.innerHTML);
    }

    async writeToDB(type) {
        console.log(type);
    }

    // async getContent() {
    //
    //     let pagesFlowArray = helpers.splitArray(config.parsePages, config.pages_per_call);
    //
    //     await helpers.asyncForEach(pagesFlowArray, async (pages) => {
    //
    //         const pagesFlow = [];
    //
    //         for(let i = 0; i < pages.length; i++) {
    //
    //             pagesFlow.push(browser.newPage().then(async page => {
    //
    //                 if (config.disableImgs) {
    //
    //                     await page.setRequestInterception(true);
    //
    //                     page.on('request', req => {
    //                         if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font')
    //                             req.abort();
    //                         else
    //                             req.continue();
    //                     });
    //                 }
    //
    //                 await page.setViewport({width: config.scr.width, height: config.scr.height});
    //                 await page.goto(config.baseUrl + pages[i]);
    //
    //                 if (config.prtScr && config.disableImgs === false) {
    //                     await page.screenshot({path: './images/result' + i + '.png'})
    //                 }
    //
    //                 let content = await page.evaluate((tags) => {
    //
    //                     function getData(tag) {
    //                         switch (tag.type) {
    //                             case 'img': {
    //                                 return document.querySelector(tag.selector).src;
    //                             }
    //                             case 'text':
    //                             default: {
    //                                 return document.querySelector(tag.selector).innerText;
    //                             }
    //                         }
    //                     }
    //
    //                     let obj = {};
    //
    //                     tags.forEach((v) => {
    //                         obj[v.name] = getData(v)
    //                     });
    //
    //                     return obj
    //
    //                 }, tags);
    //
    //                 console.log(content);
    //
    //             }))
    //         }
    //
    //         await Promise.all(pagesFlow);
    //
    //     });
    //
    //     return await browser.close();
    // }
}

module.exports = Parser;
