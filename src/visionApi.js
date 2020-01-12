// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

const visionApi = exports.visionApi = async function visionApi(filename) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  const fileName = './output/' + filename;

  const [result] = await client.faceDetection(fileName);
  const faces = result.faceAnnotations;
  console.log('Faces:');
  let returnList = [];
  faces.forEach((face, i) => {
    console.log(`  Face #${i + 1}:`);
    console.log(`    Joy: ${face.joyLikelihood}`);
    console.log(`    Anger: ${face.angerLikelihood}`);
    console.log(`    Sorrow: ${face.sorrowLikelihood}`);
    console.log(`    Surprise: ${face.surpriseLikelihood}`);

    returnList.push({
      face: i + 1,
      joy: face.joyLikelihood,
      anger: face.angerLikelihood,
      sorrow: face.sorrowLikelihood,
      surprise: face.surpriseLikelihood
    });
  });

  return returnList;
}