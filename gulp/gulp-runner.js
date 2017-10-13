let child = require('child_process');
let EventEmitter = require('events').EventEmitter;
let util = require('util');
let path = require('path')
let extend = require('extend');
let process = require('process');

let DEFAULTS = {
  noColor: true
}

function GulpRunner(gulpfile) {
  this.gulpfile = path.resolve(gulpfile);
}

util.inherits(GulpRunner, EventEmitter)

GulpRunner.prototype.run = function (tasks, options, cb) {
  let self = this;
  if (typeof options === 'function' && !cb) {
    cb = options;
    options = {}
  }

  if (!cb) {
    cb = function () {
    }
  }

  options = options || (options = {})
  options.gulpfile = this.gulpfile;
  tasks = util.isArray(tasks)? tasks : [tasks];

  let gulpBin = require.resolve('gulp/bin/gulp.js')
  let gulpOpts = [gulpBin].concat(buildOpts(tasks, options))

  let gulp = child.spawn(process.execPath, gulpOpts, {
    detached: true,
    cwd: __dirname
  })

  self.emit('start');

  gulp.stdout.on('data', reemit.bind(this)('log'))

  gulp.stderr.on('data', reemit.bind(this)('error'))

  gulp.on('close', function (code) {
    if (code !== 0) {
      self.emit('failed', code)
      cb(new Error('gulp failed'))
    } else {
      self.emit('complete', code)
      cb(null)
    }
  });

  process.on('SIGINT', function () {
    gulp.kill();
    process.exit(1);
  });
};

function reemit(event) {
  let self = this;
  return function (data) {
    self.emit(event, data);
  }
}

function buildOpts(tasks, options) {
  let args = []
  let opts = extend({}, DEFAULTS, options)

  args = args.concat(tasks);

  Object.keys(opts).forEach(function (key) {
    let val = opts[key];
    if (val === true || typeof val === 'undefined') {
      args.push(buildKey(key))
    } else if (typeof val === 'string' || typeof val === 'number') {
      args.push(buildKey(key), val)
    } else if (val === false) {
      args.push(buildKey(key), 'false')
    } else if (util.isArray(val)) {
      val.forEach(function (v) {
        args.push(buildKey(key), v);
      })
    } else if (val != null && !util.isArray(val) && Object.keys(val).length) {
      throw new Error("Can't pass complex objects to `options`.")
    }
  })

  return args;
}

function buildKey(key) {
  return '--' + key;
}

module.exports = GulpRunner;
