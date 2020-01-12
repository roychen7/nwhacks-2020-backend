const express = require('express');
const app = express();
const port = 3000;

const _vision = require('./src/visionApi.js');
const _nlp = require('./src/nlpApi.js');
const _snapshotter = require('./src/snapshotter.js');
const _videoApi = require('./src/videoApi.js');
const _bucketUpload = require('./src/bucketUploadGCS.js');
const _getStats = require('./src/getStats.js');

app.use(express.json());

app.get('/visionApi', async (req, res) => {
    try {
        const filename = req.body.filename;
        if (filename) {
            const result = await _vision.visionApi(filename);
            return res.status(200).send(result);
        } else {
            throw 'No given filename';
        }
    } catch (error) {
        return res.send(error);
    }
});

app.get('/nlpApi', async (req, res) => {
    try {
        const text = req.body.text;
        console.log(text);
        if (text) {
            const result = await _nlp.nlpApi(text);
            return res.status(200).send(result);
        } else {
            throw 'No given text';
        }
    } catch (error) {
        return res.send(error);
    }
});

app.get('/snapshotter', async (req, res) => {
    try {
        const filename = req.body.filename;
        if (filename) {
            const result = await _snapshotter.snapshotter(filename);
            return res.status(200).send(result);
        } else {
            throw 'No given filname';
        }
    } catch (error) {
        return res.send(error);
    }
});

app.get('/videoApi', async (req, res) => {
    try {
        const filename = req.body.filename;
        if (filename) {
            await _bucketUpload.uploadObject(filename).then(async () => {
                const result = await _videoApi.videoApi(filename);
                return res.status(200).send(result);
            }).catch((error) => {
                throw error;
            });
        } else {
            throw 'No given filename';
        }
    } catch (error) {
        return res.send(error);
    }
});

app.get('/getStats', async (req, res) => {
    try {
        const filename = req.body.filename;
        if (filename) {
            const result = await _getStats.getStats(filename);
            return res.send(result);
        } else {
            throw 'No given filname';
        }
    } catch (error) {
        return res.send(error);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));