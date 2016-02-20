---
layout: post
title:  "web前端响应式设计总结"
date:  2016-01-15
author: ouven
tags: web前端 响应式 腾讯课堂
categories: frontend-css
cover: "assets/category/type-css.png"
---

## web前端响应式设计总结

#### 一、响应式概述

&emsp;&emsp;响应式是指根据不同设备浏览器分辨率或尺寸来展示不同页面结构、行为、表现的设计方式。这里总结了响应式网站设计需要涉及到的相关的内容，有不正确的欢迎大家指正。谈到响应式网站，目前比较主流的做法是通过前端通过判断userAgent来做页面的302跳转。

那么问题来了，使用userAgent的问题：

- 依赖设备本身浏览器或设备特点，例如尺寸，屏幕分辨率等。
- 需要分配多个站点页面跳转适配浏览器。例如：ke.qq.com，m.ke.qq.com，来分别存放PC端和移动端的页面。
- 多了一次跳转，跳转之前的逻辑不能少，这样用户体验就慢了

&emsp;&emsp;当然我们也都知道像bootstrap这种ui框架也是响应式的，即写一份代码，在浏览器和移动端都能跑，然而事实上这些事远远不够的，而且在移动端为什么要加载那么多PC端的内容？

&emsp;&emsp;我们理解的是完整的响应式页面的设计不仅仅是通过屏幕尺寸来动态改变页面容器的宽度等，其实大部分人通常理解的都停留在这个方面。完整的响应式网站的实现其实需要考虑到以下这些问题：**响应式布局**、**响应式html和css**、**响应式媒体**、**响应式javascript**。

先看几个线上的样例：

http://ke.qq.com/huodong/shengkao/index.html
http://ke.qq.com/huodong/yikao2016/index.html
http://ke.qq.com/huodong/nianzhongppt/index.html

&emsp;&emsp;这些页面在移动端和PC端使用同一个页面(大家可以用chrome浏览器一下)，这样就避免了多余的302跳转，另外页面布局、逻辑、图片等内容都通过不同浏览器来适应。下面具体讲下各个部分的实现所涉及的内容。

#### 二、响应式布局

&emsp;&emsp;响应式布局是用来兼容浏览器分辨率，清晰度，横屏，竖屏的页面元素布局方式。一般使用栅格方式实现。时间思路有两种，一种是PC端优先，另一种是以移动优先，PC端作为一个扩展。由于移动端的资源比较优先，一般比较推荐从移动端扩展到PC端，这样就避免了在移动端加载多余的PC端内容。响应式布局主要可以结合几种实现方式：
    
**1，移动端布局控制**

使用 viewport标签在手机浏览器上控制布局控制不缩放等通用定义。
    
```html
<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1" />
<meta name="apple-mobile-web-app-status-bar-style" content="blank" />
```

由于这些定义在移动端必须定义，这里还是需要定义，用到PC端也不影响，只是有些多余。

**2，普通元素的栅格布局**
       
对于普通的div布局，使用了通用简单的栅格布局，相信这个大家都知道原理：

```css
.row{
  width: 100%;
}
.row .col-1 {
  width: 8.33333333333%
}

.row .col-2 {
  width: 16.6666666667%
}

/* ...比较多，这里省略 */

.row .col-12 {
  width: 100%
}
```

这里借鉴了其它的一下栅格系统的设计：
Responsive Grid System
Fluid 960 Grid(adaptjs)
Simple Grid

**3，不同设备元素容器布局**

&emsp;&emsp;通用栅格布局并不能解决我们全部的问题，例如某个页面板块列表，PC端一排展示4个，移动端一排展示2两个，使用栅格的话我们就需要重新定义.col-3和.col-6了。对于这种情况我们的处理方法也比较简单
&emsp;&emsp;对于移动端浏览器，通过简单的js逻辑判断，在html的body中加入mobile的内容，在body里面的相同元素使用不同的宽度布局的方式。这种方式订制化坚强，如果宽度布局用的不多，即可以使用这种不同宽度布局的方式来实现。这样就实现了一个普通div在移动端和PC端的不同布局。

```css
  .container{
    width: 25%;
  }
  .mobile .container{
    width: 50%;
  }
```

#### 三、响应式html与css
  
&emsp;&emsp;这两个结合起来介绍是因为这两个比较强相关。由于移动端页面的html可能相对简单，但是扩展到PC会增加额外的html结构，例如下面截图中的框中部分，在移动端时不显示或显示另一种样式，例如下面两图对比。那我们如何做到两个平台两种不同展示呢？

![](http://7tszky.com1.z0.glb.clouddn.com/FkKIUveEN5Jq3a752ICPxQU4-Gmy)

![](http://7tszky.com1.z0.glb.clouddn.com/Fpveyyy5IDVxFLcUHrIWoZ18fY3H)

&emsp;&emsp;方法思路一：使用相同html结构，对于要在移动端要隐藏的dom元素，可以通过display:  none来控制html是否显示；对于展示样式不同的，需要在PC端额外引入css覆盖移动端的原有样式（之前说过了，PC端资源相对移动端比较充裕，PC端可以接受额外增减少量的css文件来实现响应式）。

&emsp;&emsp;方法思路二：动态使用js渲染不同内容，但是这样会增加移动端js大小，而且css样式文件必不可少。相比之下，我们使用了思路一的方案。其实使用js的渲染方案也是可以的，不过毕竟保留html比使用js简单。

&emsp;&emsp;讲到这里相信大家也都懂了。

#### 四、响应式媒体

&emsp;&emsp;响应式网站设计比较复杂的就是图片媒体处理了。布局做了响应式处理，但是在我们手机访问时，请求的图片还是PC浏览器上请求的大图；文件体积大，消耗流量多，请求延时长。响应式媒体要解决的两个关键点是媒体尺寸自适应和屏幕分辨率自适应。当然这里使用到的媒体主要指图片，但要明白的是，不仅仅只有图片。

&emsp;&emsp;先看看一般的媒体大小自适应解决方案，我们没有使用这里的方案，而是结合借鉴了这里的思路，而且我们也有必要了解这些解决方案。

**1，使用css背景图片 (依赖media query)**

&emsp;&emsp;将图片设计为背景图片，并在css通过media query来加载所需要的背景图片。这样就会根据访问设备的属性来加载形影的图片。但是无法定义页面图片图片属性。
   
**2，picture element (依赖浏览器新特性+midea query)**

&emsp;&emsp;W3C已经有一个用于响应式图形的草案：新定义标签<picture>，但因为它还只是草案，目前还没有支持的浏览器，期待在不久的未来我们能用上。虽然目前不支持，但我们还是来了解下这个浏览器的新特性，也和我们一贯的研究方向一致。
picture是一个图形元素，内容由多个源图组成，并由CSS Media Queries来适配出合理图形，代码规范如下
 
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

&emsp;&emsp;https://github.com/scottjehl/picturefill
&emsp;&emsp;http://scottjehl.github.io/picturefill/
  
&emsp;&emsp;可以认为是picture元素的一个polyfill，(什么是polyfill？晶哥第一次沙龙讲过，就是修复浏览器特性不支持的"腻子")。
未来我们可能使用picture元素来进行图片在页面的适应。而picturefill是w3c提供的最新的针对响应式图片的设计方案，但是需要浏览器支持picture属性，原理就是JS获取Source的源以及CSS Media Queries规则，输出适应图片。
    
这个是picturefill实现的部分源码，大致看了一下，原理就是使用javascript来解析picture元素定义的标签，来在页面上强行使用picture类似元素。但是个人觉得性能方面值得去考虑。

**4，adaptive-images**

http://adaptive-images.com/

&emsp;&emsp;实现原理是浏览器访问服务器图片时带上浏览器的窗口信息，服务器获取后根据窗口信息获取相对应的图片返回。
这是一个服务端解决方案，优点：一是不用更改现有的HTML标签结构，因此可快捷地应用于过去的项目；二是对于任何图片，包括JS添加的，都会起作用，即图片宽度不会大于浏览器宽度，三是由于其采用服务端解决方案，兼容性很广。
&emsp;&emsp;但是，其缺点也是明显的：首先，其依赖Cookie和JS，浏览器信息需要通过js存放cookie，发送时放在头部发送，这导致一些禁用或不能使用Cookie和JS的浏览器不能使用。然后是其对所有图片都起作用，这不适用于那些需要加载大图片的情形；最后，不适用于CDN，因为图片都是针对特定设备即时生成的，我觉得可以修改后端代码做


**5，responsive-images.js(依赖js)**

&emsp;&emsp;官网：https://github.com/kvendrik/responsive-images.js
&emsp;&emsp;这个与picturefill类似，不过它不依赖media query，而是通过JS检测浏览器的可见视口宽度来决定选择合适的图片，因此其兼容性很广，所有的主流浏览器。同时也不需要额外的标签，而是需要额外的属性，但是它不支持JS添加的图片，至少目前还不支持。
 
```html
<img alt='kitten!' data-src-base='demo/images/' data-src='<480:smallest.jpg,
 <768:small.jpg,<960:medium.jpg,>960:big.jpg' />
```

**6，不同屏幕分辨率自适应方案**

&emsp;&emsp;主要是解决高清屏(retina屏)的问题，由于高清屏与普通屏幕有所区别：
    
&emsp;&emsp;由于高清屏的特性，1px是由2×2个像素点来渲染，那么我们样式上的border:1px在Retina屏下会渲染成2px的边框，与设计稿有出入，为了追求1px精准还原，我们就不得不拿出一个完美的解决方案。(此处没去深究)JS检测是否高清屏：var retina = window.devicePixelRatio > 1;
&emsp;&emsp;例如一个边框的
    
```css
@media only screen and (-webkit-min-device-pixel-ratio:2),
       only screen and (min-device-pixel-ratio:2) {
button {
  border:none;
  padding:0 16px;
  background-size: 50% 50%;
}
```

**结合实现思路：**
&emsp;&emsp;然而这里没有一种单一方案能满足我们的需求，不过借鉴这些思路的处理过程，我们的处理思路也基本类似：由于这里的图片数据是异步拉取渲染的，而且我们的图片加载选择和屏幕宽度无关，和浏览器设备相关，那就可以通过浏览器通过js(或css)获取用户设备类型、分辨率，然后通过判断用户设备输出适应的大小图片图片的dom结构，另外如果用户屏幕是高清屏，还的输出双倍分辨率的图片适应屏幕。



#### 五、响应式javascript

&emsp;&emsp;真正的响应式设计的网站，处理使用不同的布局、html、css和图片，还需要根据浏览器环境来异步加载不同的js文件。和之前思路一样，这里我们主要通过设备环境判断来异步加载不同的javascript，下面这样就实现了安装浏览器环境来加载了

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

&emsp;&emsp;这样就有效保证了当时移动端时加载移动端需要的js同时避免了多余的js文件的下载。至于这里如何打包，就是另一个问题了，而且有点坑要填，这里开始我们没有处理好判断逻辑打包的问题，后来通过自己开发构建插件实现这个逻辑的打包。

#### 六、一般响应式网站架构

&emsp;&emsp;这里实际不是我们的实现部分，而且不符合我们的需求，后台部署实现也复杂，但是这里还是总结补充梳理一下来做完整地做个总结。

(1) 简单网站的响应式结构

&emsp;&emsp;使用media query指定屏幕适应属性实现网页自适应，不同设备下的css写在一个文件内，css按模块管理。模块分开，易于管理和编码实现，也便于维护，是中小型网站实现响应式的不二选择。

缺点：对于样式复杂的网站没有拆分，不能根据对应屏幕加载对应样式，造成带宽浪费；不利于优化和cdn。


(2) 分流响应式站点

&emsp;&emsp;javascript根据userAgent特性来加载不同域下的css，可以尽可能避免使用media query，不同浏览器环境下的样式分离管理，实现了平台样式分离，易于cdn管理。

缺点：需要维护多套样式表，即使公共部分抽离，一旦修改，影响多个平台环境；需要判断UA；架构实现稍微复杂。
    
(3) 后台页面直出

&emsp;&emsp;和adaptive-images实现方法类似，首先是建立在不同环境下样式分离管理的基础上，后台根据静态文件请求所带的cookie信息直出静态页面，拉取相对应的css。

缺点：需要依赖cookie机制，服务器需要进行处理。(不过这层直出可以使用node中间服务获取，由这层服务请求后台，再返回给前端)

#### 七、总结

&emsp;&emsp;再来回头看下本文总结了啥，还是回到开头的几个问题，响应式网站设计实现包含的几个方面：**响应式布局**、**响应式html和css**、**响应式媒体**、**响应式javascript**，总结了较多别人的实现方案，也提出了我们的实践方法，另外补充了下通用的响应式架构。这里就先总结到这里，另外，有不准确的欢迎拍砖。