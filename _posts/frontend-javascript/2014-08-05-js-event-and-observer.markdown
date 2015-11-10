---
layout: post
title:  "javascript基础--突变事件与观察者事件"
date: 2014-08-05
author: ouven
tags: javascript基础 突变事件 
categories: frontend-javascript
cover: "assets/category/type-javascript.png"
---

### 一、问题背景

#### 1.1、发现问题

首先有这样一个问题，就是页面title后面莫名其妙hash值

这是一个带有flash的播放页面，开始，觉得这个问题我十分钟能搞定发到外网，测试同学稍等。十分钟过后我哭了~

### 二、问题描述

问题重现在IE环境下，如果页面有flash内容embed嵌入，同时页面URL中带有hash，在flash加载后会改变document.title，而且后面js每次和flash交互都会改变document.title，就是把hash内容加到title后面(http://code.google.com/p/swfobject/issues/detail?id=293)。这个被定义为IE的bug，怎么解决？
http://stackoverflow.com/questions/4562423/ie-title-changes-to-afterhash-if-the-page-has-a-url-with-and-has-flash-s
然后有了这个解决方案。

```javascript
var originalTitle = document.title.split("#")[0];   
document.attachEvent && document.attachEvent('onpropertychange', function (evt) {
    if(evt.propertyName === 'title' && document.title !== originalTitle) {
setTimeout(function () {
            document.title = originalTitle;
        }, 1);
    }
});
  
//使用document.title=newtitle设置标题属性
function changeTitle(newTitle){
    originalTitle = newTitle;
    document.title = newtitle;
}
changeTitle(originalTitle);
```
这里的方案是监听IE中document的propertychang事件，当flash改变document.title时，把title设置回来。当然也有人提出使用在flash操作时据改变，但是flash交互的地方太多了，而且改变时也会有个title闪一下的问题。除此之外，还想没有其它的好办法了。
然后，使用了这段推荐方法并没有解决所有的问题，因为有几点被忽略了：
(1) atatchEvent不是所有IE浏览器都能用的。这点好解决，兼容下就好了。
(2) propertychangge也不是所有IE浏览器能用的。这点还有什么方法可以去兼容实现呢？

因为IE11跟之前的IE又不一样了。
- (1) propertychange已经不被IE11支持了(http://stackoverflow.com/questions/24795769/propertychange-not-working-in-ie11

- (2) attachEvent也被IE11放弃了
所以这段代码要改成这样：

```javascript
var originalTitle = document.title.split("#")[0];    
var isIE11OrGreater = !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv:11.0/)); // IE11

document.attachEvent && document.attachEvent('onpropertychange', function (evt) {
    if(evt.propertyName === 'title' && document.title !== originalTitle) {
        setTimeout(function () {
           document.title = originalTitle;
        }, 1);
    }
});

/**
 * IE 9的突变事件模型，使用DOMCharacterDataModified才行，ie11使用dom3事件模型，弃用了突变观察者
 * https://msdn.microsoft.com/library/bg182625(v=vs.85).aspx, 这里有较详细的介绍
 * 
 */
isIE11OrGreater && document.addEventListener && document.addEventListener('DOMCharacterDataModified', function (evt) {
    if(document.title !== originalTitle) {
        setTimeout(function () {
           document.title = originalTitle;
        }, 1);
    }
});

function changeTitle(newTitle){
    originalTitle = newTitle;
    document.title = newTitle;
}

changeTitle(originalTitle);

```

这样为什么能解决？简单的解释是IE9使用addEventListener代替了原来的attachEvent处理事件，并且支持新的DOMCharacterDataModified突变事件。而ie9以后不再使用propertychange。

### 二、突变事件

#### 2.1、什么是突变事件？
先看看普通的事件模型。下面这个图都见过，事件的机制、兼容性和实现，就不赘述了。

#### 2.2、那突变事件有什么不同？
突变事件是指在dom元素改变时会触发的事件。例如

DOMAttrModified 突变事件报告对元素的属性列表的更改。此单一事件包括与插入、删除或更改属性相关的信息。

DOMNodeInserted、DOMNodeRemoved 和 DOMSubtreeModified 

突变事件监视元素子项的结构更改，例如向元素子项添加了元素或者删除了元素子项。

注意  对于未反映在 HTML 属性中的属性（例如 input 元素上的 value），可以使用称为“defineProperty”的 ECMAScript 5 (JavaScript) 功能。本文档不介绍如何使用该对象迁移属性更改事件。defineProperty JavaScript API。例如json对象的属性改变等不属于突变事件。

#### 突变事件观察者
什么是突变事件观察者，和普通事件模型的有什么不同？
突变观察者不是基于 Web 平台的事件模型。这是一个重用区别，这使它们能够更快地进行分派，而无需在 DOM 元素层次结构中对事件执行冒泡操作。
 
而且，突变观察者的目标是在通知你的观察者之前记录多项更改。它们批量提供突变记录，以避免在你的应用中滥发此类事件。相比之下，突变事件是同步发送的，可以中断正常的代码执行来通知你应用发生突变。尽管突变观察者采用延迟的通知模型，但仍可保证你的应用的观察者可以在下一个重画之前收到（并有机会处理）所有突变记录。
这两项更改会影响你的应用必须如何调整来支持突变观察者。

```javascript
var mutationObserver = new MutationObserver(callback);
mutationObserver.observe(someElement, options);
```

https://msdn.microsoft.com/library/dn265032(v=vs.85).aspx[待续]
