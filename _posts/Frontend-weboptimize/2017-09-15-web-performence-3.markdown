---
layout: post
title:  "前端性能优化（三） 移动端浏览器前端优化策略"
date:   2017-09-15
author: ouven
tags: 前端性能优化 前端性能分析 移动浏览器 前端优化策略
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---


&emsp;&emsp;相对于桌面端浏览器，移动端Web浏览器上有一些较为明显的特点：设备屏幕较小、新特性兼容性较好、支持一些较新的HTML5和CSS3特性、需要与Native应用交互等。但移动端浏览器可用的CPU计算资源和网络资源极为有限，因此要做好移动端Web上的优化往往需要做更多的事情。首先，在移动端Web的前端页面渲染中，桌面浏览器端上的优化规则同样适用，此外针对移动端也要做一些极致的优化来达到更好的效果。需要注意的是，并不是移动端的优化原则在桌面浏览器端就不适用，而是由于兼容性和差异性的原因，一些优化原则在移动端更具代表性。

#### 一、网络加载类

1．首屏数据请求提前，避免JavaScript文件加载后才请求数据


&emsp;&emsp;为了进一步提升页面加载速度，可以考虑将页面的数据请求尽可能提前，避免在JavaScript加载完成后才去请求数据。通常数据请求是页面内容渲染中关键路径最长的部分，而且不能并行，所以如果能将数据请求提前，可以极大程度上缩短页面内容的渲染完成时间。

2．首屏加载和按需加载，非首屏内容滚屏加载，保证首屏内容最小化


&emsp;&emsp;由于移动端网络速度相对较慢，网络资源有限，因此为了尽快完成页面内容的加载，需要保证首屏加载资源最小化，非首屏内容使用滚动的方式异步加载。一般推荐移动端页面首屏数据展示延时最长不超过3秒。目前中国联通3G的网络速度为338KB/s（2.71Mb/s），所以推荐首屏所有资源大小不超过1014KB，即大约不超过1MB。

3．模块化资源并行下载


&emsp;&emsp;在移动端资源加载中，尽量保证JavaScript资源并行加载，主要指的是模块化JavaScript资源的异步加载，例如AMD的异步模块，使用并行的加载方式能够缩短多个文件资源的加载时间。

4．inline首屏必备的CSS和JavaScript


&emsp;&emsp;通常为了在HTML加载完成时能使浏览器中有基本的样式，需要将页面渲染时必备的CSS和JavaScript通过`<script>`或`<style>`内联到页面中，避免页面HTML载入完成到页面内容展示这段过程中页面出现空白。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>样例</title>
    <meta name="viewport" content="width=device-width,minimum-scale=1.0, maximum-scale=1.0,user-scalable=no">
    <style>
    /* 必备的首屏CSS */
    html, body{
        margin: 0;
        padding: 0;
        background-color: #ccc;
    }
    </style>
</head>
<body>
</body>
</html>
```

5．meta dns prefetch设置DNS预解析


&emsp;&emsp;设置文件资源的DNS预解析，让浏览器提前解析获取静态资源的主机IP，避免等到请求时才发起DNS解析请求。通常在移动端HTML中可以采用如下方式完成。

```html
<!-- cdn域名预解析 -->
<meta http-equiv="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="//cdn.domain.com">
```

6．资源预加载

&emsp;&emsp;对于移动端首屏加载后可能会被使用的资源，需要在首屏完成加载后尽快进行加载，保证在用户需要浏览时已经加载完成，这时候如果再去异步请求就显得很慢。

7．合理利用MTU策略


&emsp;&emsp;通常情况下，我们认为TCP网络传输的最大传输单元（Maximum Transmission Unit，MTU）为1500B，即网络一个RTT（Round-Trip Time，网络请求往返时间）时间内可以传输的数据量最大为1500字节。因此，在前后端分离的开发模式中，尽量保证页面的HTML内容在1KB以内，这样整个HTML的内容请求就可以在一个RTT时间内请求完成，最大限度地提高HTML载入速度。

#### 二、缓存类

1．合理利用浏览器缓存

&emsp;&emsp;除了上面说到的使用Cache-Control、Expires、Etag和Last-Modified来设置HTTP缓存外，在移动端还可以使用localStorage等来保存AJAX返回的数据，或者使用localStorage保存CSS或JavaScript静态资源内容，实现移动端的离线应用，尽可能减少网络请求，保证静态资源内容的快速加载。

2．静态资源离线方案


&emsp;&emsp;对于移动端或Hybrid应用，可以设置离线文件或离线包机制让静态资源请求从本地读取，加快资源载入速度，并实现离线更新。关于这块内容，我们会在后面的章节中重点讲解。

3．尝试使用AMP HTML


&emsp;&emsp;AMP HTML可以作为优化前端页面性能的一个解决方案，使用AMP Component中的元素来代替原始的页面元素进行直接渲染。

```html
<!-- 不推荐 -->
<video width="400" height="300" src="http://www.domain.com/videos/myvideo.mp4" poster="path/poster.jpg">
    <div fallback>
        <p>Your browser doesn’t support HTML5 video</p>
    </div>
    <source type="video/mp4" src="foo.mp4">
    <source type="video/webm" src="foo.webm">
</video>


<!-- 推荐 -->
<amp-video width="400" height="300" src="http://www.domain.com/videos/myvideo.mp4" poster= "path/poster.jpg">
    <div fallback>
        <p>Your browser doesn’t support HTML5 video</p>
    </div>
    <source type="video/mp4" src="foo.mp4">
    <source type="video/webm" src="foo.webm">
</amp-video>
```

#### 三、图片类

1．图片压缩处理


&emsp;&emsp;在移动端，通常要保证页面中一切用到的图片都是经过压缩优化处理的，而不是以原图的形式直接使用的，因为那样很消耗流量，而且加载时间更长。

2．使用较小的图片，合理使用base64内嵌图片


&emsp;&emsp;在页面使用的背景图片不多且较小的情况下，可以将图片转化成base64编码嵌入到HTML页面或CSS文件中，这样可以减少页面的HTTP请求数。需要注意的是，要保证图片较小，一般图片大小超过2KB就不推荐使用base64嵌入显示了。

```css
.class-name {
       background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAALCAMAAABxsOwqAAAAYFBMVEWnxwusyQukxQudwQyZvgyhxAyfwgyxzAsUHQGOuA0aJAERGAFIXwSTugyEqgtqhghQZgUwQQIpOQKbuguVtQuKrAuCowp2kQlheghTbQZHWQU7SwVAVgQ6TgQlLwMeKwFOemyQAAAAVElEQVQI1y3JVRaAIAAF0UconXbvf5ei8HfPDIQQhBAAFE10iKig3SLRNN4SP/p+N08VC0YnfIlNWtqIkhg/TPYbCvhqdHAWRXPZSp3g3CWZvVLXC6OJA3ukv0AaAAAAAElFTkSuQmCC');
}
```

3．使用更高压缩比格式的图片


&emsp;&emsp;使用具有较高压缩比格式的图片，如webp等。在同等图片画质的情况下，高压缩比格式的图片体积更小，能够更快完成文件传输，节省网络流量。

```html
<img src="//cdn.domain.com/path/photo.webp" alt="webp格式图片">
```

4．图片懒加载


&emsp;&emsp;为了保证页面内容的最小化，加速页面的渲染，尽可能节省移动端网络流量，页面中的图片资源推荐使用懒加载实现，在页面滚动时动态载入图片。

```html
<img data-src="//cdn.domain.com/path/photo.jpg" alt="懒加载图片">
```

5．使用Media Query或srcset根据不同屏幕加载不同大小图片


&emsp;&emsp;在介绍响应式的章节中我们了解到，针对不同的移动端屏幕尺寸和分辨率，输出不同大小的图片或背景图能保证在用户体验不降低的前提下节省网络流量，加快部分机型的图片加载速度，这在移动端非常值得推荐。

6．使用iconfont代替图片图标


&emsp;&emsp;在页面中尽可能使用iconfont来代替图片图标，这样做的好处有以下几个：使用iconfont体积较小，而且是矢量图，因此缩放时不会失真；可以方便地修改图片大小尺寸和呈现颜色。但是需要注意的是，iconfont引用不同webfont格式时的兼容性写法，根据经验推荐尽量按照以下顺序书写，否则不容易兼容到所有的浏览器上。

```css
@font-face {
    font-family: iconfont;
    src: url("./iconfont.eot");
    src: url("./iconfont.eot?#iefix") format("eot"),
         url("./iconfont.woff") format("woff"),
         url("./iconfont.ttf") format("truetype");
}
```

7．定义图片大小限制


&emsp;&emsp;加载的单张图片一般建议不超过30KB，避免大图片加载时间长而阻塞页面其他资源的下载，因此推荐在10KB以内。如果用户上传的图片过大，建议设置告警系统，帮助我们观察了解整个网站的图片流量情况，做出进一步的改善。

#### 四、脚本类

1．尽量使用id选择器


&emsp;&emsp;选择页面DOM元素时尽量使用id选择器，因为id选择器速度最快。

2．合理缓存DOM对象


&emsp;&emsp;对于需要重复使用的DOM对象，要优先设置缓存变量，避免每次使用时都要从整个DOM树中重新查找。

```javascript
// 不推荐
$('#mod .active').remove('active');
$('#mod .not-active').addClass('active');

// 推荐
let $mod = $('#mod');
$mod.find('.active').remove('active');
$mod.find('.not-active').addClass('active');
```

3．页面元素尽量使用事件代理，避免直接事件绑定


&emsp;&emsp;使用事件代理可以避免对每个元素都进行绑定，并且可以避免出现内存泄露及需要动态添加元素的事件绑定问题，所以尽量不要直接使用事件绑定。

```javascript
// 不推荐
$('.btn').on('click', function(e){
    console.log(this);
});

// 推荐
$('body').on('click', '.btn', function(e){
    console.log(this);
});
```

4．使用touchstart代替click


&emsp;&emsp;由于移动端屏幕的设计，touchstart事件和click事件触发时间之间存在300毫秒的延时，所以在页面中没有实现touchmove滚动处理的情况下，可以使用touchstart事件来代替元素的click事件，加快页面点击的响应速度，提高用户体验。但同时我们也要注意页面重叠元素touch动作的点击穿透问题。

```javascript
// 不推荐
$('body').on('click', '.btn', function(e){
    console.log(this);
});

// 推荐
$('body').on('touchstart', '.btn', function(e){
    console.log(this);
});
```

5．避免touchmove、scroll连续事件处理


&emsp;&emsp;需要对touchmove、scroll这类可能连续触发回调的事件设置事件节流，例如设置每隔16ms（60帧的帧间隔为16.7ms，因此可以合理地设置为16ms）才进行一次事件处理，避免频繁的事件调用导致移动端页面卡顿。

```javascript
// 不推荐
$('.scroller').on('touchmove', '.btn', function(e){
    console.log(this);
});

// 推荐
$('.scroller').on('touchmove', '.btn', function(e){
    let self = this;
    setTimeout(function(){
        console.log(self);
    }, 16);
});
```

6．避免使用eval、with，使用join代替连接符+，推荐使用ECMAScript 6的字符串模板


&emsp;&emsp;这些都是一些基础的安全脚本编写问题，尽可能使用较高效率的特性来完成这些操作，避免不规范或不安全的写法。

7．尽量使用ECMAScript 6+的特性来编程


&emsp;&emsp;ECMAScript 6+一定程度上更加安全高效，而且部分特性执行速度更快，也是未来规范的需要，所以推荐使用ECMAScript 6+的新特性来完成后面的开发。

#### 五、渲染类

1．使用Viewport固定屏幕渲染，可以加速页面渲染内容


&emsp;&emsp;一般认为，在移动端设置Viewport可以加速页面的渲染，同时可以避免缩放导致页面重排重绘。在移动端固定Viewport设置的方法如下。

```html
<!-- 设置viewport不缩放 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

2．避免各种形式重排重绘


&emsp;&emsp;页面的重排重绘很耗性能，所以一定要尽可能减少页面的重排重绘，例如页面图片大小变化、元素位置变化等这些情况都会导致重排重绘。

3．使用CSS3动画，开启GPU加速


&emsp;&emsp;使用CSS3动画时可以设置transform: translateZ(0)来开启移动设备浏览器的GPU图形处理加速，让动画过程更加流畅。

```css
-webkit-transform: translateZ(0);
-ms-transform: translateZ(0);
-o-transform: translateZ(0);
transform: translateZ(0);
```

4．合理使用Canvas和requestAnimationFrame


&emsp;&emsp;选择Canvas或requestAnimationFrame等更高效的动画实现方式，尽量避免使用setTimeout、setInterval等方式来直接处理连续动画。

5．SVG代替图片


&emsp;&emsp;部分情况下可以考虑使用SVG代替图片实现动画，因为使用SVG格式内容更小，而且SVG DOM结构方便调整。

6．不滥用float


&emsp;&emsp;在DOM渲染树生成后的布局渲染阶段，使用float的元素布局计算比较耗性能，所以尽量减少float的使用，推荐使用固定布局或flex-box弹性布局的方式来实现页面元素布局。

7．不滥用web字体或过多font-size声明


&emsp;&emsp;过多的font-size声明会增加字体的大小计算，而且也没有必要的。

#### 六、架构协议类

1．尝试使用SPDY和HTTP 2


&emsp;&emsp;在条件允许的情况下可以考虑使用SPDY协议来进行文件资源传输，利用连接复用加快传输过程，缩短资源加载时间。HTTP 2在未来也是可以考虑尝试的。

2．使用后端数据渲染


&emsp;&emsp;使用后端数据渲染的方式可以加快页面内容的渲染展示，避免空白页面的出现，同时可以解决移动端页面SEO的问题。如果条件允许，后端数据渲染是一个很不错的实践思路。后面的章节会详细介绍后端数据渲染的相关内容。

3．使用Native View代替DOM的性能劣势


&emsp;&emsp;可以尝试使用Native View的MNV*开发模式来避免HTML DOM性能慢的问题，目前使用MNV*的开发模式已经可以将页面内容渲染体验做到接近客户端Native应用的体验了。


&emsp;&emsp;关于页面优化的常用技术手段和思路主要包括以上这些，尽管列举出很多，但仍可能有少数遗漏，可见前端性能优化不是一件简简单单的事情，其涉及的内容很多。大家可以根据实际情况将这些方法应用到自己的项目当中，要想全部做到几乎是不可能的，但做到用户可接受的原则还是很容易实现的。


&emsp;&emsp;于此同时我们要清楚的是，在我们做到了极致优化的同时也付出了很大的代价，这也是前端优化的一个问题。理论上这些优化都是可以实现的，但是作为工程师我们也要明白懂得权衡。优化提升了用户体验，使数据加载更快，但是项目代码却可能打乱，异步内容要拆分出来，首屏的一个雪碧图可能要分成两个，页面项目代码维护成本成倍增加，项目结构也可能变得混乱。所以前期在设计构建、组件的解决方案时要解决好异步的自动处理问题。任何一部分优化都可以做得很深入，但不一定都值得，在优化的同时也要尽量考虑性价比，这才是我们作为一名前端工程师处理前端优化时应该具有的正确思维。

&emsp;&emsp;本文摘自书籍[《现代前端技术解析》](http://jixianqianduan.com/frontend-resource/2017/04/10/modern-front-end-theroy.html)。
 