
const { src, dest, watch, parallel,  series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer').default;
const clean = require('gulp-clean');

function watching(){
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

function scripts(){
    return src(
        'app/js/main.js'
    )
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}
function styles() {
     return src([
        'app/scss/_variables.scss',
        'app/scss/_mixins.scss',
        'app/scss/_fonts.scss',
        'app/scss/_reset.scss',
        'app/scss/style.scss',
        
        // Берем файлы миссии в нужном порядке (сначала главный, потом элементы)
        'app/scss/mission/mission.scss',
        'app/scss/mission/**/*.scss' 
    ])
        .pipe(concat('temp.scss')) // <--- СКЛЕИВАЕМ ВСЁ В ОДИН ВИРТУАЛЬНЫЙ ФАЙЛ
        .pipe(scss({ style: 'compressed' })) // Компилируем то, что склеили
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css')) // Переименовываем
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
            }
        });
}
function cleanDist() {
    return src ('dist') // сохранить структуру 
    .pipe(clean())
}
function building() {
    return src ([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'}) 
    .pipe(dest('dist'))
}
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = parallel(styles, scripts, browsersync, watching);
exports.build = series(cleanDist, building);
