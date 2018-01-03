---
layout: post
title:  "前端性能优化（一） 前端性能分析"
date:   2017-07-03
author: ouven
tags: 前端性能优化 前端性能分析
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---

&emsp;&emsp;前端性能优化是一个很宽泛的概念，本书前面的部分也多多少少提到一些前端优化方法，这也是我们一直在关注的一件重要事情。配合各种方式、手段、辅助系统，前端优化的最终目的都是提升用户体验，改善页面性能，我们常常竭尽全力进行前端页面优化，但却忽略了这样做的效果和意义。先不急于探究前端优化具体可以怎样去做，先看看什么是前端性能，应该怎样去了解和评价前端页面的性能。

&emsp;&emsp;通常前端性能可以认为是用户获取所需要页面数据或执行某个页面动作的一个实时性指标，一般以用户希望获取数据的操作到用户实际获得数据的时间间隔来衡量。例如用户希望获取数据的操作是打开某个页面，那么这个操作的前端性能就可以用该用户操作开始到屏幕展示页面内容给用户的这段时间间隔来评判。用户的等待延时可以分成两部分：可控等待延时和不可控等待延时。可控等待延时可以理解为能通过技术手段和优化来改进缩短的部分，例如减小图片大小让请求加载更快、减少HTTP请求数等。不可控等待延时则是不能或很难通过前后端技术手段来改进优化的，例如鼠标点击延时、CPU计算时间延时、ISP（Internet Service Provider，互联网服务提供商）网络传输延时等。所以要知道的是，前端中的所有优化都是针对可控等待延时这部分来进行的，下面来了解一下如何获取和评价一个页面的具体性能。

5.4.1  前端性能测试

&emsp;&emsp;获取和衡量一个页面的性能，主要可以通过以下几个方面：Performance Timing API、Profile工具、页面埋点计时、资源加载时序图分析。

#### 一、Performance Timing API

&emsp;&emsp;Performance Timing API是一个支持Internet Explorer 9以上版本及WebKit内核浏览器中用于记录页面加载和解析过程中关键时间点的机制，它可以详细记录每个页面资源从开始加载到解析完成这一过程中具体操作发生的时间点，这样根据开始和结束时间戳就可以计算出这个过程所花的时间了。

&emsp;&emsp;图5-4为W3C标准中Performance Timing资源加载和解析过程记录各个关键点的示意图，浏览器中加载和解析一个HTML文件的详细过程先后经历unload、redirect、App Cache、DNS、TCP、Request、Response、Processing、onload几个阶段，每个过程开始和结束的关键时间戳浏览器已经使用performance.timing来记录了，所以根据这个记录并结合简单的计算，我们就可以得到页面中每个过程所消耗的时间。


![](http://7tszky.com1.z0.glb.clouddn.com/FvhDUAqsalBW_npmruPnJCvjqKZk)

图5-4  performance API关键时间点记录

```javascript
function performanceTest(){

    let timing = performance.timing,
        readyStart = timing.fetchStart - timing.navigationStart,
        redirectTime = timing.redirectEnd  - timing.redirectStart,
        appcacheTime = timing.domainLookupStart  - timing.fetchStart,
        unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart,
        lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart,
        connectTime = timing.connectEnd - timing.connectStart,
        requestTime = timing.responseEnd - timing.requestStart,
        initDomTreeTime = timing.domInteractive - timing.responseEnd,
        domReadyTime = timing.domComplete - timing.domInteractive,
        loadEventTime = timing.loadEventEnd - timing.loadEventStart,
        loadTime = timing.loadEventEnd - timing.navigationStart;

    console.log('准备新页面时间耗时: ' + readyStart);
    console.log('redirect 重定向耗时: ' + redirectTime);
    console.log('Appcache 耗时: ' + appcacheTime);
    console.log('unload 前文档耗时: ' + unloadEventTime);
    console.log('DNS 查询耗时: ' + lookupDomainTime);
    console.log('TCP连接耗时: ' + connectTime);
    console.log('request请求耗时: ' + requestTime);
    console.log('请求完毕至DOM加载: ' + initDomTreeTime);
    console.log('解析DOM树耗时: ' + domReadyTime);
    console.log('load事件耗时: ' + loadEventTime);
    console.log('加载时间耗时: ' + loadTime);
}
```

&emsp;&emsp;通过上面的时间戳计算可以得到几个关键步骤所消耗的时间，对前端有意义的几个过程主要是解析DOM树耗时、load事件耗时和整个加载过程耗时等，不过在页面性能获取时我们可以尽量获取更详细的数据信息，以供后面分析。除了资源加载解析的关键点计时，performance还提供了一些其他方面的功能，我们可以根据具体需要进行选择使用。

```javascript
performance.memory      // 内存占用的具体数据
performance.now()       // performance.now()方法返回当前网页自performance.timing到现在的时间，可以精确到微秒，用于更加精确的计数。但实际上，目前网页性能通过毫秒来计算就足够了。
performance.getEntries() // 获取页面所有加载资源的performance timing情况。浏览器获取网页时，会对网页中每一个对象（脚本文件、样式表、图片文件等）发出一个HTTP请求。performance.getEntries方法以数组形式返回所有请求的时间统计信息。
performance.navigation // performance还可以提供用户行为信息，例如网络请求的类型和重定向次数等，一般都存放在performance.navigation对象里面。
performance.navigation.redirectCount // 记录当前网页重定向跳转的次数。
```

参考资料：https://www.w3.org/TR/resource-timing/。

#### 二、 Profile工具

&emsp;&emsp;Performance Timing API描述了页面资源从加载到解析各个阶段的执行关键点时间记录，但是无法统计JavaScript执行过程中系统资源的占用情况。Profile是Chrome和Firefox等标准浏览器提供的一种用于测试页面脚本运行时系统内存和CPU资源占用情况的API，以Chrome浏览器为例，结合Profile，可以实现以下几个功能。

1．分析页面脚本执行过程中最耗资源的操作

2．记录页面脚本执行过程中JavaScript对象消耗的内存与堆栈的使用情况

3．检测页面脚本执行过程中CPU占用情况

&emsp;&emsp;使用console.profile()和console.profileEnd()就可以分析中间一段代码执行时系统的内存或CPU资源的消耗情况，然后配合浏览器的Profile查看比较消耗系统内存或CPU资源的操作，这样就可以有针对性地进行优化了。

```javascript
console.profile();
// TODOS，需要测试的页面逻辑动作
for(let i = 0; i < 100000; i ++){
    console.log(i * i);
}
console.profileEnd();
```

#### 三、  页面埋点计时

&emsp;&emsp;使用Profile可以在一定程度上帮助我们分析页面的性能，但缺点是不够灵活。实际项目中，我们不会过多关注页面内存或CPU资源的消耗情况，因为JavaScript有自动内存回收机制。我们关注更多的是页面脚本逻辑执行的时间。除了Performance Timing的关键过程耗时计算，我们还希望检测代码的具体解析或执行时间，这就不能写很多的console.profile()和console.profileEnd()来逐段实现，为了更加简单地处理这种情况，往往选择通过脚本埋点计时的方式来统计每部分代码的运行时间。

&emsp;&emsp;页面JavaScript埋点计时比较容易实现，和Performance Timing记录时间戳有点类似，我们可以记录JavaScript代码开始执行的时间戳，后面在需要记录的地方埋点记录结束时的时间戳，最后通过差值来计算一段HTML解析或JavaScript解析执行的时间。为了方便操作，可以将某个操作开始和结束的时间戳记录到一个数组中，然后分析数组之间的间隔就得到每个步骤的执行时间，下面来看一个时间点记录和分析的例子。

```javascript
let timeList = []; 
function addTime(tag){ timeList.push({"tag":tag,"time":+new Date}); }

addTime("loading");

timeList.push({"tag":"load","time": +new Date()});
// TODOS，load加载时的操作
timeList.push({"tag":"load","time": +new Date()});

timeList.push({"tag":"process","time": +new Date()});
// TODOS，process处理时的操作
timeList.push({"tag":"process","time": +new Date()});

parseTime(timeList); // 输出{load: 时间毫秒数，process: 时间毫秒数}

function parseTime(time){
    let timeStep = {},
        endTime;
    for(let i = 0,len = time.length; i < len; i ++){
        if(!time[i]) continue;

        endTime = {};
        for(let j = i+1; j < len; j++ ){
            if(time[j] && time[i].tag == time[j].tag){
                endTime.tag = time[j].tag;
                endTime.time = time[j].time;
                time[j] = null;
            }
        }
        if(endTime.time >= 0 && endTime.tag){
            timeStep[endTime.tag] = endTime.time - time[i].time;
        }
    }
    return timeStep;
}
```

&emsp;&emsp;这种方式常常在移动端页面中使用，因为移动端浏览器HTML解析和JavaScript执行相对较慢，通常为了进行性能优化，我们需要找到页面中执行JavaScript耗时的操作，如果将关键JavaScript的执行过程进行埋点计时并上报，就可以轻松找出JavaScript执行慢的地方，并有针对性地进行优化。

#### 四、资源加载时序图

&emsp;&emsp;我们还可以借助浏览器或其他工具的资源加载时序图来帮助分析页面资源加载过程中的性能问题。这种方法可以粗粒度地宏观分析浏览器的所有资源文件请求耗时和文件加载顺序情况，如保证CSS和数据请求等关键性资源优先加载，JavaScript文件和页面中非关键性图片等内容延后加载。如果因为某个资源的加载十分耗时而阻塞了页面的内容展示，那就要着重考虑。所以，我们需要通过资源加载时序图来辅助分析页面上资源加载顺序的问题。


![](http://7tszky.com1.z0.glb.clouddn.com/FqMw_GZ75Bqs_gGGDrrKKzAkGHmf)
图5-5

&emsp;&emsp;图5-5为使用Fiddler获取浏览器访问地址http://www.jixianqianduan.com时的资源加载时序图。根据此图，我们可以很直观地看到页面上各个资源加载过程所需要的时间和先后顺序，有利于找出加载过程中比较耗时的文件资源，帮助我们有针对性地进行优化。