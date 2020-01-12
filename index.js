const express = require('express');
const app = express();
const port = 3000;

const _vision = require('./src/visionApi.js');
const _nlp = require('./src/nlpApi.js');
const _snapshotter = require('./src/snapshotter.js')
const _videoApi = require('./src/videoApi.js')

app.get('/visionApi', async (req, res) => {
    try {
        const result = await _vision.visionApi('kendricHappy.jpg');
        console.log(result);
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.send(error);
    }

});

app.get('/nlpApi', async (req, res) => {
    await _nlp.nlpApi();
});

app.get('/snapshotter', async (req, res) => {
    await _snapshotter.snapshotter('call-me-maybe.mp4');
});

app.get('/videoApi', async (req, res) => {
    await _videoApi.videoApi('call-me-maybe.mp4');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));