# GParser
Universal parser with custom rules

## Installation

install
 - NodeJS 8+

Then run `npm i` *(from root folder)*

## Configuration

Rules stored in `json` format in `rules` folder and a global config in `config/settings.json`, they are merging before parser start.

**settings.json**

 - `userAgent`
 - `decodeEntities` - format HTML from tags to specialchars
 - `pages_per_call` - limit of pages pending in one promise step
 - `scr` (`width`, `height`) - screen resolution

**Rules** *(1.json, my.json, site3.json etc.)*

 - `baseUrl` - site root url
 - `parsePages` - array of urls to parse, without root url, starts with `/`
 - `disableImgs` - when `true` parser does not loading any images and styles
 - `prtScr` - create screenshots of page when `true`, works only when `disableImgs` is `false`
 - `tags` - list of tags for search on page, have fields `name`, `selector` and `type`, all fields are required

## Run

**Fill in the search rule information for the desired site by analogy with rule 1.json in the rules folder**

To start run `npm run start 1` from root, where `1` is rule file name.

Parser uses [puppeteer](https://github.com/GoogleChrome/puppeteer), if it doesn't start on *nix please read [troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md)
