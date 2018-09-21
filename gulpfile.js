'use strict';

var gulp = require('gulp'),
		watch = require('gulp-watch'),
		prefixer = require('gulp-autoprefixer'),
		cleancss = require('gulp-clean-css'),
		sass = require('gulp-sass'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		uglify = require('gulp-uglify'),
		sourcemaps = require('gulp-sourcemaps'),
		rigger = require('gulp-rigger'),
		pngquant = require('imagemin-pngquant'),
		imagemin = require('gulp-imagemin'),
		rimraf = require('rimraf'),
		browserSync = require('browser-sync'),
		reload = browserSync.reload;

var path = {
	build: { //Куда складывать готовые файлы после сборки
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: { //Откуда брать исходники
		html: 'src/*.html', //Хотим взять все файлы с расширением .html
		js: 'src/js/main.js',
		style: 'src/scss/main.scss',
		img: 'src/img/**/*.*', //Взять все файлы, всех расширений из всех вложенных папок
		fonts: 'src/fonts/**/*.*' 
	},
	watch: { //Наблюдаем за изменениями файлов
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/scss/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 3000,
};

// Task сборка HTML
gulp.task('html:build', function () { // Таск для сборки HTML
	gulp.src(path.src.html) // Выбока файлов по нужному пути
		.pipe(rigger()) // Прогон через rigger
		.pipe(gulp.dest(path.build.html)) // Выгрузка в папку build
		.pipe(reload({stream: true})); // Перезагрузка сервера
});

// Таск сборки JS
gulp.task('js:build', function () {
	gulp.src(path.src.js) //Находим исходник
		.pipe(rigger()) // Прогон через rigger
		.pipe(sourcemaps.init()) //Инициализация sourcemaps
		.pipe(uglify()) // Сжатие js
		.pipe(sourcemaps.write()) //Запись карты файла
		.pipe(gulp.dest(path.build.js)) //Выгрузка в build
		.pipe(reload({stream: true})); // Перезагрузка сервера
});

//Таск сборки css
gulp.task('style:build', function () {
	gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefixer())
		.pipe(cleancss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

// Таск сборки картинок
gulp.task('image:build', function() {
	gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

//Таск для шрифтов
gulp.task('fonts:build', function() {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

// Общая сборка
gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build'
]);

// Watcher
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

//LiveReload Task
gulp.task('webserver', function () {
    browserSync(config);
});

//Clean Task
gulp.task('clean', function(cb) {
	rimraf(path.clean, cb);
});

//Default Task
gulp.task('default', ['build', 'webserver', 'watch']);

