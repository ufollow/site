const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const babelify = require('babelify')
const bro = require('gulp-bro')
const connect = require('gulp-connect')
const fileinclude = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const rename = require("gulp-rename")
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')

gulp.task('build-sass', () => {
  return gulp.src('src/scss/index.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', (e) => console.log(e)))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 2 versions'], cascade: false }))
    .pipe(rename({ basename: 'ufollow', extname: '.min.css' }))
    .pipe(gulp.dest('dist'))
})

gulp.task('build-js', () => {
  return gulp.src('src/js/index.js')
    .pipe(bro({ transform: [babelify.configure({ presets: ['@babel/preset-env'] })] }))
    .pipe(uglify().on('error', (e) => console.log(e)))
    .pipe(rename({ basename: 'ufollow', extname: '.min.js' }))
    .pipe(gulp.dest('dist'))
})

gulp.task('build-html', () => {
  return gulp.src(['src/html/**/*.html', '!src/html/_template/**/*'], { base: './src/html' })
    .pipe(fileinclude({ prefix: '@@', basepath: './src/html/' }).on('error', (e) => console.log(e)))
    .pipe(htmlmin({ collapseWhitespace: true }).on('error', (e) => console.log(e)))
    .pipe(gulp.dest('dist/'))
})

gulp.task('copy-img', () => {
  return gulp.src('src/img/**/*.{svg,jpg,png}')
    .pipe(gulp.dest('dist/img'))
})

gulp.task('copy-favicon', () => {
  return gulp.src('src/favicon.ico')
    .pipe(gulp.dest('dist'))
})

gulp.task('build', gulp.parallel('build-html', 'build-sass', 'build-js', 'copy-img', 'copy-favicon'))

gulp.task('build-watching', done => {
  gulp.watch('src/html/**/*.html', gulp.series('build-html'))
  gulp.watch('src/scss/**/*.scss', gulp.series('build-sass'))
  gulp.watch('src/js/**/*.js', gulp.series('build-js'))
  gulp.watch('src/img/**/*.{svg,jpg,png}', gulp.series('copy-img'))
  gulp.watch('src/img/**/*.ico', gulp.series('copy-favicon'))

  done()
})

gulp.task('serve', done => {
  connect.server({ root: 'dist', port: 8888, fallback: 'dist/404.html' })
  connect.serverClose()

  done()
})

gulp.task('start', gulp.series('serve', 'build-watching', 'build'))
