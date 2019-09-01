var redis = require ('redis');

var client = redis.createClient({
    host:'localhost',
    post:6379
});

client.on('error', function(err){
    console.log(err);
});

//old school way.
// client.set('name', 'huseyin', (err, data) => {
//
// });

const { promisify } = require ('util');

//now we are going to promisify redis method!
//but they now return promisify then and catch method!
exports.get = promisify(client.get).bind(client);
exports.setex = promisify(client.setex).bind(client);
exports.del = promisify(client.del).bind(client);
