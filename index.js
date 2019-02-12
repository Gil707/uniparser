const Parser = require('./components/parser');
const fs = require('fs');

(async () => {

    if (fs.existsSync('./rules/' + process.argv[2] + '.json')) {
        let parser = await Parser.build();
        await parser.goto('http://google.com');
        let content = await parser.getContentsOf('.content');

        console.log(content);
        return await parser.close();
    } else console.log('No rule detected.')

})();
