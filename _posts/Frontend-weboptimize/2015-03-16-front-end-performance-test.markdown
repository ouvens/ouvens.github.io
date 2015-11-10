---
layout: post
title:  "前端性能测试"
date:   2015-03-16
author: ouven
tags: 前端性能 性能测试
cover:  "assets/category/type-javascript.png"
---



### 一、performance timing API
performance timing API支持ie9以上浏览器，页面请求的整个过程和performance API记录的点

![](http://7tszky.com1.z0.glb.clouddn.com/FqJwnMWrQQ50yyfCN7VyLHBBtuS7)

http://javascript.ruanyifeng.com/bom/performance.html

根据这个过程 performance.timing会记录页面请求的各个点的timestamp，经过简单输出，就可以得到页面请求每个过程所消耗的时间了。
也可以使用现有的实现，原理和以上代码相同：

```javascript
function performanceTest(){

    var timing = performance.timing,
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
        console.log('解释dom树耗时: ' + domReadyTime);
        console.log('load事件耗时: ' + loadEventTime);
        console.log('加载时间耗时: ' + loadTime);

}
```

总结分析：
1，对我们有用的，解释dom树耗时、load事件耗时、整个事件耗时作为整体性能参考
2，优化从dom树解析和事件绑定两个方面进行考虑

一些其他的能力：
performance.memory  
performance.navigator 
performance.now()   performance.now方法返回当前网页自从performance.timing.navigationStart到当前时间之间的微秒数（毫秒的千分之一）。也就是说，它的精度可以达到100万分之一秒
performance.mark()  mark方法用于为相应的视点做标记
performance.getEntries()  浏览器获取网页时，会对网页中每一个对象（脚本文件、样式表、图片文件等等）发出一个HTTP请求。performance.getEntries方法以数组形式，返回这些请求的时间统计信息，有多少个请求，返回数组就会有多少个成员。
performance.navigation performance还可以提供一些用户行为信息，主要都存放在performance.navigation对象上面。

performance.navigation.redirectCount 该属性表示当前网页经过了多少次重定向跳转。

应用：performanceTracer 和 perfmap
perfmap: 匹配页面上说有的/url\(("?http.*"?)\)/ig 请求，使用performance.getEntries获取每个请求的timing

### 二、profile工具

html5 performance API描述了加载到渲染各个阶段的执行情况，但是无法知道页面中js执行的各个动作所需要的时间。
    profile是chrome和火狐的标准浏览器带有的一种测试页面运行时间及时间内动作的性能分析api，以chrome为例，结合浏览器的profile功能，我们可以做以下几个事情：
    1、分析页面js执行的每个过程时间和分析出页面交互过程最耗时的操作
    2、分析页面执行过程中js对象或dom对象堆栈内存的使用情况
    3、记录js对象消耗的内存情况
    4、检测一段时间内CPU占用情况
    
例如使用console.profile()和console.profileEnd()，就可以分析中间一段代码的执行情况：
  
```javascript

console.profile();
//TO DOS
console.profileEnd();

```  

### 三、打点测试

使用profile可以一定程度上帮助我们分析页面的性能情况，但是缺点是不够灵活，例如我们希望检测每段代码执行的具体情况，我们不可能写很多的console.profile()和console.profileEnd()，为了更加灵活的控制页面js的执行情况，这是需要自己打点计时来计算每部分代码的运行情况。
        原理也相当简单，记录js代码开始执行的timestamp，后面在需要记录的地方打点记录timestamp，最后通过差值来计算每段js的运行时间。然后对于重复操作，我们可以用下面的例子

```javascript
var T = []; function PT(tag){ T.push({"tag":tag,"time":+new Date}); }
PT("loading");

T.push({"tag":"load","time":+new Date()});
//TO DOS
T.push({"tag":"load","time":+new Date()});

function outputTime(T){
    var timeStep = {},
        endTime = {};
    for(var i = 0,len = T.length; i < len; i ++){
        if(!T[i]) continue;

        endTime = {};
        for(var j = i+1; j < len; j++ ){
            if(T[j] && T[i].tag == T[j].tag){
                endTime.tag = T[j].tag;
                endTime.time = T[j].time;
                T[j] = null;
            }
        }
        if(endTime.time >= 0 && endTime.tag){
            timeStep[endTime.tag] = endTime.time - T[i].time;
        }
    }
    return timeStep;
}
```
        
最后分析数组之间的间隔就可以分析出执行时间。

### 四、timeline分析
浏览器的timeline可以粗粒度的分析浏览器的文件的请求耗时和加载顺序，这里不进行讲述。

### 五，resource timing
通过资源价值情况来分析前端页面的性能
