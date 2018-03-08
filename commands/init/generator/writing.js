'use strict';

module.exports = function () {
  const copyDirs = ['src'];
  const copyFiles = [
    '.gitignore',
    '.editorconfig',
    '.eslintignore',
    '.eslintrc',
    '.babelrc',
    'LICENSE',
    'src/.modernizrrc',
  ];
  const copyTemplates = [
    'package.json',
    'README.md',
    'dvhb.config.js'
  ];

  copyDirs.forEach(dir => {
    this.fs.copy(this.templatePath(`${dir}/**/*`), this.destinationPath(dir));
  });

  copyFiles.forEach(file => {
    this.fs.copy(
      this.templatePath(file.startsWith('.')? file.substr(1) : file),
      this.destinationPath(file)
    );
  });

  copyTemplates.forEach(template => {
    this.fs.copyTpl(
      this.templatePath(template),
      this.destinationPath(template),
      { data: this.data }
    );
  });
};
