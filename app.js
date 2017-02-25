'use strict';

const fs = require('fs');
const csv = require('csv');


if (process.argv.length < 3) {
  console.log("Usage: node memcached-csv-converter.js <input> [output]");
  process.exit(-1);
}

const file_name = process.argv[2];
const output_file = process.argv[3] || false;

const parse_opts = {
  max_limit_on_data_read: 128000000,
  escape: '',
  quote: '',
  auto_parse: false,
  auto_parse_date: false,
};

let output;
if (output_file) {
  output = fs.createWriteStream(output_file);
} else {
  output = process.stdout;
}

fs.createReadStream(file_name)
  .pipe(csv.parse(parse_opts))
  .pipe(csv.transform((record) => {
    record[1] = hex_convert(record[1]);
    return record;
  }))
  .pipe(csv.stringify())
  .pipe(output);

const REGEX = /(\\x..|.)/g;

function hex_convert(s) {
  const converted_s = s.replace(REGEX,(a) => {
    return a.length > 1 ? a.slice(2).toUpperCase() : a.charCodeAt(0).toString(16).toUpperCase();
  });
  return "0x" + converted_s;
}