---
layout: post
title:  "下一代前端打包工具与tree-shaking"
date:   2016-01-20
author: ouven
categories: frontend-build
tags:  打包工具 rollup webpack2 tree-shaking
cover:  "assets/category/type-javascript.png"
---

## 一、js模块化打包概述
&emsp;&emsp;随着js模块化规范AMD、CMD、commonJs的出现，模块打包工具也在不断的出现和演变，依次出现了r.js、browserify和webpack，过去的2015年就是webpack大行其道的一年，又随着reactjs、es6的出现，webpack更是深入人心，因为其人性化的特点和友好性，确实给前端模块打包带来了极大的方便。
&emsp;&emsp;不过今天并不是重点讲webpack，而是rollup，要了解webpack，可以看我的另一篇文章：http://ouvens.github.io/frontend-build/2015/04/01/webpack-tool.html ，在讲rollup之前先来看看几种之前的前端打包方案。

## 二、js模块化打包方案
&emsp;&emsp;先区分下几个不同概念：包管理工具（package manager）、模块加载器（module loader），打包工具（bundler），包管理器指管理安装js模块的这类，例如npm、bower、jspm这些，模块加载器指向requirejs、modjs、seajs这些，模块加载器又主要遵循AMD、CMD、Commonjs三种规范，打包工具则指r.js、browserify、webpack这类。

#### 1、r.js
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

&emsp;&emsp;这里通过相对路径和baseUrl路径来进行文件依赖查找，所以一般我们会设置一个baseUrl来指定要打包的js目录，并将多个文件合成一个文件，并存放到指定的目录下面。简单的理解，他就是一个简单的js依赖分析合并工具。那我们来总结下它的特点：

- 可以合并js，css，并结合其它工具压缩，甚至对整个项目进行打包
- 一般需要指定baseUrl
- 需要将r.js放到开发目录中
- 依赖requireJs的AMD规范，CMD和CommonJs的场景不适用
- 需要手写配置

#### 2、browserify
&emsp;&emsp;Browserify 可以让你使用类似于 node 的 require() 的方式来组织浏览器端的 Javascript 代码，不需要 define(function(require, exports, module) {...}) ，更符合CommonJS模块化规范，并且可以让前端 Javascript模块直接使用npm install的方式安装模块。browserify使用Esprima解析依赖， 生成的AST兼容Mozilla规范。

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
- 使用机制稍微复杂，开发者需要关心的东西很多
- 需要手写打包配置和任务

#### 3、webpack
&emsp;&emsp;webpack之前也讲到过http://ouvens.github.io/frontend-build/2015/04/01/webpack-tool.html 。这里就直接总结一下webpack的特点：

- 模块来源广泛，支持包括npm/bower等等的各种主流模块安装／依赖解决方案
- 模块规范支持全面，amd/cmd/commonjs/shimming等完全支持
- 浏览器端足迹小，移动端友好，却对热加载乃至热替换有很好的支持
- 插件机制完善，实现本身实现同样模块化，容易扩展，支持es6，react等
- 需要手写配置

&emsp;&emsp;对于这里对多种模块规范的支持，这里讲下webpack是怎么封装定义的，例如这里是一个cookie的操作库：

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['zepto'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('zepto'));
    } else {
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
 
#### 4、fis3-packager-loader
&emsp;&emsp;fis3-packager-loader(后面简称fpl)一般没有单独拿出来讲，因为这个是结合fis3一起使用的，fis3的单文件进行处理的流程依次为：lint -> parser -> preprocessor -> standard -> postprocessor -> optimizer。这六个过程可以通过配置插件来定义我们最终想要的结果，然后进行package输出。例如，
&emsp;&emsp;lint 代码校验检查，比较特殊，所以需要 release 命令命令行添加 -l 参数
&emsp;&emsp;parser 预处理阶段，比如 less、sass、es6、react 前端模板等都在此处预编译处理
&emsp;&emsp;preprocessor 标准化前处理插件
&emsp;&emsp;standard 标准化插件，处理内置语法
&emsp;&emsp;postprocessor 标准化后处理插件

&emsp;&emsp;最终阶段为package打包阶段，打包是依赖的插件fpl，fpl可以对html、css、js进行分析打包，并且能打包分析html中引入的js，js中引入的css，功能十分强大，目前所在团队通用的是fis3体系（之前用过grunt、gulp，发现依然很多不爽的地方）具体文档可以查看官网或我的另一篇文章：
http://fis.baidu.com/
https://ouvens.github.io/frontend-build/2015/08/15/fis3-study-rearch.html

&emsp;&emsp;fis3默认可以直接对我们的html进行资源引入打包处理，将scss和js里面的依赖关系层层递进分析打包，并生成resource Map表，程序运行时通过resource Map来加载模块。它的一个很大优势是不用我们书写构建任务和太多的配置。

```html
<link rel="stylesheet" href="../../modules/sass/frozenjs.scss">
<script>
require.async(['zepto', 'frozen', './main'], function($, frozen, main) {
    main.init();
});
</script>
```

看下fis3-packager-loader使用几个需要注意的地方：
- 可以方便的支持html，js，css的依赖引用打包
- 已集成到fis3构建中，简单配置后就可以使用
- 目前js支持同步打包，异步处理我们也可以自己做处理插件
- 依赖fis3环境，支持commonjs规范
- 不需要书写任务配置，这点是很方便的

## 三、下一代前端打包工具
&emsp;&emsp;再来看看下一代模块打包工具rollup ( http://rollupjs.org/guide/ )和webpack2(这里原理相同，不赘述了)。
&emsp;&emsp;rollup是一个模块打包工具：它可以将多个ES6模块转化为一个独立的打包文件，打包后的模块可以是 ES6、CommonJS、ES5……中的任一种格式。Rollup打包JavaScript模块具有两个新的优势：

&emsp;&emsp;**1、ES6到处的模块依然是可用的独立模块**
&emsp;&emsp;现在不少前端团队开始使用ES6 + babel + webpack的方式开发了，但是我们依然只能这样写代码，因为babel无法为我们解析模块加载的问题：

```javascript
var utils = require( 'utils' );

var query = 'Rollup';
utils.ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

使用rollup，我们就可以这样使用了

```javascript
import { ajax } from 'utils';

var query = 'Rollup';
ajax( 'https://api.example.com?search=' + query ).then( handleResponse );
```

&emsp;&emsp;**2、tree-shaking打包**
&emsp;&emsp;通过名叫 “tree-shaking” 的技术使打包的结果只包括实际用到的 exports。Three-shaking 的关键在于依赖 ES6 模块的静态结构。“静态结构”意味着在编译时他们是可分解的，而不用执行它们的任何代码，简单理解是ES6导出的部分如果在其它模块没有调用，rollup在输出时会直接把这部分作为死码删除。死码删除有一个很大的优势，就是现在我们可以根据需要随意地使模块或大或小，而不用担心打包后的大小，因为工具可以帮我筛选过滤，webpack 2也支持这一特性。例如下面两个模块：

```javascript
// lib.js文件
export function foo() {
  console.log(1);
}
export function bar() {
  console.log(2);
}

// main.js文件
import {foo} from './lib.js';
console.log(foo());
```

&emsp;&emsp;rollup打包合并处理后，新生成的文件main.js如下，lib.js中到处但是未被调用的模块被移除了。
 
```javascript
// main.js
function foo() {
  console.log(1);
}
console.log(foo());
```

再来总结下rollup：
- 支持ES6模块规范打包成其它任一格式规范
- 支持tree-shaking方式打包
- 方便接入构建，如gulp
- 需要书写配置任务

**另外需要了解的是，webpack2也具有这两大特性，不过webpack 2还在beta版，正式发布后估计仍然会取代rollup的地位。**

tree-shaking：http://www.2ality.com/2015/12/webpack-tree-shaking.html
面向未来打包：http://www.2ality.com/2015/12/bundling-modules-future.html

## 四、总结
&emsp;&emsp;这里总结下，目前ES6的前端开发者越来越多，虽然ES6在前端的应用仍需要babel等工具协助完成，rollup又为ES6这一开发体系补上了一块新的木板，另外构建打包工具的迭代更新速度很快，webpack 2也携带了tree-shaking技术、结合babel支持es6模块打包出现，未来的团队也要因势而变，才能不断发展。