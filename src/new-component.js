const copy = require('copy-template-dir');
const path = require('path');
const s = require('string');
const pkg = require('../package.json');
const fs = require('fs');
const chalk = require('chalk');
const { npxSync } = require('node-npx');
const commandExistsSync = require('command-exists').sync;

module.exports = function (name, cmd) {
    const str = s(name);
    const component = str.s;
    const componentCamel = str.camelize().s;
    const componentDashed = str.slugify().s;
    const componentHuman = str.humanize().s;
    const { desc } = cmd;
    const { version } = pkg;
    const cwd = path.resolve(process.cwd(), componentDashed);

    if (fs.existsSync(cwd)) {
        console.error(
            `Folder ${componentDashed} already exists. Try another name?`
        );
        process.exit(1);
    }

    const vars = {
        version,
        description: desc,
        component,
        componentCamel,
        componentDashed,
        componentHuman,
    };

    const inDir = path.resolve(__dirname, 'templates/component');

    copy(inDir, cwd, vars, (err, createdFiles) => {
        if (err) throw err;
        createdFiles.forEach((filePath) =>
            console.log(
                `${chalk.keyword('green').bold('✔')} Created ${filePath}`
            )
        );

        console.log(chalk.yellow('Installing dependencies...'));

        try {
            commandExistsSync('yarn')
                ? npxSync('yarn', [], { cwd, stdio: 'inherit' })
                : npxSync('npm', ['install'], { cwd, stdio: 'inherit' });
        } catch (e) {
            // console.log(e);
            console.log(
                chalk.red(
                    'Sorry. Unable install dependencies... Maybe install them manually?'
                )
            );
        }

        console.log(chalk.green('✔ Done'));
    });
};
