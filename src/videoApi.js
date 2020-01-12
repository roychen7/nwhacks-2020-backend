// Imports the Google Cloud Video Intelligence library
const videoIntelligence = require('@google-cloud/video-intelligence');

const videoApi = exports.videoApi = async function videoApi(filename){
    // Creates a client
    const client = new videoIntelligence.VideoIntelligenceServiceClient();

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    const gcsUri = 'gs://video-bucket-nwhacks2020/' + filename;

    const videoContext = {
        speechTranscriptionConfig: {
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
        },
    };

    const request = {
        inputUri: gcsUri,
        features: ['SPEECH_TRANSCRIPTION'],
        videoContext: videoContext,
    };

    let listOfWords = [];

    const [operation] = await client.annotateVideo(request);
    console.log('Waiting for operation to complete...');
    const [operationResult] = await operation.promise();
    console.log('Word level information:');
    const alternative =
        operationResult.annotationResults[0].speechTranscriptions[0]
            .alternatives[0];
    alternative.words.forEach(wordInfo => {
        const start_time =
            wordInfo.startTime.seconds + wordInfo.startTime.nanos * 1e-9;
        const end_time = wordInfo.endTime.seconds + wordInfo.endTime.nanos * 1e-9;
        console.log('\t' + start_time + 's - ' + end_time + 's: ' + wordInfo.word);

        const result = {
            word: wordInfo.word,
            start_time: start_time,
            end_time: end_time
        }

        listOfWords.push(result);
    });
    console.log('Transcription: ' + alternative.transcript);

    return {
        transcript: alternative.transcript,
        listOfWords: listOfWords
    }
}
