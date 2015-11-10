---
layout: post
title:  "从webWorker到serviceWorker"
date: 2014-06-05
author: ouven
tags: serviceWorker webWorker 
categories: frontend-javascript
cover: "assets/category/type-javascript.png"
---

## 从webWorker到serviceWorker

http://www.w3.org/TR/2014/WD-service-workers-20140508/#introduction
下面将从webWorker、serviceWorker和为什么使用serviceWorker三个方面进行讨论

### 一、Web worker

要了解serviceworker，先的认识下webworker，也可以了解一下二者的共同点，并予以区分。

Web Workers 是 现代浏览器 提供的一个javascript多线程解决方案，我们可以将一些大计算量的代码交由web Worker运行。JavaScript语言执行采用的是单线程模型，也就是说，所有任务排成一个队列，一次只能做一件事。但是有了webworker后就不一样了。

#### (1) 兼容性
支持的浏览器包括IE10、Firefox (从3.6版本开始)、Safari (从4.0版本开始)、Chrome 和 Opera 11+，但是手机浏览器还不支持。

#### (2) 基础API
构造一个webworker：new Worker(path) ，返回一个Worker对象。

__返回的对象__

onerror：用于worker出错处理
onmessage：用户主线程和worker线程传递数据，可以使字符串数字或对象，但是safari浏览器不支持对象，需要用stringify和parse转化。当然和可以使用addeventListener("message",function(){});
煮个栗子：(例子代码见附件)


__输出__

如何结束worker：
主页面worker.terminate();或worker自销毁self.close();或者关闭页面

#### sharedworker：
除了webWorker，还有另一类sharedworker支持多个浏览器窗口共享同一个worker，单个页面关闭，worker并不结束，需关闭浏览器。但这里不做深入讨论

importScripts:
worker内部引用文件的方法，可以将worker分成不同的多个文件，然后使用importScripts加载，并可以实现文件的动态加载。就像html中使用script标签引入js一样。
global worker上下文:
前面提到在worker中不能使用window对象和docuemnt对象，是因为一个webworker拥有一个独立的运行环境Workerglobalscope并和浏览器的环境独立，Workerglobalscope环境包括：
* JavaScript的全局对象：JSON、Date()、Array
*self自身引用
*location对象，但是其属性都是只读的，改了也影响不到调用者
*navigator对象，但修改了部分属性
*setTimeout()、setInterval()及其对应清除方法
*addEventListener()、removeEventListener()
http://dev.w3.org/html5/workers/#dedicatedworkerglobalscope

__(3) 局限性__

1.同源限制。webworker不能跨域加载JS
2.DOM限制。worker内代码不能访问dom，原因是worker有自己独立的global worker环境，不是浏览器window，所以alert(),dom等操作无法进行
3.文件限制。子线程无法读取本地文件，即worker只能加载网络文件。
4.不是每个浏览器都支持这个新特性，且各个浏览器对Worker的实现不大一致，例如FF里允许worker中创建新的worker,而Chrome中就不行

## 二、ServiceWorker
Service Worker是基于Web Worker的事件驱动的，他们执行的机制都是新开一个线程去处理一些额外的，以前不能直接处理的任务。对于Web Worker，我们可以使用它来进行复杂的计算，因为它并不阻塞浏览器主线程的渲染。而Service Worker，我们可以用它来进行本地缓存或请求转发，相当于一个浏览器端本地的proxy。

例如使用Service Worker来进行缓存，是用javascript代码来拦截浏览器的http请求，并设置缓存的文件，直接返回，不经过web服务器，然后，我们就可以开发基于浏览器的离线应用。这使得我们的web应用减少对网络的依赖。
如果我们使用了Service Worker做缓存，浏览器http请求会先经过Service Worker，通过url mapping去匹配，如果匹配到了，则使用缓存数据，如果匹配失败，则继续执行你指定的动作。一般情况下，匹配失败则让页面显示“网页无法打开”。

上面是Service Worker的一个基本使用场景，当然还有更多，先了解一下serviceWorker。

#### (1) 兼容性

https://jakearchibald.github.io/isserviceworkerready/ (目前API支持现状，有兴趣的自己看，反正就是基本上只有chrome测试版和FF nightly版本支持)

chrome版本下要支持还要开启serviceWorker支持，打开chrome://flags/

此外特定的API还需要特定的环境：

此外还有开启实验平台、使用chrome canary测试版本，这个确实比较麻烦。但是实际上使用最新的canary版本也无法完全支持草案中的所有API，实验时使用的chrome稳定37版本和canary 40版本环境。可能后面新版本又会修改。

#### (2) serviceWorker介绍

ServiceWorkerGlobalScope部分作用域定义如下

可以看出，这个webworker的scope有点不一样，但是也有些共同部分
scriptCache：worker的文件一旦注册使用，会被缓存到浏览器中，需要手动清理掉，例如：
，注册使用了sw.js，sw.js修改后必须清理缓存后才生效

```javascript
client：返回serviceworkClients对象

scope：返回serviceworker的url路径数组，并和serviceworker的注册事件关联，一旦注册，serviceworker的路径就会在scope中。

注册与销毁：register&unregister，register执行后返回一个Promise对象，所以要支持serviceWorker浏览器必须先支持Promise
事件Event:
*install：worker使用register注册时会触发install事件
*activate：worker使用register注册时也会触发activate事件
*fetch：浏览器发送请求时会产生fetch事件，此时可以调用一个请求响应的对象，或者可以使用responseWith来指定请求返回内容
*responseWith：responseWith必须指定一个相应内容，否则会发生触发error event，请求成功后会获得一个正确的url。
*waitUtil：waitUtil可以为install指定时间延时，让install的动作延后执行。
*replace：install事件执行完成后会指定replace
onmessage：主线程与worker之间调用传递数据的通道
postMessage：同webworkers类似，用于进行数据传递，canary版本不支持。stable反而支持
```

...还有一些感觉不常用的就不列出了

#### (3) 煮个栗子

现在要使用serviceWorkers实现请求转发，详见代码中的的 urlredirect/下代码

sw.js(serviceworker)中实现了对9.url.cn的请求全部转发请求返回一张图片，即把bg-logo.png换成另一张220尺寸的图片。
更多栗子见附件所示。

再来个onmessage的栗子,详见代码中的的 postMessage/下代码：

其实这个就和webworker一样了，可以理解，serviceWorker可以认为是一种改进后的webWorker。webworker做的是多线程，serviceworker则是用webworker做了个与网络请求相关封装，来监听一些网络事件。当然serviceworker也可以来做很多事情，例如离线缓存应用，甚至替代fiddler作为调试工具。
目前serviceworker的草案还在更新中，部分api仅在FF nightly和chrome canary中使用，相对还需要较大的完善。

#### (4)注意事项：

处于安全考虑，serviceworker一般用在https上，原因有几点:
*防止人为中间层攻击
*推动https使用
*开发工具可以比较自由安全
*https未来会在web中越来越广泛
另外serviceworker一般不能放在cdn上，但是可以通过importscript()来导入cdn上的资源，

#### (5)扩展：

根据10月草案，serviceworker未来可能会增加后台同步，任务调度和消息推送API。

#### (6)chrome canary离线小恐龙的游戏

基于serviceworker，chrome canary版本 (chrome37稳定版的好像不行) 在网络不可用时会显示小恐龙冒险的离线游戏，按下空格键，就可以开始呵呵了~~无聊的童鞋可以去试试，如果自己能做个飞机大战就更好了。


## 三、为什么要使用serviceworker

#### 3.1 未来我们想要做的

未来的web 应用将是离线可用的，而且是能够增量更新的，尤其是在PC客户端的应用

#### 3.2 目前web应用缓存解决方案与不足

目前主要的webapp缓存解决方案主要有以下4种，大家一看都懂，这里只是过一下
         
__3.2.1 基于浏览器头信息的缓存方式__
    这种方式的缓存过程如下：
        
说白了，使用浏览器头信息缓存的主要有了两种，一种是判断静态资源http头部的Etag和Last-Modified是否修改，修改则重新请求，否则忽略；当然还有一种根据expires过期时间来判断的，原理一样，但是这两种方法都必不可少的至少会产生大量http请求，即使返回304。而且一旦离线，浏览器就无计可施了。

__3.2.2 使用APP Cache __

html5提供了App cache来解决静态文件存储的问题，它通过将要缓存的静态文件声明在一个manifest文件清单里，然后在要缓存的html里通过manifest属性关联清单文件即可在下次载入html时优先加载缓存清单中列出的静态文件。相对于浏览器 默认的土鳖方法，静态文件的缓存变得更加可控了。
        
但是，有些问题依然有些棘手：

1. 对manifest文件更新，会重新请求所有文件，实际上可能只更新了很少量文件。（ 虽然重新请求资源会返回304， 但每个文件还会发起请求，还是发起了网络请求)、针对此点可以只更新需要更新的文件， 比如可以建立一个文件版本或者MD5映射，对相同版本或者MD5不再请求。

2.  manifest文件每次都会请求，我们可以按照一定时间更新一次，或者启动时更新一次，但一旦改变更新就是全量更新

3. 当然也可以在打开app之前预缓存，提前下载文件或者更新manifest文件。

但这些解决方案，是不是仍然觉得很麻烦，而且依然会有大量的304请求，有木有。

__3.2.3 使用localstorage存储__

html5支持的，现对于cookie的确丰富了许多，也扩大了容量，方便易用的API也被广泛接受，但是几个问题：
一是无法对静态文件进行存储，二是大小限制，虽然各个浏览器的localstorage最大容量限制也不一样，但是最大的也只是IE9下的7MB，所以要应对离线应用，localstorage仍然是捉襟见肘。

__3.2.4 indexedDB缓存__

原理说起来比较简单，IndexedDB的做法是，把一些数据存储到浏览器的indexedDB中，当与网络断开时，可以从浏览器中读取数据，用来做一些离线应用，而且不需要你去写特定的sql语句来对数据进行操作，它是nosql的，数据形式使用的是json。这种存储数据的方式似乎无懈可击，容量足够，存取自由，但是对于静态文件就极其麻烦了。

#### 3.3 基于这些，所以我们选择了serviceWorker
  
它可以是浏览器提供给用户的一个上网代理，通过fetch拦截到用户的所用请求，可以不向服务器发送，并可以将请求转向本地缓存或其它资源文件的加载，无论是数据还是静态文件，然后可以通过javascript的操作进行增量更新应用数据，而且同时不阻塞浏览器的渲染进程。这就很好的解决了我们的问题。虽然目前浏览器支持的程度比较差，但是浏览器的发展速度会很快让我们用到它的。

    
## 四、总结

(1) webworker 现在可以在浏览器端做多线程操作，但比较限制

(2) serviceworker是在webworker基础上实现的，它可认为是使用了webworker技术来处理网络请求、响应等方面的事务

(3) 两者目前浏览器兼容性很不好，尤其是serviceworker，草案在更新，特性没有完整，chrome的各分支版本支持都不一样，但仍然还是可以根据这些特性进行一些有趣的开发。

(4)serviceworker可以带给我们很多

参考文档
https://jakearchibald.github.io/isserviceworkerready/ (api支持性现状介绍)
http://www.serviceworker.org/# (git主页)
http://www.w3.org/TR/2014/WD-service-workers-20140508/#introduction (w3c介绍)
http://jakearchibald.com/2014/service-worker-first-draft/ (serviceWorker草案)
https://github.com/jakearchibald/isserviceworkerready (样例代码)
https://slightlyoff.github.io/ServiceWorker/spec/service_worker/ (10月份更新的草案)