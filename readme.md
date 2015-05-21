```
browserify foo.js -d | minifist -o dist/bundle.js.map -u bundle.js.map >dist/bundle.js

Description:
  Compress & mangle a browserify bundle, and extract the source
  map to a separate file. Sane debugging for a production bundle
  without increasing the file size for typical users. Screw IE8.

Options:
  --out,  -o Where to put the new source map file
  --url,  -u Relative url of the source map [default: --out]
  --base, -b Rewrite file names using a base path [default: $PWD]
```
