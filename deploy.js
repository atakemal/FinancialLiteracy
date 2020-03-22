const ftp = require("vinyl-ftp");
const fs = require("vinyl-fs");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const argv = require("minimist")(process.argv.slice(2));
const { src, dest } = argv;
if (!src)
  throw new Error(
    "You must specify where the source files to upload are, using --src"
  );
if (!dest)
  throw new Error(
    "You must specify where the destination directory on the ftp server is, using using --dest"
  );

const conn = ftp.create({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
  parallel: 6,
  log: console.log
});

fs
  .src([src], { buffer: false })
  .pipe(conn.newer(dest))
  .pipe(conn.dest(dest));
