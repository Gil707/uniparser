const fs = require('fs');
const Parser = require('@components/parser');

module.exports = function (fastify, opts, next) {

    fastify.get('/', async (req, reply) => {

        if (fs.existsSync('./rules/' + process.argv[2] + '.json')) {
            let parser = await Parser.build();
            await parser.goto('http://google.com');
            let content = await parser.getContentsOf('.content');

            reply.send({content: content});

        } else reply.send({error: 'No rule detected.'});

    });

    next()
};
