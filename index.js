'use strict';
var TransformStream = require('stream').Transform
var writeFile = require('fs').writeFile
var pathParser = require('path')
var ujs = require('uglify-js')

// Match against: //# sourceMappingURL=data:application/json;base64,0ZG91dClcbiJdfQ...==
var RX_TAG = /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset:\S+;)?base64,(.*)$/mg

function extractSourceMap(content) {
  var groups = content.match(RX_TAG)
  return groups
    ? JSON.parse(new Buffer(groups.pop()
      .replace(/^\/\*/g, '//').replace(/\*\/$/g, '')
      .split(',').pop(), 'base64').toString())
    : null
}

function defaults(src, dest) {
  Object.keys(src).forEach(function (key) {
    if (typeof src[key] !== 'undefined') dest[key] = src[key]
  })
  return dest
}

/**
 * Compress & mangle javascript with an inline source-map tag and create an external source-map
 * @param {string} opt.out Where to put the new source map file
 * @param {string} opt.url Relative url of the source map
 * @param {string} opt.base Rewrite file names using a base path (default to cwd)
 * @param {object} opt.minify Options passed on to UglifyJS.minify()
 * @return {Stream} Minified code with a source-map tag
 */
module.exports = function createSourceStream(opt) {
  var transformation = new TransformStream()
  var buf = []
  opt = defaults(opt, {
    url: opt.out,
    base: process.env.PWD,
    minify: {}
  })

  transformation._transform = function collect(chunk, _, next) {
    buf.push(chunk)
    next()
  }

  transformation._flush = function ready(done) {
    var all = Buffer.concat(buf).toString()
    var originalMap = extractSourceMap(all)
    var min = ujs.minify(all, defaults(opt.minify, {
      screwIE8: true,
      compress: true,
      mangle: true,
      fromString: true,
      sourceMaps: true,
      outSourceMap: opt.url,
      inSourceMap: originalMap
    }))
    var finalMap = JSON.parse(min.map)
    this.push(min.code)
    finalMap.sourcesContent = originalMap.sourcesContent
    finalMap.sources = originalMap.sources
      .map(function (file) {return pathParser.relative(opt.base, file)})
    writeFile(opt.out, JSON.stringify(finalMap), 'utf8', done)
  }

  return transformation
}
