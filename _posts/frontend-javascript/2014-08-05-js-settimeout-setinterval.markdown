---
layout: post
title:  "javascript基础--setTimeout与setInterval区别"
date: 2014-08-06
author: ouven
tags: javascript基础 setTimeout与setInterval区别
categories: frontend-javascript
cover: "assets/category/type-javascript.png"
---


### 一、javascript中settimeout和setinterval的区别是
 
settimeout只运行一次，也就是说设定的时间到后就触发运行指定代码，运行完后即结束。如果运行的代码中再次运行同样的settimeout命令，则可循环运行。

setinterval是循环运行的，即每到设定时间间隔就触发指定代码。这是真正的定时器。setinterval使用简单，而settimeout则比较灵活，可以随时退出循环，而且可以设置为按不固定的时间间隔来运行，比如第一次1秒，第二次2秒，第三次3秒……
 
#### 1,settimeout详解

var t = settimeout("javascript 语句", 时间参数)
注：时间参数单位为毫秒

示例：var t=settimeout("alert(’3 seconds!’)", 3000)

如果js语句带变量，则必须用+号将变量连接起来，如：
var t = settimeout（"document.getelementbyid("+menuid+").style.display=’none’", 3000)
cleartimeout详解

语法：cleartimeout(settimeout的变量名)

示例：cleartimeout(t)    //其中t为前面设置的settimeout的变量

使用cleartimeout可以随时停止计时。

 
#### 2,setinterval定义和用法

setinterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
 
setinterval() 方法会不停地调用函数，直到 clearinterval() 被调用或窗口被关闭。由 setinterval() 返回的 id 值可用作 clearinterval() 方法的参数。
 
语法
setinterval(code,millisec[,"lang"])

参数 描述
code 必需。要调用的函数或要执行的代码串。
millisec 必须。周期性执行或调用 code 之间的时间间隔，以毫秒计。
 
返回值
一个可以传递给 window.clearinterval() 从而取消对 code 的周期性执行的值。

例如：

```javascript
var int=self.setinterval("clock()", 50)
       function clock(){
           var t=new date()
           document.getelementbyid("clock").value = t
       }
<button onclick="int=window.clearinterval(int)">stop interval</button>
```

### 二、深度了解settimeout和setinterval的区别
 
settimeout和setinterval这两个函数, 大家肯定都不陌生, 但可能并不是每个用过这两个方法的同学, 都了解其内部的实质。甚至可能会错误的把两个实现定时调用的函数理解成了类似thread一样的东西, 认为会在一个时间片内, 并发的执行调用的函数, 似乎很好很强大, 但其实并不是如此, 实际的情况是javascript都是以单线程的方式运行于浏览器的javascript引擎中的, settimeout和setinterval的作用只是把你要执行的代码在你设定的一个时间点插入js引擎维护的一个代码队列中, 插入代码队列并不意味着你的代码就会立马执行的,理解这一点很重要. 而且settimeout和setinterval还有点不一样。

__先谈谈setTimeout __

假设我们给一个button的onclick事件绑定了此方法, 当我们按下按钮后, 肯定先执行block1的内容, 然后运行到setTimeout的地方, setTimeout会告诉浏览器说, "200ms后我会插一段要执行的代码给你的队列中", 浏览器当然答应了(注意插入代码并不意味着立马执行), setTimeout代码运行后, 紧跟其后的block2代码开始执行, 这里就开始说明问题了, 如果block2的代码执行时间超过200ms, 那结果会是如何? 或许按照你之前的理解, 会理所当然的认为200ms一到, 你的process代码会立马执行...事实是, 在block2执行过程中(执行了200ms后)process代码被插入代码队列, 但一直要等click方法执行结束, 才会执行process代码段, 从代码队列上看process代码是在click后面的, 再加上js以单线程方式执行, 所以应该不难理解. 如果是另一种情况, block2代码执行的时间<200ms, setTimeout在200ms后将process代码插入到代码队列, 而那时执行线程可能已经处于空闲状态了(idle), 那结果就是200ms后, process代码插入队列就立马执行了, 就让你感觉200ms后, 就执行了. 

__再看看setInterval __

这里可能会存在两个问题: 

1.时间间隔或许会跳过 
2.时间间隔可能<定时调用的代码的执行时间 

```javascript
function click() { 
// code block1... 
setInterval(function() { 
// process ... 
}, 200); 
// code block2 
} 
```

和上面一样我们假设通过一个click, 触发了setInterval以实现每隔一个时间段执行process代码
      
![](http://7tszky.com1.z0.glb.clouddn.com/Fot2ujHKIjjKJljGo9gJ1fwVXMRN)
  
比如onclick要300ms执行完, block1代码执行完, 在5ms时执行setInterval, 以此为一个时间点, 在205ms时插入process代码, click代码顺利结束, process代码开始执行(相当于图中的timer code), 然而process代码也执行了一个比较长的时间, 超过了接下来一个插入时间点405ms, 这样代码队列后又插入了一份process代码, process继续执行着, 而且超过了605ms这个插入时间点, 下面问题来, 可能你还会认为代码队列后面又会继续插入一份process代码...真实的情况是,由于代码队列中已经有了一份未执行的process代码, 所以605ms这个插入时间点将会被"无情"的跳过, 因为js引擎只允许有一份未执行的process代码, 说到这里不知道您是不是会豁然开朗呢...

为了这种情况你可以用一种更好的代码形式

```javascript
setTimeout(function(){
    //processing 
    setTimeout(arguments.callee, interval); 
}, interval); 

```

这个估计稍微想一下, 就明白其中的好处了, 这样就不会产生时间点被跳过的问题内容就到这里, 希望能有所帮助, 可能我表达的不是很清楚如果觉得自己英语基础不错可以直接看
 



