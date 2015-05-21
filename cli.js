#!/usr/bin/env node
'use strict';
var createReadStream = require('fs').createReadStream
var createTransformStream = require('./index')
var argv = process.argv.slice(2)
var out, url, base, opt, file
while (opt = argv.shift()) switch (opt) {
  // Relative url of the source map (default to --out)
  case '--url':
  case '-u':
    url = argv.shift(); break

  // Rewrite file names using a base path (default to cwd)
  case '--base':
  case '-b':
    base = argv.shift(); break

  // Where to put the new source map file
  case '--out':
  case '-o':
    out = argv.shift(); break

  default:
    file = argv.shift()
}

// Treat a file stream or stdin the same way. Yay, streams!
(file ? createReadStream(file, 'utf8') : process.stdin)
  .pipe(createTransformStream({
    out: out, url: url, base: base
  }))
  .pipe(process.stdout)
