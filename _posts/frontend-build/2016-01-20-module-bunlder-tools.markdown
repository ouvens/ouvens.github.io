---
layout: post
title:  "前端模块化打包工具与下一代rollup"
date:   2016-01-20
author: ouven
categories: frontend-build
tags: rollup 打包工具 webpack jspm browserify
cover:  "assets/category/type-javascript.png"
---

## 一、js模块化打包概述
&emsp;&emsp;随着js模块化规范AMD、CMD、commonJs的出现，模块打包工具也在不断的出现和演变，依次出现了r.js、browserify，jspm和webpack，例如过去的2015年就是webpack大行其道的一年，又随着reactjs、es6的出现，webpack更是深入人心，因为其人性化的特点和友好性，确实给前端模块大打包管理带来了极大的。
&emsp;&emsp;不过今天并不是重点讲webpack，而是rollup，要了解webpack，可以看我的另一篇文章：http://ouvens.github.io/frontend-build/2015/04/01/webpack-tool.html ，再讲rollup之前先来看看几种之前的一种前端打包方案。

## 二、js模块化打包方案

#### 1、npm
&emsp;&emsp;npm是node的默认包管理器，使用commonJs规范，原理是每个文件模块返回一个到处对象，对象名为module，module用exports属性，并且有另一个默认的exports变量指向module.exports。其中module和exports也存在于global对象上。

#### 2、r.js
&emsp;&emsp;在grunt结合requirejs的年代，r.js作为通用标配的打包工具普世存在，当然现在应该也有些团队在用。
&emsp;&emsp;r.js是requireJS的优化（Optimizer）工具，可以实现前端文件的压缩与合并，在requireJS异步按需加载的基础上进一步提供前端优化，减小前端文件大小、减少对服务器的文件请求。先来分析一个官网的例子：

```javascript

{
    appDir: '../www',
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    },
    dir: '../www-built',
    modules: [
        {
          //module names are relative to baseUrl
            name: '../common',
            include: ['jquery',
                      'app/lib',
                      'app/controller/Base',
                      'app/model/Base'
            ]
        },{
          //module names are relative to baseUrl/paths config
            name: '../page1',
            include: ['app/main1'],
            exclude: ['../common']
        },{
            //module names are relative to baseUrl
            name: '../page2',
            include: ['app/main2'],
            exclude: ['../common']
        }
    ]
}
```

如果这个文件配置命名为build.js，在node环境下执行 node r.js -o build.js 就可以压缩合并需要的模块。可以见一下配置
![](http://7tszky.com1.z0.glb.clouddn.com/FucZNwVKdE_sh8BDZy29SA5SP1pf)

地址见：https://github.com/requirejs/example-multipage/blob/master/tools/build.js

&emsp;&emsp;这里通过相对路径和baseUrl路径来进行文件依赖查找，所以一般我们会设置一个baseUrl来指定要打包的js目录，并将多个文件合成，一个文件，并存放到指定的目录下面。简单的理解，他就是一个简单的js依赖分析合并工具。那我们来总结下它的特点：

- 可以合并js，css，并结合其它工具压缩，甚至对整个项目进行打包
- 一般需要指定baseUrl
- 需要将r.js放到开发目录中
- 依赖requireJs的AMD规范，CMD和CommonJs的场景不适用

#### 3、browserify
&emsp;&emsp;Browserify 可以让你使用类似于 node 的 require() 的方式来组织浏览器端的 Javascript 代码，不需要 define(function(require, exports, module) {...}) ，更符合CommonJS模块化规范，并且可以让前端 Javascript模块直接使用npm install的方式安装。browserify使用Esprima， 生成的AST兼容Mozilla规范。

```javascript
npm install -g browserify
browserify greet.js > bundle.js //把 greet.js 及其所依赖的模块文件打包成单个 bundle.js 文件。
```
看一个完整的例子：
**配置的js文件**
```javascript
var fs = require('fs');
var domify = require('domify');
var insertCss = require('insert-css');
 
var css = fs.readFileSync(__dirname + '/badge.css', 'utf8');
insertCss(css);
 
var html = fs.readFileSync(__dirname + '/badge.html', 'utf8');
 
module.exports = Badge;
 
function Badge(opts) {
  if (!(this instanceof Badge)) return new Badge(opts);
  this.element = domify(html);
  if (opts.number) {
    this.setNumber(opts.number);
  }
}
 
Badge.prototype.setNumber = function (number) {
  this.element.querySelector('.number').textContent = number;
}
 
Badge.prototype.appendTo = function (target) {
  if (typeof target === 'string') target = document.querySelector(target);
  target.appendChild(this.element);
};
```
**package.json**

```javascript
{
  "name": "badge",
  "version": "1.0.0",
  "private": true,
  "main": "badge.js",
  "browserify": {
  "transform": [ "brfs" ]
},
"dependencies": {
  "brfs": "^1.1.1"
  }
}
```
除了配置，我们不得不管理一个依赖包的映射表，即package.json文件，这样才能正常使用自定义的模块

可见：
- browserify更多是为了支持commonJs的规范
- 可以让前端 Javascript模块直接使用npm install的方式安装
- 使用机制过于复杂，开发者需要关心的东西很多

#### 4、jspm & bower
&emsp;&emsp;和npm和bower类似，jspm更偏向为js的包管理工具，而并不通过直接的打包功能。bower主要是对amd模块进行依赖分析，jspm比起bower的话就是增加了对npm的支持，比起 npm 的话，jspm将第三方包目录压成一个文件，在前端，jspm增加了 SystemJS的集成。另外，jspm还有一系列的基于SystemJS的加载Plugin，Build工具，不过适应性还没有npm和bower广。

#### 5、webpack
&emsp;&emsp;webpack之前也总结过http://ouvens.github.io/frontend-build/2015/04/01/webpack-tool.html 。这里就直接总结一下webpack的特点：

- 模块来源广泛，支持包括npm/bower等等的各种主流模块安装／依赖解决方案
- 模块规范支持全面，amd/cmd/commonjs/shimming等完全支持
- 浏览器端足迹小，移动端友好，却对热加载乃至热替换有很好的支持
- 插件机制完善，实现本身实现同样模块化，容易扩展，支持es6，react等

&emsp;&emsp;对于这里对多种模块规范的支持，这里讲下webpack是怎么封装定义的，例如这里是一个cookie的操作库：

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['zepto'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'));
    } else {
        // 浏览器全局变量(root 即 window)
        root['Cookie'] = factory(root['Zepto']);
    }

})(this, function ($) {

  var exports = {
    init: function (){

    }
  };
    $.cookie = exports;
    return exports;
});
```
 
 相信大家一看就懂，对于webpack的配置文件写起来也是很长简洁，这就是为什么webpack目前这么受欢迎的原因之一。
 
```javascript

 // webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'       
  }
};
当然也可以这样，webpack支持了coffee和jsx，喜欢玩react的同学可以试下。
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'       
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.js$/, loader: 'jsx-loader?harmony' } // loaders can take parameters as a querystring
    ]
  }
};
```
 
#### 6、fis3-packager-loader
&emsp;&emsp;fis3-packager-loader(后面简称fpl)一般没有单独拿出来讲，因为这个是结合fis3一起使用的，fis3的单文件进行处理的流程依次为：lint -> parser -> preprocessor -> standard -> postprocessor -> optimizer。这六个过程可以通过配置插件来定义我们最终想要的结果，然后进行package输出。例如，
lint 代码校验检查，比较特殊，所以需要 release 命令命令行添加 -l 参数
parser 预处理阶段，比如 less、sass、es6、react 前端模板等都在此处预编译处理
preprocessor 标准化前处理插件
standard 标准化插件，处理内置语法
postprocessor 标准化后处理插件
packager 打包阶段

&emsp;&emsp;最终阶段为package打包阶段，打包是依赖的插件fpl，fpl可以对html、css、js进行分析打包，并且html中引入js，js中引入css，功能十分强大，目前所在团队通用的是fis3体系（之前用过grunt、gulp，发现依然很多不爽的地方）具体文档可以查看官网或我的另一篇文章：
http://fis.baidu.com/
https://ouvens.github.io/frontend-build/2015/08/15/fis3-study-rearch.html

## 三、rollup

## 四、总结