const { npxSync } = require('node-npx');

module.exports = function () {
    const cwd = process.cwd();

    npxSync(
        'build-storybook',
        ['-o', 'dist/storybook', '-c', `${__dirname}/../.storybook`],
        {
            cwd: cwd,
            stdio: 'inherit',
        }
    );
};
