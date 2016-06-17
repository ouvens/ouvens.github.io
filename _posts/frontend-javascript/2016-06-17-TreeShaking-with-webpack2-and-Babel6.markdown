---
layout: post
title:  "【原译】webpack 2和babel 6的tree-shaking"
date: 2016-06-17
author: ouven
tags: webpack 2和babel 6的tree-shaking
categories: article-translation
cover: "assets/category/type-javascript.png"
---

&emsp;&emsp;Rich Harris’扥模块打包机[Rollup](https://github.com/rollup/rollup)提出了JavaScript世界的一个新特性：Tree-Shaking，为打包文件去掉不必要的导出。Rollup依赖[ES6模块的静态结构](http://exploringjs.com/es6/ch_modules.html#static-module-structure)(imports内容和exports内容在JavaScript执行时是不变的)检测来决定哪个导出是不必要的。

&emsp;&emsp;webpack 2的Tree-Shaking还在beta阶段。这篇文章讲解了它是如何工作的。也可以先看个demo：[tree-shaking-demo](https://github.com/rauschma/tree-shaking-demo)

#### 1、webpack 2如何排除无用导出

&emsp;&emsp;webpack的新beta版本webpack 2通过下面两步来排除无用的导出：

- 首先，所有的ES6模块文件都合并成一个打包后的文件。在这个文件中，没有被import过的exports是不会被合并进来的。
- 其次，打包后的文件被合并minified时移除了不用的代码。所以，哪些没有被导出或没有被使用的入口就不会出现在minified压缩后的包里了。没有第一步的操作，不用的代码就不会被移除掉(而是作为一个export被注册进来)。

&emsp;&emsp;如果模块系统有静态结构，无用的导出将在打包的时候被检测出来。所以，webpack 2可以分析理解所有的ES6代码并且只在检测到是ES6模块时才使用tree-shaking。然而，只有import导入和export导出的模块才会被编译为ES5。如果你希望所有的打包文件都编译为ES5，你需要使用一个转译器来处理剩下来的文件。这篇文章中，我们将使用babel 6。

#### 2、ES6 代码

&emsp;&emsp;样例代码含有两个ES6 模块`helpers.js`和`main.js`。

```
// helpers.js
export function foo() {
    return 'foo';
}
export function bar() {
    return 'bar';
}
```

```
// main.js
import {foo} from './helpers';

let elem = document.getElementById('output');
elem.innerHTML = `Output: ${foo()}`;
```

&emsp;&emsp;注意下导出的`heplers`的`bar`模块是没有在任何地方用到的。

#### 3、不使用tree-shaking输出

&emsp;&emsp;正常使用Babel 6来转换的方式是这样的：

```
{
  presets: ['es2015'],
}
```

&emsp;&emsp;然而这种方式使用的`transform-es2015-modules-commonjs`插件意味着Babel会commonJs模块转换输出然后webpack 2就不能进行tree-shaking分析了。

```
function(module, exports) {
    
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.foo = foo;
    exports.bar = bar;
    function foo() {
        return 'foo';
    }
    function bar() {
        return 'bar';
    }
}
```

&emsp;&emsp;你会看到`bar`成了导出的一部分，这样就成为了不用到代码存在于打包后文件中，并不能被辨认出来。

#### 4、 使用tree-shaking输出

&emsp;&emsp;我们想要的是Babel编译ES6，但不是使用`transform-es2015-modules-commonjs`。这时，唯一个可行的方法是在我们的配置文件中列出所有要处理的文件，当然除去哪些我们不需要处理的，所以我们的做法是这样的：([demo](https://github.com/babel/babel/blob/472ad1e6a6d4d0dd199078fdb08c5bc16c75b5a9/packages/babel-preset-es2015/index.js))

```
{
    plugins: [
        'transform-es2015-template-literals',
        'transform-es2015-literals',
        'transform-es2015-function-name',
        'transform-es2015-arrow-functions',
        'transform-es2015-block-scoped-functions',
        'transform-es2015-classes',
        'transform-es2015-object-super',
        'transform-es2015-shorthand-properties',
        'transform-es2015-computed-properties',
        'transform-es2015-for-of',
        'transform-es2015-sticky-regex',
        'transform-es2015-unicode-regex',
        'check-es2015-constants',
        'transform-es2015-spread',
        'transform-es2015-parameters',
        'transform-es2015-destructuring',
        'transform-es2015-block-scoping',
        'transform-es2015-typeof-symbol',
        ['transform-regenerator', { async: false, asyncGenerators: false }],
    ],
}
```

&emsp;&emsp;如果我们构建这个项目，`helper`模块就是这样的：

```
function(module, exports, __webpack_require__) {
    
    /* harmony export */ exports["foo"] = foo;
    /* unused harmony export bar */;

    function foo() {
        return 'foo';
    }
    function bar() {
        return 'bar';
    }
}
```

&emsp;&emsp;现在只导出`foo`了，但是`bar`仍然在那里。通过minified之后就可以了：

```
function (t, n, r) {
    function e() {
        return "foo"
    }

    n.foo = e
}
```


&emsp;&emsp;OK，再也没有多余的东西了。这里一个值的注意的地方时，webpack 2的tree-shaking只分析含有导入导出的模块，而且其它使用其它的编译插件时一定需要注意下。



原文作者：Dr. Axel Rauschmayer

原译：ouven

原文地址： [http://www.2ality.com/2015/12/webpack-tree-shaking.html](http://www.2ality.com/2015/12/webpack-tree-shaking.html)

