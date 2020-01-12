const snapshotter = exports.snapshotter = async function snapshotter() {
    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffprobePath = require('@ffprobe-installer/ffprobe').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);

    ffmpeg('/nwHacks/nwhacks2020-backend/resource/garyVideo.mp4')
    .screenshots({
        count: 10,
        filename: 'thumbnail-at-%s-seconds.png',
        folder: '/nwHacks/nwhacks2020-backend/output',
    });
}
