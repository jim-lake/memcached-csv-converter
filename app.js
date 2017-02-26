'use strict';

const fs = require('fs');
const csv = require('fast-csv');

if (process.argv.length < 3) {
  console.log("Usage: node memcached-csv-converter.js <input> [output]");
  process.exit(-1);
}

const file_name = process.argv[2];
const output_file = process.argv[3] || false;

let output;
if (output_file) {
  output = fs.createWriteStream(output_file);
} else {
  output = process.stdout;
}

const fast_opts = {
  quote: '',
  escape: '',
};

const csv_stream = csv.parse(fast_opts);

csv_stream.on("data",(data) => {
  data[1] = hex_convert(data[1]);
  output.write(data.join(",") + "\n");
});

csv_stream.on("end",() => {
  console.log("done");
});

fs.createReadStream(file_name)
  .pipe(csv_stream);

const REGEX = /(\\x..|.)/g;

function hex_convert(s) {
  return s.replace(REGEX,(a) => {
    return a.length > 1 ? a.slice(2).toUpperCase() : a.charCodeAt(0).toString(16).toUpperCase();
  });
}