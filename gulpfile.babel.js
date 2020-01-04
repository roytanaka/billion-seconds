import { src, dest, watch, series, parallel } from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import webpack from 'webpack-stream';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import uglify from 'gulp-uglify';
import del from 'del';
import babel from 'gulp-babel';

import { create as bsCreate } from 'browser-sync';
const browserSync = bsCreate();
const clean = () => del(['dist']);

function reload(done) {
  browserSync.reload();
  done();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  done();
}

function css(done) {
  return src('src/scss/**/*.scss', { sourcemaps: true })
    .pipe(autoprefixer())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(dest('dist/css/'), { sourcemaps: './maps/' })
    .pipe(browserSync.stream());
  done();
}

function js(done) {
  return (
    src('src/js/**/*.js', { sourcemaps: true })
      // .pipe(babel({ presets: ['@babel/preset-env'] }))
      .pipe(
        webpack({
          mode: 'development',
          output: {
            filename: 'bundle.js',
            publicPath: 'dist/js',
          },
          module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                  },
                },
              },
            ],
          },
          plugins: [new MomentLocalesPlugin()],
        })
      )
      // .pipe(uglify())
      .pipe(dest('dist/js'))
  );
  done();
}

function html(done) {
  return src('src/**/*.html').pipe(dest('dist/'));
  done();
}

function watchFiles(done) {
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', series(js, reload));
  watch('src/*.html', series(html, reload));
  done();
}

exports.default = series(
  clean,
  parallel(css, js, html),
  parallel(serve, watchFiles)
);
