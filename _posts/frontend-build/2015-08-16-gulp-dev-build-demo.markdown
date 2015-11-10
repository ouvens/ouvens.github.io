---
layout: post
title:  "gulp搭建简单构建环境"
date:   2015-08-16
author: ouven
tags: 构建 gulp
categories: frontend-build
cover:  "assets/category/type-javascript.png"
---


Gulp 是一款基于任务的设计模式的自动化工具，通过插件的配合解决全套前端解决方案，如静态页面压缩、图片压缩、JS合并、SASS同步编译并压缩CSS、服务器控制客户端同步刷新。

所有功能前提需要安装nodejs和ruby。

#### Gulp安装

全局安装Gulpjs

  npm install -g gulp  #全局安装
  
局部安装Gulpjs

  npm install gulp --save-dev # 局部安装

全局安装
1. 将安装包放在 /usr/local 下
2. 可以直接在命令行里使用

本地安装
1. 将安装包放在 ./node_modules 下（运行npm时所在的目录）
2. 可以通过 require() 来引入本地安装的包

#### 选择Gulp组件

前端项目需要的功能：
1、图片（压缩图片支持jpg、png、gif）
2、样式 （支持sass 同时支持合并、压缩、重命名）
3、javascript （检查、合并、压缩、重命名）
4、html （压缩）
5、客户端同步刷新显示修改
6、构建项目前清除发布环境下的文件（保持发布环境的清洁）

通过gulp plugins，寻找对于的gulp组件
gulp-imagemin: 压缩图片
gulp-ruby-sass: 支持sass
gulp-minify-css: 压缩css
gulp-jshint: 检查js
gulp-uglify: 压缩js
gulp-concat: 合并文件
gulp-rename: 重命名文件
gulp-htmlmin: 压缩html
gulp-clean: 清空文件夹
gulp-livereload: 服务器控制客户端同步刷新（需配合chrome插件LiveReload及tiny-lr）

#### 安装Gulp组件

安装组件项目目录，通过cd project 进入目录，执行下边的npm安装组件。

```javascript

npm install gulp-util gulp-imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev

```

项目目录结构

```javascript

project(项目名称)
|–.git 通过git管理项目会生成这个文件夹
|–node_modules 组件目录
|–dist 发布环境
    |–css 样式文件(style.css style.min.css)
    |–images 图片文件(压缩图片)
    |–js js文件(main.js main.min.js)
    |–index.html 静态文件(压缩html)
|–src 生产环境
    |–sass sass文件
    |–images 图片文件
    |–js js文件
    |–index.html 静态文件
|–.jshintrc jshint配置文件
|–gulpfile.js gulp任务文件

```

Windows 下安装ruby和sass，下载安装ruby，http://rubyinstaller.org/downloads/ ，安装完成后使用 gem install sass安装sass

由于网络，安装时注意网络和更换国内安装源：

```javascript

$ gem sources --remove https://rubygems.org/
$ gem sources -a https://ruby.taobao.org/
$ gem sources -l
```

*** CURRENT SOURCES ***
https://ruby.taobao.org

确保只有 ruby.taobao.org后

  $ gem install rails

gulp基础语法
gulp通过gulpfile文件来完成相关任务，因此项目中必须包含gulpfile.js

gulp有五个方法：src、dest、task、run、watch
src和dest：指定源文件和处理后文件的路径
watch：用来监听文件的变化
task：指定任务
run：执行任务

编写gulp任务

```javascript

/**
 * 组件安装
 * npm install gulp-util gulp-imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr --save-dev
 */

// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload');   //livereload

// HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});

// 样式处理
gulp.task('css', function () {
    var cssSrc = './src/scss/*.scss',
        cssDst = './dist/css';

    gulp.src(cssSrc)
        .pipe(sass({ style: 'expanded'}))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function(){
    var imgSrc = './src/images/**/*',
        imgDst = './dist/images';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
})

// js处理
gulp.task('js', function () {
    var jsSrc = './src/js/*.js',
        jsDst ='./dist/js';

    gulp.src(jsSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/css', './dist/js', './dist/images'], {read: false})
        .pipe(clean());
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('html','css','images','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){

    server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }

        // 监听html
        gulp.watch('./src/*.html', function(event){
            gulp.run('html');
        })

        // 监听css
        gulp.watch('./src/scss/*.scss', function(){
            gulp.run('css');
        });

        // 监听images
        gulp.watch('./src/images/**/*', function(){
            gulp.run('images');
        });

        // 监听js
        gulp.watch('./src/js/*.js', function(){
            gulp.run('js');
        });

    });
});

```

__LiveReload配置__

1、安装Chrome LiveReload
2、通过npm安装http-server ，快速建立http服务

  npm install http-server -g
  
3、通过cd找到发布环境目录dist
4、运行http-server，默认端口是8080
5、访问路径localhost:8080
6、再打开一个cmd，通过cd找到项目路径执行gulp，清空发布环境并初始化
7、执行监控 gulp
8、点击chrome上的LiveReload插件，空心变成实心即关联上，你可以修改css、js、html即时会显示到页面中。




 

