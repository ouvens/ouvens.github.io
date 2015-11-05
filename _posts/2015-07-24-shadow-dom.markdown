---
layout: post
title:  "shadow dom解析"
date:   2015-07-24
author: ouven
categories: frontend-javascript
tags:	polymer vm特性
cover:  "assets/category/type-javascript.png"
---

# 1.shadowdom解析

##### 1.1 什么是shadow  dom

先看个例子:

```html
<video controls autoplay name="media"> 
    <source id="mp4" src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
</video>
```
&emsp;&emsp;这样一个标签可以在浏览器产生几个界面你相对较复杂的播放器，怎么做到的?
&emsp;&emsp;为了理解问题，可以选择chrome设置里面的show userAgent shawdow，就可以看到shadow dom里的内容。

```html
<video src="a.mp4" width="480" height="360">
    #shadow root
    <div pseudo="-webkit-media-controls">
        <div pseudo="-webkit-media-controls-overlay-enclosure">
            <input type="button" style="display: none;">
        </div>
        <div pseudo="-webkit-media-controls-enclosure">
            <div pseudo="-webkit-media-controls-panel" style="display: none;">
                <input type="button" pseudo="-webkit-media-controls-play-button">
                <input type="range" step="any" pseudo="-webkit-media-controls-timeline" max="0">
                <div pseudo="-webkit-media-controls-current-time-display" style="display: none;">0:00</div>
                <div pseudo="-webkit-media-controls-time-remaining-display">0:00</div>
                <input type="button" pseudo="-webkit-media-controls-mute-button">
                <input type="range" step="any" max="1" pseudo="-webkit-media-controls-volume-slider" style="display: none;">
                <input type="button" pseudo="-webkit-media-controls-toggle-closed-captions-button" style="display: none;">
                <input type="button" style="display: none;">
                <input type="button" pseudo="-webkit-media-controls-fullscreen-button" style="display: none;">
            </div>
        </div>
    </div>
</video>

```
&emsp;&emsp;shadow-root里面的内容就是所有视频播放器控制组件的所在之处，css也可以看到，可见video标签内部也是很多个div和input形成的。
&emsp;&emsp;另外浏览器之所以将其置灰，是为了表明这部分是在 shadow DOM 里，对于页面的其他部分来说它是 不可用的 。这里的 不可用 意味着你写的 CSS 选择器和 JavaScript 代码都不会影响到这部分内容。实际上，就是让video 标签的逻辑和样式都被浏览器封装了。
#### 1.2 小结
######小结下，Shadow DOM 是一个 HTML 的规范，其允许开发者封装自己的 HTML 标签、CSS 样式和 JavaScript 代码。也使得开发人员可以创建诸如 video这样自定义的一级标签。总的来说，这些新标签和相关的 API 被称为 Web Components。

&emsp;&emsp;关于shadow 都没有些概念可以理解下，上面shadow root是shadow dom的根节点；shadow tree为这个show dom包含的节点树，div和input等；shadow host称为shadow dom的容器元素，即video

# 2.如何创建shadow dom
&emsp;&emsp;指定一个元素可以使用createShadowRoot方法创建一个shadow root，shadow root上可以任意通过dom操作添加shadow tree，同时制定样式和处理的逻辑，并将自己的api暴露出去。
完成创建后需要通过registerElement来注册元素。
（不过需要注意的是，目前支持chrome31、android4.4以上版本）
下面看个示例，是实现一个图文组合的组件功能：

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>图文组合插件</title>
    <!-- 导入组件 -->
    <link href="./image.html" rel="import" />
</head>
<body>
<x-image src="http://9.url.cn/edu/banner/img/aa73d17e_760_300.jpg" width="320" height="150" alt="banner自定义文本"></x-image>
</body>
</html>

```

组价模板的代码文件如下

```html
<!-- 定义组件 -->
<template>
    <!-- 组件模板 -->
    <style>
        /* shadow host内容 */
        :host {
            display: block;
            font: 16px monospace;
        }
        .banner-section{
            margin: 0;
            padding: 0;
            width: 100%;
            display: block;
            position: relative;
        }
        .banner-section .banner-image{
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        .banner-section .banner-text{
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 5px;
            color: #fff;
            background: rgba(0,0,0,0.5);
        }
        .banner-section .banner-text:hover{
            cursor: pointer;
        }
    </style>

    <div class="banner-section">
        <span class="banner-image">
            <img class='image' src="" alt="image" height="200">
        </span>
        <span class="banner-text">MM</span>
    </div>
</template>
<script>
    // 在本文件被导入后自动执行
    (function(thisDoc) {
        "use strict"; // 启用严格模式
 
        // 所有实例元素对象的公共prototype
        var XImage = Object.create(HTMLElement.prototype, {
            height: {
                get: function() { return this._height; },
                set: function(height) {
                    this._height = height;
                    this._innerBanner.style.height = height + 'px';
                    this._innerBanner.querySelector('.image').style.height = height +'px';

                }
            },
            width: {
                get: function() { return this._width; },
                set: function(width) {
                    this._width = width;
                    this._innerBanner.style.width = width + 'px';
                    this._innerBanner.querySelector('.image').style.width = width +'px';
                }
            },
            alt: {
                get: function() { return this._width; },
                set: function(alt) {
                    this._alt = alt;

                    this._innerBanner.querySelector('.banner-text').innerHTML = alt;
                    this._innerBanner.querySelector('.image').setAttribute('alt', alt);
                }
            },
            src: {
                get: function() { return this._src; },
                set: function(src) {
                    this._src = src;
                    this._innerBanner.querySelector('.image').setAttribute('src', src);
                }
            }
        });
        // 组件被创建时执行，相当于构造函数
        XImage.createdCallback = function() {
            // 创建Shadow root，自定义模板放入其中
            var sr = this.createShadowRoot();
            var template = thisDoc.querySelector("template");
            var node = document.importNode(template.content, true);
 
            this._innerBanner = node.querySelector(".banner-section");
            
            var height = this._height || Number(this.getAttribute("height")),
                width = this._width || Number(this.getAttribute("width")),
                alt = this._alt || String(this.getAttribute('alt')),
                src = this._src || String(this.getAttribute('src'));

            if (!isNaN(height) || !isNaN(width)) {
                this.height = height;
                this.width = width;
            }
            if(alt){
                this.alt = alt;
            }
            this.src = src;
            sr.appendChild(node);
        };
        // 注册组件
        document.registerElement("x-image", { prototype: XImage });

    })(document.currentScript.ownerDocument); // ownerDocument指向被导入的文档对象（本文件）
</script>

```

html中使用html import方式引入外部的shadow dom内容，在支持shadow dom的浏览器上显示如下效果，同时在自定义的组件里可以按照自己的需要向外暴露可配置属性和webApi接口。

![](http://7tszky.com1.z0.glb.clouddn.com/FvIroGHVjTDqvFRPu0i1vgg0y2a2)



参考：

http://soledadpenades.com/2014/01/02/shadow-dom-in-firefox/

http://www.w3.org/TR/shadow-dom/