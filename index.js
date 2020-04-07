const express = require('express');

const dbRouter = require('./data/router.js');

const server = express();

server.use(express.json());

server.use("/api/posts", dbRouter);

server.get('/', (req, res) => {
    res.send(
        `<p>Up and Running</p>`
    )
})

server.listen(4000, () => {
    console.log('server running on http://localhost:4000')
})