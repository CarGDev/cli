const { npxSync } = require('node-npx');

module.exports = function () {
    const cwd = process.cwd();

    npxSync(
        'start-storybook',
        ['-p', 9001, '-c', `${__dirname}/../.storybook`],
        {
            cwd: cwd,
            stdio: 'inherit',
        }
    );
};
