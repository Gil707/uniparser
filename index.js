require('module-alias/register');
const mongoose = require('mongoose');
const config = require('@config/settings');

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('fastify-favicon'));
fastify.register(require('./api/v1/routes'), { prefix: '/api/v1' });

fastify.get('/', async (req, reply) => {
    await mongoose.connect(config.db.mongo.uri);
    reply.send({mongoose: mongoose.connection.readyState, state: 'dev'});
});

fastify.listen(3000);
