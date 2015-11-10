---
layout: post
title:  "isomorphic reactjs"
date:   2015-09-20
author: ouven
tags: isomorphic reactjs javascript
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---

#### isomorphic javascript
web应用从最早静态页面、到php后台框架输出、到mv*为主的SPA、到基于node中层的直出，目前有人提出web的下次改变可能将是基于isomorphic javascript的前后台同构应用。 

####  一、目前主流web app的特点
目前主要的应用都是基于mv*基础上(backbone、ember、angular等)或工程师自己的mvc思想上的应用。

通常做法是，页面所有的数据交互在客户端(一般指浏览器或移动webview)完成，后台只负责输出数据或一个初始的空白页面，而页面的数据则通过加载后的js进行加载渲染，一般用户和开发者的体验都会比较好，but存在很多问题:
- SEO不可做。除了基础的meta信息，基本没有全文信息。搜索引擎爬虫并不能获取页面内容。
- 性能仍有问题。大量的内容渲染，逻辑判断、dom操作、网络交互都在客户端完成，页面上的空白时间很容易让用户厌烦。
- 可维护性。有些低耦合的逻辑模块希望在前后台复用，例如时间格式化，表单验证，我们考虑到某些因素都会前后都做一次。

####  二、Isomorphic JavaScript
通过nodejs，可以轻松创建一个web server，运行js模板将页面输出给浏览器。但是Isomorphic JavaScript使用的是在服务端和客户端运行的一套代码，可以运行js模板或者前端的框架，这就是 “Isomorphic JavaScript”(同构的JavaScript)，借用一个图~

![](http://7tszky.com1.z0.glb.clouddn.com/FraX78zGVUlBz-uBt2g6myNkA7uu)

要做到这件事，有几件事情必须要解决：
- 抽象
- 路由
- 获取数据
- 视图渲染
- 自动构建打包

#### 三、 Isomorphic reactjs
基于这个思想，有人提出使用reactjs来进行直出，大致看下是怎么做的。
mv*驱动在客户端的dom渲染效率是很慢的，例如一个vm的生成要去扫描dom所有属性节点来获取directives、filter或者表达式。而且还有上面提到的三个问题，但是如果在服务端去做就可以解决这些性能问题。
但是问题来了，如何提前扫描节点生成vm，将里面所有的directive、filter和表达式输出呢？可行的做法是在构建混淆阶段去render出来，而且要对每个定义的节点属性的指令表达式去render，这样就行了。不过自己去做工作量就有些了，而且容易出问题

那用reactjs可以怎么搞？
http://reactjsnews.com/isomorphic-javascript-with-react-node/
看来又有人干了这件事情，思路类似，reactjs实现的原理是：使用react.renderToString方法将virtual dom转换为string输出到页面上。这样前端的react代码就完美在服务器跑起来了。

安装node-jsx，处理jsx语法：

```javascript
npm install node-jsx
```

除了必要的工厂抽象模块，依然可以像原来一样书写react模块，这样既可以被前端打包处理，也可以通过node router render出来。

```javascript
 /** @jsx React.DOM */

var React = require('react/addons');
var Mock = require('mockjs');
var Griddle = React.createFactory(require('griddle-react'));
var resultsPerPage = 10;

var columnMeta = Mock.mock({
    'column': ['id', '姓名', '语文', '数学', '英语', '历史', '生物'],
    'order|+1': 1,
    'locked': false,
    'visible': true,
});

var fakeData = Mock.mock({
    'list|45': [{
        'id|+1': 1,
        '姓名': '@chineseName',
        '语文 |40-100': 100,
        '数学 |40-100': 100,
        '英语 |40-100': 100,
        '历史 |40-100': 100,
        '生物 |40-100': 100
    }]
}).list;

var ReactApp = React.createClass({

    componentDidMount: function() {
        console.log(fakeData);
    },

    render: function() {
        return ( < div id = 'table-area' >
            < Griddle results = {
                fakeData
            }
            columnMetadata = {
                columnMeta
            }
            resultsPerPage = {
                resultsPerPage
            }
            tableClassName = 'table' / >
            < /div>
        )
    }
});

/* Module.exports instead of normal dom mounting */
module.exports = ReactApp;
```

解决路由问题：

```javascript
var React = require('react/addons'),
ReactApp = React.createFactory(require('../components/ReactApp'));
module.exports = function(app) {
    app.get('/', function(req, res){
        var reactHtml = React.renderToString(ReactApp({}));
        res.render('index.ejs', {reactOutput: reactHtml});
    });

}
```

这里是关键，这里的renderToString将virtual dom直接转化成为html，这样就实现了直出的转换。

输出模板则可以这样写：

```html
<!doctype html>
<html>
  <head>
    <title>react output demo</title>
    <link href='/styles.css' rel="stylesheet">
  </head>
  <body>
    <h1 id="main-title">react output demo-成绩表</h1>
    <div id="react-main-mount">
      <%- reactOutput %>
    </div>
    <!-- comment out main.js to see server side only rendering -->
    <script src="/main.js"></script>

  </body>
</html>
```

具体看个例子

https://github.com/ouvens/Isomorphic-reactjs/