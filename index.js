const express = require('express');
const app = express();
const port = 3000;

const _vision = require('./visionApi.js');
const _nlp = require('./nlpApi.js');
const _snapshotter = require('./snapshotter.js')
const _videoApi = require('./videoApi.js')

app.get('/visionApi', async (req, res) => {
    await _vision.visionApi();
});

app.get('/nlpApi', async (req, res) => {
    await _nlp.nlpApi();
});

app.get('/snapshotter', async (req, res) => {
    await _snapshotter.snapshotter();
});

app.get('/videoApi', async (req, res) => {
    await _videoApi.videoApi();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));