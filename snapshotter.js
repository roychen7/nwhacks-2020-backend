const snapshotter = exports.snapshotter = async function snapshotter() {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffprobePath = require('@ffprobe-installer/ffprobe').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);

    // var proc = new ffmpeg('/nwHacks/nwhacks2020-backend/resource/garyVideo.mp4')
    // console.log()
    // .takeScreenshots({
    //     count: 4
    //   }, '/nwHacks/nwhacks2020-backend/output', function(err) {
    //   console.log('screenshots were saved')
    // });

    ffmpeg('/nwHacks/nwhacks2020-backend/resource/garyVideo.mp4')
    .screenshots({
        count: 4,
        filename: 'thumbnail-at-%s-seconds.png',
        folder: '/nwHacks/nwhacks2020-backend/output',
    });
}
