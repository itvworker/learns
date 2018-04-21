var gulp = require("gulp"); //本地安装gulp所用到的地方
var gutil = require("gulp-util");
var del = require("del"); //删除文件
var less = require('gulp-less'); //less语法
var concat = require("gulp-concat"); //合并
var minifycss = require('gulp-minify-css'); //压缩css
var autoprefixer = require('gulp-autoprefixer'); //自动补全浏览器兼容后缀
var cached = require('gulp-cached'); // 搭配 gulp-remember 可增量编译
var remember = require('gulp-remember'); //搭配 gulp-cached 可增量编译
var plumber = require('gulp-plumber'); //校正报错
var replace = require('gulp-replace'); //替换
var webpack = require('webpack');
var config = require('./webpack.config.js');
var connect = require('gulp-connect'); //本地服务
var rest = require('connect-rest');
var uglify = require('gulp-uglify');


var src={
    html:'./src/index.html',
    less:'./src/style/index.less',
    img:'./src/style/img/**/*',
}

var dist={
    root:'./dist',
    js:'./dist/js',    
}


//清理dist目录的文件
function clean(done) {
    del.sync(['dist/**/*']);
    done();
}


var devCompiler = webpack(config);//导入webpack.js
function devWebpack(done) {
    devCompiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack:build-dev", err);
            return;
        }
        gutil.log("[webpack:build-dev]", stats.toString({
           
            colors: true //颜色
        }));
        done();
    });
}


//把入口文件index.html复制过去
function html(done) {
    return gulp.src(src.html)
        .pipe(gulp.dest(dist.root));
    done();
}

function connectServer(done) {
    connect.server({
        root: dist.root,
        port: 9000,
        livereload: {
            port: 25454
        },
        middleware: function (connect, opt) {
            return [rest.rester({
                context: "/"
            })]
        }
    });
    done();
}


function watch(done) {
    gulp.watch([
        './src/**/*',
       
    ], gulp.series(devWebpack, reload));
    gulp.watch([
        './src/index.html',
      
    ], gulp.series(html, reload));
    done();
}


function reload() {
    return gulp.src('dist/**/*')
        .pipe(connect.reload()); //自动刷新
}

gulp.task("default", gulp.series(clean, devWebpack, html, connectServer, watch));