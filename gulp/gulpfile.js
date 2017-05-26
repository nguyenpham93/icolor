const spawn = require('child_process').spawn;
const gutil = require('gulp-util');
const gulp = require('gulp');



function run_command(command, options) {
  const child = spawn(command, options, {cwd: process.cwd()});
  let stdout = '', stderr = '';

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', function (data) {
    stdout += data;
    gutil.log(data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    stderr += data;
    gutil.log(gutil.colors.red(data));
    gutil.beep();
  });

  child.on('close', function (code) {
    gutil.log("Done with exit code", code);
    gutil.log("You access complete stdout and stderr from here"); // stdout, stderr
  });
}

function npm_start(path) {
  run_command('npm', ['start', '--prefix', path]);
}

// function npm_install(path) {
//   run_command('npm', ['install', '--prefix', path]);
// }

gulp.task('default', ['start_web', 'start_ios']);

//gulp.task('install', ['install_gulp']);

//-------- Running app using npm start
gulp.task('start_web', () => {
  npm_start("../web/");
});

gulp.task('start_ios', () => {
  npm_start("../ios/");
});

//-------- Installation using npm install -----------

// gulp.task('install_gulp', () => {
//   npm_install("./");
// });