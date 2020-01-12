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

    console.log(faceMoods);

    const retVal = await _videoApi.videoApi('call-me-maybe.mp4');
    const transcript = retVal.transcript;
    const listOfWords = retVal.listOfWords;

    let barData = new Map();
    listOfWords.forEach(word => {
        if (!barData.has(word)){
            barData.set(word, 1)
        } else {
            let curr = barData.get(word);
            barData.set(word, curr + 1);
        }
    })

    let sentences = transcript.split(". ");

    let firstWordTimes = []

    sentences.forEach(sentence => {
        let words = sentence.split(" ");
        console.log(words);
        listOfWords.forEach(w => {
            if (w.word === words[0]) {
                firstWordTimes.push(
                    {
                        timestamp: w.start_time,
                        sentence: sentence
                    }
                )
            }
        })
    });

    console.log(firstWordTimes);

    let sentenceCall = [];
    firstWordTimes.forEach((firstWord) => {
        sentenceCall.push(callWithSentence(firstWord.sentence, firstWord.timestamp));
    });

    let callNlp = await Promise.all(sentenceCall).then((nlpResult) => {
        return nlpResult;
    });

    console.log(callNlp);

    let sumFaceMood = {
        joy: 0,
        anger: 0,
        sorrow: 0,
        surprise: 0
    }

    console.log(faceMoods);
    console.log(faceMoods[0][0].joy)
    console.log(faceMoods[0][0].anger)
    console.log(faceMoods[0][0].sorrow)
    console.log(faceMoods[0][0].surprise)

    faceMoods.forEach((faceMood) => {
        sumFaceMood.joy += map.get((faceMood[0].joy) ? faceMood[0].joy : 0);
        sumFaceMood.anger += map.get((faceMood[0].anger) ? faceMood[0].anger : 0);
        sumFaceMood.sorrow += map.get((faceMood[0].sorrow) ? faceMood[0].sorrow : 0);
        sumFaceMood.surprise += map.get((faceMood[0].surprise) ? faceMood[0].surprise : 0);
    });


    console.log('Generating stats complete');
    console.timeEnd('run');

    return {
        sumFaceMood: sumFaceMood,
        timestamps: callNlp,
        barData: barData
    }
}

function callSnap(filename) {
    return _vision.visionApi(filename);
}

function callWithSentence(sentence, timestamp) {
    return _nlp.nlpApi(sentence, timestamp);
}


