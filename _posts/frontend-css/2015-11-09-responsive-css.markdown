---
layout: post
title:  "响应式架构设计"
date:  2014-11-09
author: ouven
tags: css 响应式
categories: frontend-css
cover: "assets/category/type-css.png"
---

## 响应式页面设计与实现

#### 一、响应式概述

适应不同设备浏览器分辨率或尺寸的样式布局方式。包括响应式布局和响应式媒体两个关键点
    之前的做法：通过判断UA跳转不同页面来适应不同设备浏览器屏幕分辨率下的显示效果。

那么问题来了，UA的问题：

- 依赖设备本身浏览器或设备特点，例如尺寸，屏幕分辨率等。
- 需要分配多个页面跳转适配浏览器。例如：qzone.com，m.qzone.com。

响应式布局和响应式媒体解决了这些问题

#### 二、响应式布局

兼容浏览器分辨率，清晰度，横屏，竖屏的页面元素布局方式。一般使用栅格方式实现。一般情况下是以移动优先，PC端作为一个扩展。

实现方式：
    
**1，meta标签定义**
使用 viewport标签在手机浏览器上控制布局控制不缩放。
    
```html
<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1" />
```

通过快捷方式打开时全屏显示

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
```

  隐藏状态栏
  
```html
<meta name="apple-mobile-web-app-status-bar-style" content="blank" />
```

**2，使用media query适应对应布局**
       
此外目前比较主流可用的栅格系统有

Responsive Grid System
Fluid 960 Grid(adaptjs)
Simple Grid

#### 三、响应式媒体

响应式网站设计最难的就是图片处理了。布局做了响应式处理，在我们手机访问时，请求的图片还是PC上的大图；文件体积大，消耗流量多，请求延时长。响应式媒体要解决的两个关键点是媒体尺寸自适应和屏幕分辨率自适应。

基本思路：

浏览器通过js或css获取用户设备屏幕尺寸，分辨率逻辑处理后输出适应的图片或样式。另外如果用户屏幕是高清屏，还的输出双倍分辨率的图形适应屏幕。

媒体大小自适应解决方案：

**1，使用css背景图片 (依赖media query)**

将图片设计为背景图片，并在css通过media query来加载所需要的背景图片。这样就会根据访问设备的属性来加载形影的图片。但是无法定义页面图片图片属性。
   
**2，picture element (依赖浏览器新特性+midea query)**

W3C已经有一个用于响应式图形的草案：新定义标签<picture>，但因为它还只是草案，目前还没有支持的浏览器，期待在不久的未来我们能用上。虽然目前不支持，但我们还是来了解下这个浏览器的新特性，也和我们一贯的研究方向一致。
<picture>是一个图形元素，内容由多个源图组成，并由CSS Media Queries来适配出合理图形，代码规范如下
 
```html
<picture width="500" height="500">
   <source media="(min-width: 640px)" srcset="large-1.jpg 1x, large-2.jpg 2x">
   <source media="(min-width: 320px)" srcset="med-1.jpg 1x, med-2.jpg 2x">
   <source srcset="small-1.jpg 1x, small-2.jpg 2x">
   <img src="small-1.jpg" alt="">
   <p>Accessible text</p>
   <!-- Fallback content-->
   <noscript>
      <img src="external/imgs/small.jpg" alt="Team photo">
   </noscript>
</picture>


source: 一个图片源；
media: 媒体查询，用于适配屏幕尺寸；
srcset: 图片链接，1x适应普通屏，2x适应高清屏；
<noscript/>: 当浏览器不支持脚本时的一个替代方案；
<img/>: 初始图片；另外还有一个无障碍文本，类似<img/>的alt属性。
<picture>目前还不支持，但它的原理我们是可借鉴的，所以就诞生了一个用于图片响应式处理的类库picturefill
```

**3，picturefill (依赖js+media query)**

https://github.com/scottjehl/picturefill
http://scottjehl.github.io/picturefill/
  
可以认为是picture元素的一个polyfill，(什么是polyfill？晶哥第一次沙龙讲过，就是修复浏览器特性不支持的"腻子")。
未来我们可能使用picture元素来进行图片在页面的适应。而picturefill是w3c提供的最新的针对响应式图片的设计方案，但是需要浏览器支持picture属性，原理就是JS获取Source的源以及CSS Media Queries规则，输出适应图片。
    
这个是picturefill实现的部分源码，大致看了一下，原理就是使用javascript来解析picture元素定义的标签，来在页面上强行使用picture类似元素。但是个人觉得性能方面值得去考虑。

**4，adaptive-images**

http://adaptive-images.com/

实现原理是浏览器访问服务器图片时带上浏览器的窗口信息，服务器获取后根据窗口信息获取相对应的图片返回。
这是一个服务端解决方案，优点：一是不用更改现有的HTML标签结构，因此可快捷地应用于过去的项目；二是对于任何图片，包括JS添加的，都会起作用，即图片宽度不会大于浏览器宽度，三是由于其采用服务端解决方案，兼容性很广。
    但是，其缺点也是明显的：首先，其依赖Cookie和JS，浏览器信息需要通过js存放cookie，发送时放在头部发送，这导致一些禁用或不能使用Cookie和JS的浏览器不能使用。然后是其对所有图片都起作用，这不适用于那些需要加载大图片的情形；最后，不适用于CDN，因为图片都是针对特定设备即时生成的，我觉得可以修改后端代码做


**5，responsive-images.js(依赖js)**

   官网：https://github.com/kvendrik/responsive-images.js
   这个与picturefill类似，不过它不依赖media query，而是通过JS检测浏览器的可见视口宽度来决定选择合适的图片，因此其兼容性很广，所有的主流浏览器。同时也不需要额外的标签，而是需要额外的属性，但是它不支持JS添加的图片，至少目前还不支持。
 
```html
<img alt='kitten!' data-src-base='demo/images/' data-src='<480:smallest.jpg,
 <768:small.jpg,<960:medium.jpg,>960:big.jpg' />
```

屏幕分辨率自适应方案：

主要是解决高清屏(retina屏)的问题，由于高清屏与普通屏幕有所区别：
    
由于高清屏的特性，1px是由2×2个像素点来渲染，那么我们样式上的border:1px在Retina屏下会渲染成2px的边框，与设计稿有出入，为了追求1px精准还原，我们就不得不拿出一个完美的解决方案。(此处没去深究)
   JS检测是否高清屏：var retina = window.devicePixelRatio > 1;
    例如一个边框的
    
```css
@media only screen and (-webkit-min-device-pixel-ratio:2),
       only screen and (min-device-pixel-ratio:2) {
button {
  border:none;
  padding:0 16px;
  background-size: 50% 50%;
}
```

#### 四、响应式javascript

这里主要通过环境判断来异步加载不同的javascript，这样就实现了安装浏览器环境来加载了，例如

```javascript

if(isMobile){
    require.async(['zepto', './mobileMain'], function($, main){
        main.init();
    });
}else{
    require.async(['jquery', './main'], function($, main){
        main.init();
    });
}

```

#### 五、响应式网站架构设计

(1) 简单网站的响应式结构

使用media query指定屏幕适应属性实现网页自适应，不同设备下的css写在一个文件内，css按模块管理。模块分开，易于管理和编码实现，也便于维护，是中小型网站实现响应式的不二选择。

缺点：对于样式复杂的网站没有拆分，不能根据对应屏幕加载对应样式，造成带宽浪费；不利于优化和cdn。


(2) 分流响应式站点

javascript根据UA特性来加载不同域下的css，可以尽可能避免使用media query，不同浏览器环境下的样式分离管理，实现了平台样式分离，易于cdn管理。

缺点：需要维护多套样式表，即使公共部分抽离，一旦修改，影响多个平台环境；需要判断UA；架构实现稍微复杂。
    
(3) 后台页面直出

和adaptive-images实现方法类似，首先是建立在不同环境下样式分离管理的基础上，后台根据静态文件请求所带的cookie信息直出静态页面，拉取相对应的css。

缺点：需要依赖cookie机制，服务器需要进行处理。(不过这层直出可以使用node中间服务获取，由这层服务请求后台，再返回给前端)

目前对于架构这块理解还不是很透，只了解粗略的原理，还需要继续深入理解。
    

   




