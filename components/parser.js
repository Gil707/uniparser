const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const settings = require('../config/settings');
const helpers = require('./helpers');
const rule = require('../rules/' + process.argv[2] + '.json');

const config = {...settings, ...rule};

async function getContent() {

    const allPages = config.parsePages;
    const tags = config.tags;
    let pagesFlowArray = helpers.splitArray(allPages, config.pages_per_call);

    const browser = await puppeteer.launch({
        timeout: config.puppeteer_timeout,
        args: config.args
    });

    await browser.userAgent(config.userAgent);

    await helpers.asyncForEach(pagesFlowArray, async (pages) => {

        const pagesFlow = [];

        for(let i = 0; i < pages.length; i++) {

            pagesFlow.push(browser.newPage().then(async page => {

                if (config.disableImgs) {

                    await page.setRequestInterception(true);

                    page.on('request', req => {
                        if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font')
                            req.abort();
                        else
                            req.continue();
                    });
                }

                await page.setViewport({width: config.scr.width, height: config.scr.height});
                await page.goto(config.baseUrl + pages[i]);

                if (config.prtScr && config.disableImgs === false) {
                    await page.screenshot({path: './images/result' + i + '.png'})
                }

                let content = await page.evaluate((tags) => {

                    function getData(tag) {
                        switch (tag.type) {
                            case 'img': {
                                return document.querySelector(tag.selector).src;
                            }
                            case 'text':
                            default: {
                                return document.querySelector(tag.selector).innerText;
                            }
                        }
                    }

                    let obj = {};

                    tags.forEach((v) => {
                        obj[v.name] = getData(v)
                    });

                    return obj

                }, tags);

                console.log(content);

            }))
        }

        await Promise.all(pagesFlow);

    });

    return await browser.close();
}

module.exports = {
    getContent
};
