const fs = require('fs')
const path = require('path')

function render (filePath, res) {
  res.render(filePath)
}

function checkFileAndRender (filePath, res, next) {
  return fs.lstat(filePath, function (err, stats) {
    if (!err && stats.isFile()) {
      return render(filePath, res, next)
    }
    next()
  })
}

module.exports = function (options) {
  if (!options.root) {
    throw new Error('root must be provided')
  }

  const root = options.root

  return function (req, res, next) {
    const filePath = path.join(root, req.path)

    fs.lstat(filePath, function (err, stats) {
      // check if the is index.pug file when requesting a directory
      if (!err && stats.isDirectory()) {
        return checkFileAndRender(path.join(filePath, 'index.pug'), res, next)
      }

      // check for .pug file
      if (!err && stats.isFile() && path.extname(filePath) === '.pug') {
        return render(filePath, res)
      }

      // check for .html file
      if (path.extname(filePath) === '.html') {
        return checkFileAndRender(filePath.replace(/html$/, 'pug'), res, next)
      }

      next()
    })
  }
}
