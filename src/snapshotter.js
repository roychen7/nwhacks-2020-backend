const snapshotter = exports.snapshotter = async function snapshotter(filename) {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffprobePath = require('@ffprobe-installer/ffprobe').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);

    ffmpeg('./resource/' + filename)
    .screenshots({
        count: 10,
        filename: 'thumbnail-at-%s-seconds.png',
        folder: './output',
    });
}

const getLength = exports.getLength = function getLength() {
    return 10;
}


