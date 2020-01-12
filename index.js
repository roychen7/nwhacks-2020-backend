const express = require('express');
const app = express();
const port = 3000;

const _vision = require('./visionApi.js');
const _nlp = require('./nlpApi.js');

app.get('/visionApi', async (req, res) => {
    await _vision.visionApi();
});

app.get('/nlpApi', async (req, res) => {
    await _nlp.nlpApi();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));