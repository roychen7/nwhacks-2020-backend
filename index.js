const express = require('express');
const app = express();
const port = 3000;

const _vision = require('./src/visionApi.js');
const _nlp = require('./src/nlpApi.js');
const _snapshotter = require('./src/snapshotter.js');
const _videoApi = require('./src/videoApi.js');
const _bucketUpload = require('./src/bucketUploadGCS.js');

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
    try {
        const result = await _nlp.nlpApi('I do not ever want to see your stupid fucking face again you fucking piece of shit!');
        return res.status(200).send(result);
    } catch (error) {
        return res.send(error);
    }
});

app.get('/snapshotter', async (req, res) => {
    try {
        const result = await _snapshotter.snapshotter('garyVideo.mp4');
        return res.status(200).send(result);
    } catch (error) {
        return res.send(error);
    }
});

app.get('/videoApi', async (req, res) => {
    try {
        await _bucketUpload.uploadObject('call-me-maybe.mp4').then(async () => {
            const result = await _videoApi.videoApi('call-me-maybe.mp4');
            return res.status(200).send(result);
        }).catch((error) => {
            throw error;
        });
    } catch (error) {
        return res.send(error);
    }

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));