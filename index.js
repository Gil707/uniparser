const Parser = require('./components/parser');
const fs = require('fs');

(async () => {
        let parser = await Parser.build();
        await parser.goto('http://google.com');
        let content = await parser.getContentsOf('.content');
        console.log(content);
})();
