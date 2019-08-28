
module.exports = {
    database: 'mongodb://mongo:27017/nodeapp',
    options: {
        useNewUrlParser: true,
        reconnectTries: 30,
        reconnectInterval: 1000,
        poolSize: 10,
        bufferMaxEntries: 0
    }
}
