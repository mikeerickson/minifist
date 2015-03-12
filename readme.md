```
browserify foo.js -d | minifist -o bundle.js.map >bundle.js

Description:
  Compress & mangle a browserify bundle, and extract the source
  map to a separate file. Sane debugging for a production bundle
  without increasing the file size for users.

Options:
  --out,  -o Where to put the new source map file
  --url,  -u Relative url of the source map [default: --out]
  --base, -b Rewrite file names using a base path [default: $PWD]
```
