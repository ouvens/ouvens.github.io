---
layout: post
title:  "前端性能优化（二） 桌面浏览器前端优化策略"
date:   2017-07-03
author: ouven
tags: 前端性能优化 前端性能分析 桌面浏览器 前端优化策略
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---


---
layout: post
title:  "前端性能优化（二） 桌面浏览器前端优化策略"
date:   2017-07-03
author: ouven
tags: 前端性能优化 前端性能分析 桌面浏览器 前端优化策略
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---


&emsp;&emsp;通过性能测速和分析，我们基本可以获取收集到页面上大部分的具体性能数据，如何根据这些数据采取适当的方法和手段对当前的页面进行优化呢？目前来看，前端优化的策略很多，如YSlow（YSlow是Yahoo发布的一款Firefox插件，可以对网站的页面性能进行分析，提出对该页面性能优化的建议）原则等，总结起来主要包括网络加载类、页面渲染类、CSS优化类、JavaScript执行类、缓存类、图片类、架构协议类等几类，下面逐一介绍。

一、 网络加载类

1．减少HTTP资源请求次数

&emsp;&emsp;在前端页面中，通常建议尽可能合并静态资源图片、JavaScript或CSS代码，减少页面请求数和资源请求消耗，这样可以缩短页面首次访问的用户等待时间。通过构建工具合并雪碧图、CSS、JavaScript文件等都是为了减少HTTP资源请求次数。另外也要尽量避免重复的资源，防止增加多余请求。

2．减小HTTP请求大小

&emsp;&emsp;除了减少HTTP资源请求次数，也要尽量减小每个HTTP请求的大小。如减少没必要的图片、JavaScript、CSS及HTML代码，对文件进行压缩优化，或者使用gzip压缩传输内容等都可以用来减小文件大小，缩短网络传输等待时延。前面我们使用构建工具来压缩静态图片资源以及移除代码中的注释并压缩，目的都是为了减小HTTP请求的大小。

3．将CSS或JavaScript放到外部文件中，避免使用`<style>`或`<script>`标签直接引入

&emsp;&emsp;在HTML文件中引用外部资源可以有效利用浏览器的静态资源缓存，但有时候在移动端页面CSS或JavaScript比较简单的情况下为了减少请求，也会将CSS或JavaScript直接写到HTML里面，具体要根据CSS或JavaScript文件的大小和业务的场景来分析。如果CSS或JavaScript文件内容较多，业务逻辑较复杂，建议放到外部文件引入。

```html
<link rel="stylesheet" href="//cdn.domain.com/path/main.css">

<script src="//cdn.domain.com/path/main.js"></script>
```

4．避免页面中空的href和src

&emsp;&emsp;当`<link>`标签的href属性为空，或`<script>`、`<img>`、`<iframe>`标签的src属性为空时，浏览器在渲染的过程中仍会将href属性或src属性中的空内容进行加载，直至加载失败，这样就阻塞了页面中其他资源的下载进程，而且最终加载到的内容是无效的，因此要尽量避免。

```html
<!-- 不推荐 -->
<img src="" alt="photo">
<a href="">点击链接</a>
```

5．为HTML指定Cache-Control或Expires

&emsp;&emsp;为HTML内容设置Cache-Control 或Expires可以将HTML内容缓存起来，避免频繁向服务器端发送请求。前面讲到，在页面Cache-Control或Expires头部有效时，浏览器将直接从缓存中读取内容，不向服务器端发送请求。

```html
<meta http-equiv="Cache-Control" content="max-age=7200" />
<meta http-equiv="Expires" content="Mon, 20 Jul 2016 23:00:00 GMT" />
```

6．合理设置Etag和Last-Modified

&emsp;&emsp;合理设置Etag和Last-Modified使用浏览器缓存，对于未修改的文件，静态资源服务器会向浏览器端返回304，让浏览器从缓存中读取文件，减少Web资源下载的带宽消耗并降低服务器负载。

```html
<meta http-equiv="last-modified" content="Mon, 03 Oct 2016 17:45:57 GMT"/>
```

7． 减少页面重定向

&emsp;&emsp;页面每次重定向都会延长页面内容返回的等待延时，一次重定向大约需要600毫秒的时间开销，为了保证用户尽快看到页面内容，要尽量避免页面重定向。

8．使用静态资源分域存放来增加下载并行数

&emsp;&emsp;浏览器在同一时刻向同一个域名请求文件的并行下载数是有限的，因此可以利用多个域名的主机来存放不同的静态资源，增大页面加载时资源的并行下载数，缩短页面资源加载的时间。通常根据多个域名来分别存储JavaScript、CSS和图片文件。

```html
<link rel="stylesheet" href="//cdn1.domain.com/path/main.css">
<script src="//cdn2.domain.com/path/main.js"></script>
```

9．使用静态资源CDN来存储文件

&emsp;&emsp;如果条件允许，可以利用CDN网络加快同一个地理区域内重复静态资源文件的响应下载速度，缩短资源请求时间。

10．使用CDN Combo下载传输内容

&emsp;&emsp;CDN Combo是在CDN服务器端将多个文件请求打包成一个文件的形式来返回的技术，这样可以实现HTTP连接传输的一次性复用，减少浏览器的HTTP请求数，加快资源下载速度。例如同一个域名CDN服务器上的a.js，b.js，c.js就可以按如下方式在一个请求中下载。

```html
<script src="//cdn.domain.com/path/a.js,b.js,c.js"></script>
```

11．使用可缓存的AJAX

&emsp;&emsp;对于返回内容相同的请求，没必要每次都直接从服务端拉取，合理使用AJAX缓存能加快AJAX响应速度并减轻服务器压力。


```javascript

$.ajax({
    url: url,
    type: 'get',
    cache: true,    // 推荐使用缓存
    data: {}
    success(){
        // ...
    },
    error(){
        // ...
    }
});
```

12．使用GET来完成AJAX请求

&emsp;&emsp;使用XMLHttpRequest时，浏览器中的POST方法发送请求首先发送文件头，然后发送HTTP正文数据。而使用GET时只发送头部，所以在拉取服务端数据时使用GET请求效率更高。

```javascript
$.ajax({
    url: url,
    type: 'get',   // 推荐使用get完成请求 
    data: {}
    success(){
        // ...
    },
    error(){
        // ...
    }
});
```

13．减少Cookie的大小并进行Cookie隔离

&emsp;&emsp;HTTP请求通常默认带上浏览器端的Cookie一起发送给服务器，所以在非必要的情况下，要尽量减少Cookie来减小HTTP请求的大小。对于静态资源，尽量使用不同的域名来存放，因为Cookie默认是不能跨域的，这样就做到了不同域名下静态资源请求的Cookie隔离。

14．缩小favicon.ico并缓存

&emsp;&emsp;有利于favicon.ico的重复加载，因为一般一个Web应用的favicon.ico是很少改变的。

15．推荐使用异步JavaScript资源

&emsp;&emsp;异步的JavaScript资源不会阻塞文档解析，所以允许在浏览器中优先渲染页面，延后加载脚本执行。例如JavaScript的引用可以如下设置，也可以使用模块化加载机制来实现。

```html
<script src="main.js" defer></script>
<script src="main.js" async></script>
```

使用async时，加载和渲染后续文档元素的过程和main.js的加载与执行是并行的。使用defer时，加载后续文档元素的过程和main.js的加载是并行的，但是main.js的执行要在页面所有元素解析完成之后才开始执行。

16．消除阻塞渲染的CSS及JavaScript

&emsp;&emsp;对于页面中加载时间过长的CSS或JavaScript文件，需要进行合理拆分或延后加载，保证关键路径的资源能快速加载完成。

17．避免使用CSS import引用加载CSS

&emsp;&emsp;CSS中的@import可以从另一个样式文件中引入样式，但应该避免这种用法，因为这样会增加CSS资源加载的关键路径长度，带有@import的CSS样式需要在CSS文件串行解析到@import时才会加载另外的CSS文件，大大延后CSS渲染完成的时间。

```html
<!-- 不推荐 -->
<style>
@import "path/main.css";
</style>

<!-- 推荐 -->
<link rel="stylesheet" href="//cdn1.domain.com/path/main.css">
```

二、 页面渲染类

1．把CSS资源引用放到HTML文件顶部

&emsp;&emsp;一般推荐将所有CSS资源尽早指定在HTML文档`<head>`中，这样浏览器可以优先下载CSS并尽早完成页面渲染。

2．JavaScript资源引用放到HTML文件底部

&emsp;&emsp;JavaScript资源放到HTML文档底部可以防止JavaScript的加载和解析执行对页面渲染造成阻塞。由于JavaScript资源默认是解析阻塞的，除非被标记为异步或者通过其他的异步方式加载，否则会阻塞HTML DOM解析和CSS渲染的过程。

3．不要在HTML中直接缩放图片

&emsp;&emsp;在HTML中直接缩放图片会导致页面内容的重排重绘，此时可能会使页面中的其他操作产生卡顿，因此要尽量减少在页面中直接进行图片缩放。

4．减少DOM元素数量和深度

&emsp;&emsp;HTML中标签元素越多，标签的层级越深，浏览器解析DOM并绘制到浏览器中所花的时间就越长，所以应尽可能保持DOM元素简洁和层级较少。

```html
<!-- 不推荐 -->
<div>
    <span>
        <a href="javascript: void(0);">
            <img src="./path/photo.jpg" alt="图片">
        </a>
    </span>
</div>

<!-- 推荐 -->
<img src="./path/photo.jpg" alt="图片">
```

5．尽量避免使用`<table>`、`<iframe>`等慢元素

&emsp;&emsp;<table>内容的渲染是将table的DOM渲染树全部生成完并一次性绘制到页面上的，所以在长表格渲染时很耗性能，应该尽量避免使用它，可以考虑使用列表元素`<ul>`代替。尽量使用异步的方式动态添加iframe，因为iframe内资源的下载进程会阻塞父页面静态资源的下载与CSS及HTML DOM的解析。

6．避免运行耗时的JavaScript

&emsp;&emsp;长时间运行的JavaScript会阻塞浏览器构建DOM树、DOM渲染树、渲染页面。所以，任何与页面初次渲染无关的逻辑功能都应该延迟加载执行，这和JavaScript资源的异步加载思路是一致的。

7．避免使用CSS表达式或CSS滤镜

&emsp;&emsp;CSS表达式或CSS滤镜的解析渲染速度是比较慢的，在有其他解决方案的情况下应该尽量避免使用。

```css

// 不推荐
.opacity{
    filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);
}
```