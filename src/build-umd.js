module.exports = function (cmd) {
    const webpack = require('webpack');
    const config = require('./webpack-config');
    const chalk = require('chalk');
    const path = require('path');

    const {
        input = path.join(process.cwd(), '/src/index.js'),
        output = path.join(process.cwd(), '/dist'),
        name,
        filename,
    } = cmd;

    console.log(chalk.yellow('⌛ Please wait'));

    webpack(
        config({
            devtool: 'cheap-source-map',
            environment: process.env.NODE_ENV,
            entry: input,
            outputPath: path.resolve(process.cwd(), output),
            outputFilename: filename,
            libraryName: typeof name === 'string' ? name : undefined,
        }),
        (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log(chalk.red('Errors'), err, stats);
                return ;
            }
            console.log(chalk.green('✔ Compiled'));
        }
    );
};
