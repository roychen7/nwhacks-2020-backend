// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

const visionApi = exports.visionApi = async function visionApi() {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  const fileName = '/nwHacks/nwhacks2020-backend/resource/kendricHappy.jpg';
  // const fileName = 'gs://cloud-samples-data/vision/face/faces.jpeg';

  const [result] = await client.faceDetection(fileName);
  const faces = result.faceAnnotations;
  console.log('Faces:');
  faces.forEach((face, i) => {
    console.log(`  Face #${i + 1}:`);
    console.log(`    Joy: ${face.joyLikelihood}`);
    console.log(`    Anger: ${face.angerLikelihood}`);
    console.log(`    Sorrow: ${face.sorrowLikelihood}`);
    console.log(`    Surprise: ${face.surpriseLikelihood}`);
  });
}

