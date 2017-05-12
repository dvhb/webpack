const fs = require('fs');
const helpers = require('yeoman-test');
const path = require('path');

helpers
    .run(path.join(__dirname, 'commands/init'))
    .withArguments(['init'])
    .withOptions({
        appTitle: 'Test App',
        packageName: 'test-app',
        author: 'asu@dvhb.ru',
        description: 'Test App'
    })
    .toPromise()
    .then(dir => {
        process.stdout.write(dir + '\n');
        process.exit(0);
    });
