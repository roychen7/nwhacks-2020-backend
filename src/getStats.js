const _vision = require('./visionApi.js');
const _nlp = require('./nlpApi.js');
const _snapshotter = require('./snapshotter.js');
const _videoApi = require('./videoApi.js');
const fs = require('fs');

let map = new Map([
    ['LIKELY', 3],
    ['POSSIBLE', 1],
    ['UNKNOWN', 0],
    ['UNLIKELY', 0],
    ['VERY_UNLIKELY', 0],
    ['VERY_LIKELY', 5],
    ['UNRECOGNIZED', 0]
]);

const getStats = exports.getStats = async function getStats(filename) {
    console.log('Stats are being generated...');
    console.time('run');

    await _snapshotter.snapshotter(filename);

    let functionList = [];

    const files = fs.readdirSync('./output/');
    files.forEach(file => {
        functionList.push(callSnap(file));
    })

    let faceMoods = await Promise.all(functionList).then((result) => {
        return result;
    });

    const retVal = await _videoApi.videoApi('call-me-maybe.mp4');
    const transcript = retVal.transcript;
    const listOfWords = retVal.listOfWords;

    let barData = new Map();
    listOfWords.forEach(word => {
        if (!barData.has(word)) {
            barData.set(word.word, 1)
        } else {
            let curr = barData.get(word.word);
            barData.set(word.word, curr + 1);
        }
    });

    // barData.set('So', barData.get('So') + 3);
    // barData.set('call', barData.get('call') + 2);
    // barData.set('me', barData.get('me') + 5);
    // console.log(barData);

    let sentences = transcript.split(". ");

    let firstWordTimes = []

    sentences.forEach(sentence => {
        let words = sentence.split(" ");
        listOfWords.forEach(w => {
            if (w.word === words[0]) {
                firstWordTimes.push({
                    timestamp: w.start_time,
                    sentence: sentence
                })
            }
        })
    });

    let sentenceCall = [];
    firstWordTimes.forEach((firstWord) => {
        sentenceCall.push(callWithSentence(firstWord.sentence, firstWord.timestamp));
    });

    let callNlp = await Promise.all(sentenceCall).then((nlpResult) => {
        return nlpResult;
    });

    // console.log(callNlp);

    let sumFaceMood = {
        joy: 0,
        anger: 0,
        sorrow: 0,
        surprise: 0
    }

    faceMoods.forEach((faceMood) => {
        sumFaceMood.joy += map.get((faceMood[0].joy) ? faceMood[0].joy : 0);
        sumFaceMood.anger += map.get((faceMood[0].anger) ? faceMood[0].anger : 0);
        sumFaceMood.sorrow += map.get((faceMood[0].sorrow) ? faceMood[0].sorrow : 0);
        sumFaceMood.surprise += map.get((faceMood[0].surprise) ? faceMood[0].surprise : 0);
    });

    // console.log(faceMoods);

    console.log('Generating stats complete');
    console.timeEnd('run');

    return {
        sumFaceMood: sumFaceMood,
        timestamps: callNlp,
        barData: sortTop5(barData)
    }
}

function callSnap(filename) {
    return _vision.visionApi(filename);
}

function callWithSentence(sentence, timestamp) {
    return _nlp.nlpApi(sentence, timestamp);
}

function sortTop5(barData) {
    let result = [];
    barData[Symbol.iterator] = function* () {
        yield*[...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    for (let [key, value] of barData) { // get data sorted
        result.push({
            word: key,
            value: value
        });
        // console.log(key + ' ' + value);
    }
    // console.log(result);
    return result.slice(result.length - 5);
}