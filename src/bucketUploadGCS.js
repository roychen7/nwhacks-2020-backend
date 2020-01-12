/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Name of a bucket, e.g. my-bucket';
// const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

// Creates a client

const uploadObject = exports.uploadObject = async function uploadObject(filename) {
  console.log('uploading file');
  return await uploadFile('./resource/' + filename);
}

const storage = new Storage();

async function uploadFile(filename) {
  // Uploads a local file to the bucket
  await storage.bucket('video-bucket-nwhacks2020').upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  }).then((result) => {
    console.log(`${filename} uploaded to video-bucket-nwhacks2020.`);
    return {
      bucketName: 'video-bucket-nwhacks2020',
      filename: filename
    };
  }).catch((error) => {
    console.log(error);
    return;
  });
}