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
}

module.exports = Parser;
