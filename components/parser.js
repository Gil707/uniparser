const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const settings = require('../config/settings');
const rule = require('../rules/' + process.argv[2] + '.json');

const config = {...settings, ...rule};

async function getContent() {

    const browser = await puppeteer.launch({
        timeout: config.puppeteer_timeout,
        args: config.args
    });

    const page = await browser.newPage();
    await browser.userAgent(config.userAgent);
    await page.setViewport({width: config.scr.width, height: config.scr.height});
    await page.goto(config.baseUrl).catch((e) => console.log('Puppeteeer goto Error ', e.stack));
    await page.waitFor(config.sleep_after_load);

    let content = await page.evaluate(() => document.body.innerHTML);

    let $ = await cheerio.load(content, { decodeEntities: config.decodeEntities });

    await browser.close();

    return $.html();

}

module.exports = {
    getContent
};
