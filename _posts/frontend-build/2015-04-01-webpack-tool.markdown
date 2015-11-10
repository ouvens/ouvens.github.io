---
layout: post
title:  "webpack--更优秀的打包管理工具"
date:   2015-04-01
author: ouven
categories: frontend-build
tags:	webpack 打包工具
cover:  "assets/category/type-javascript.png"

---


## webpack是什么
德国开发者Tobias Koppers开发的模块加载器，可用于处理依赖分析和进行打包。

## commonJS与AMD支持
Webpack 对 CommonJS 的 AMD 的语法做了兼容，不过实际上, 引用模块的规则是依据 CommonJS 来的，即如果使用AMD语法，还是根据commonJS语法进行模块查找的。
当然我们之前可也以这么写来兼容AMD和commonJS，但是用了webpack语法上就可以任意去写了：

```javascript

(function (window, factory) {
    if (typeod exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([],factory);
    } else {
        window.eventUtil = factory();
    }
})(this, function () {
    //module ...
});

```

## 如何命令调用webpack
切换到含有webpack.config.js的目录，执行以下命令：
webpack        开发调试环境构建
webpack -p    产品发布环境构建，包含压缩，minify最小化
webpack        --watch 开发调试环境并开启文件watch(fast!)
webpack -d    包含source map打包

## 基本配置使用
安装webpack模块之后, 可是使用 webpack 这个命令行工具进行文件打包等处理，可以使用参数, 也可以配置 webpack.config.js 文件直接运行 webpack 调用。或者使用gulp或grunt的webpack插件，结合其他的插件一起使用。例如使用webpack打包一个文件的配置就可以这么写：

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

## 文件查找依赖
Webpack 是在本地按目录对依赖进行查找的，构造一个例子，可以用 --display-error-details 查看查找过程，例如一下例子配置当中 resolve.extensions 用于指明程序自动补全识别哪些后缀，需要注意的是， extensions 一般需要包含空字符串的情况，对应不需要后缀的情况。

```javascript

// webpack.config.js
module.exports = {
  entry: './a.js',
  output: {
    filename: 'b.js'
  },
  resolve: {
    extensions: ['', '.coffee', '.js', '.coffee']
  }
}

```

## 图片及css的引用
css跟 less，还有图片，被直接引用了。实际上 CSS 被转化为 <style> 标签，而图片可能被转化成 base64 格式的dataUrl，但是要主要在 webpack.config.js 文件写好对应的 loader：

```javascript
require('./bootstrap.css');
require('./myapp.less');
var img = document.createElement('img');
img.src = require('./glyph.png');

// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    path: './build', // This is where images AND js will go
    publicPath: 'http://mycdn.com/', // This is used to generate URLs to e.g. images
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'} // inline base64 URLs for <=8k images, direct URLs for the rest
    ]
  }
};

```

这样我们就可以做很多事情了，尤其是移动端，为了避免过多的css和图片请求，可以通过及其简单的配置就可以在打包时系统帮我们自动做到inline css和图片。

## url-loader是什么
url-loader是对文件加载器file-loader的封装，并且在file-loader完成后进行一些更多的处理

```css
.demo {
  background-image: url('a.png');
}

```

例如以上图片的引用，通过配置可以把a.png抓出来，并按照文件大小，转化为base64或作为单独文件

```javascript

module: {
  loaders: [
    {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'} // inline base64 URLs for <=8k images, direct URLs for the rest
  ]
}

```

## 优化打成多个技术文件包
有时考虑类库代码的缓存，同时也需要打多个文件包，这样也很简单，比如下边的配置,，首先 entry 有多个属性, 对应多个 JavaScript 包，然后 commonsPlugin 可以用于分析模块的共用代码，单独打一个包出来:
https://github.com/petehunt/webpack-howto#8-optimizing-common-code
https://github.com/webpack/docs/wiki/optimization#multi-page-app

```javascript

// webpack.config.js
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
  entry: {
    Profile: './profile.js',
    Feed: './feed.js'
  },
  output: {
    path: 'build',
    filename: '[name].js' // Template based on keys in entry above
  },
  plugins: [commonsPlugin]
};

```

如果入口传入的是一个数组，则会把多个文件一起打包，最后导出最后一个

```javascript
{
    entry: {
        page1: "./page1",
        page2: ["./entry1", "./entry2"]
    },
    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    }
}

```

这里profile和feed都引了common.js，但是webpack不会打commonjs都打到两个文件包里面去，而是自动增加一个<script src="common.js"></script>到引用的文件前面。

## js异步加载
对于一个打包工具，我们很自然去关心异步的问题。commonJS是同步的，但是webpack提供了一个处理异步的方法，这样在页面上处理路由等就很有用，例如以下配置可以在条件分支上异步加载js模块。当打包的模块被引入时webpack会假设被异步打包的文件都在根路径上，并最后通过插入到script标签中来实现异步加载。

```javascript
if (window.location.pathname === '/feed') {
  showLoadingState();
  require.ensure([], function() { // this syntax is weird but it works
    hideLoadingState();
    require('./feed').show(); // when this function is called, the module is guaranteed to be synchronously available.
  });
} else if (window.location.pathname === '/profile') {
  showLoadingState();
  require.ensure([], function() {
    hideLoadingState();
    require('./profile').show();
  });
}

```

## 对文件做revision
使用webpack可对文件生成带hash的文件名
output: { chunkFilename: "[chunkhash].bundle.js" }
引入可插件就可以这样写

```javascript
plugins: [
  function() {
    this.plugin("done", function(stats) {
      require("fs").writeFileSync(
        path.join(__dirname, "...", "stats.json"),
        JSON.stringify(stats.toJson()));
    });
  }
]

```

## 上线压缩：
压缩js

```javascript
plugins: [
   new webpack.optimize.MinChunkSizePlugin(minSize)
]

```

优化react
new webpack.DefinePlugin({
  "process.env": {
    NODE_ENV: JSON.stringify("production")
  }
})
cdn替换
替换 CDN 这个工作, webpack 也内置了, 设置 output.publicPath 即可。http://webpack.github.io/docs/configuration.html#output-publicpath

```javascript
// Example
output: {
    path: "/home/proj/public/assets",
    publicPath: "/assets/"
}
// Example CDN
output: {
    path: "/home/proj/cdn/assets/[hash]",
    publicPath: "http://cdn.example.com/assets/[hash]/"
}

```

对比下fis
相对于fis更加轻量级，webpack更加灵活

最后给几个官方文档的地址：
http://webpack.github.io/
https://github.com/webpack
http://webpack.github.io/docs/
https://github.com/petehunt/webpack-howto

