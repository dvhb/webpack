'use strict';

const path = require('path');
const version = require('../../../package.json').version;

module.exports = function () {
    const done = this.async();
    const command = this.spawnCommand('bash', [
        '-c',
        'echo -n "$(npm config get init-author-name)"'
    ], {stdio: 'pipe'});
    let name = '';

    command.stdout.on('data', data => name += data);
    command.on('close', () => {
        const questions = [
            {
                name: 'appTitle',
                message: 'What is the title of your app?',
                default: 'Awesome project',
                store: true
            },
            {
                name: 'packageName',
                message: 'What is the name of your package (i.e. npm package name)?',
                default: path.basename(process.cwd()).replace(/\s/g, '-'),
                store: true
            },
            {
                name: 'author',
                message: 'Who is the author of this app',
                default: 'hello@dvhb.ru',
                store: true
            },
            {
                name: 'description',
                message: 'Description',
                default: 'This is awesome dvhb project!',
                store: true
            },
        ];

        this
            .prompt(questions)
            .then(answers => {
                this.data = answers;
                this.data.version = version;
                done();
            });
    });
};
