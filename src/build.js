const { npxSync } = require('node-npx');
const path = require('path');

module.exports = function (cmd) {
    const cwd = process.cwd();
    const pkg = require(path.join(cwd, '/package.json'));

    npxSync(
        'babel',
        [
            `src`,
            // Commenting this out because --loose is no longer a babel command.
            // Leaving this comment in because the --loose flag needs to be
            // enabled elsewhere
            // '--loose',
            `--config-file`,
            './.babelrc',
            `--out-dir`,
            'dist',
            '--copy-files',
        ],
        {
            cwd,
            stdio: 'inherit',
        }
    );

    if (cmd.umd) {
        npxSync(
            'ist',
            [
                'umd',
                `--input`,
                './src/index.js',
                '--output',
                path.join(cwd, '/dist/'),
                `--name`,
                pkg.name,
                '--filename',
                'umd.js',
            ],
            {
                cwd,
                stdio: 'inherit',
            }
        );
    }
};
