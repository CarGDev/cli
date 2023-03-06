const weblog = require('webpack-log');
const logger = weblog({
    level: 'info',
    name: 'ist',
    timestamp: true,
});
module.exports = function (cmd) {
    const { port = 3000 } = cmd;
    const webpack = require('webpack');
    const middleware = require('webpack-dev-middleware');
    const config = require('./webpack-config');
    const express = require('express');
    const app = express();

    const webpackConfig = config({
        outputLibraryTarget: 'var',
        devtool: 'cheap-module-source-map',
    });

    const compiler = webpack(webpackConfig);

    app.use(
        middleware(compiler, {
            // webpack-dev-middleware options
            noInfo: true,
            publicPath: webpackConfig.output.publicPath,
            overlay: true,
        })
    );
    app.use(require('webpack-hot-middleware')(compiler));

    app.listen(port, () => logger.info('Please wait while app is building'));

    compiler.hooks.done.tapAsync('ist-done', (stats, cb) =>
        process.nextTick(() => {
            stats = stats.toJson();

            if (stats.errors && stats.errors.length > 0) {
                logger.warn(`http://localhost:${port} has some errors`);
                return;
            }
            logger.info(`http://localhost:${port} is ready`);
            cb();
        })
    );
};
