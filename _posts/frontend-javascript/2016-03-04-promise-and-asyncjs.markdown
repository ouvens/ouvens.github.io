---
layout: post
title:  "Promise与异步"
date:   2016-03-04
author: ouven
tags:   Promise 异步编程
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---



&emsp;&emsp;接触过promise的的都知道它的应用场景和用途，Promise可以用来避免异步操作函数里的嵌套回调（callback hell）问题，因为解决异步最直接的方法是回调嵌套，将后一个的操作放在前一个操作的异步回调里，但如果操作多了，就会有很多层的嵌套。

&emsp;&emsp;Promise的实现方式比较多，有丰富的第三方库，ES6也已经原生支持了Promise，jquery中也有$.Deferred()等可以解决异步嵌套问题。

**先给下Promise学术点的[描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)：**

&emsp;&emsp;promise代表一个异步操作的执行返回状态，这个执行返回状态在promise对象创建时未必已知。它允许你为异步操作的成功或失败指定处理方法。 这使得异步方法可以像同步方法那样返回值：异步方法会返回一个包含了原返回状态的 promise 对象来替代原返回状态。

#### 一、Promise的适用场景

&emsp;&emsp;Promise并非适用于所有的异步场景，例如事件的绑定，某个程度上Promise有点类似事件的监听回调，当触发某个操作时进行后面特定的逻辑。但Promise只能执行一次，且需要前面特定的操作执行完成才会进行下一步，一般分成功和失败两种场景，成功或失败后会立即执行响应函数。这就很适合判断一个比较耗时的操作是否最终执行成功的场景，就如我们通常理解的ajax网络请求、读取localstorage等操作。

### 二、Promise的表现

&emsp;&emsp;如果使用回调方法处理多个操作的异步场景，判断某个操作成功或失败的控制在于声明的匿名函数里面，使用Promise对象则可以重新定义异步执行的状态和控制逻辑。

&emsp;&emsp;promises的最重要的特点就是它把我们处理任何函数调用的成功或者失败的方式规范成了可预测的形式，特别是如果这个调用实际上的异步的。

&emsp;&emsp;Promise中有几个状态：

- pending: 初始状态。 非 fulfilled 或 rejected。

- resolved: 成功的操作。也有的成为fulfilled 。

- rejected: 失败的操作。

&emsp;&emsp;不同的Promise差异基本表现如下：

- 构造Promise对象 new Promise().resolve() 或者 new Pomise(function(resolve, reject) {})

- 是否有 .done() .fail() .always() 等方法

- 是否有Promise.all()方法

- 是否有isRejected() isResolved()

- .then() return 结果链式的

### 三、几种规范的promise

#### 2.1、Promise的Promise/A 规范和Promise/A+规范

先看下规范的地址： 
http://wiki.commonjs.org/wiki/Promises/A
https://promisesaplus.com/

&emsp;&emsp;什么是A+规范的Promise? Promises/A+是在Promises/A的基础上对原有规范进行修正和增强。

**Promise A+与Promise A的主要区别:**

- 符合Promise/A+规范的promise实现均以then方法为交互核心。Promises/A+组织会因新发现的问题以向后兼容的方式修改规范，因此Promises/A+规范相对来说还是比较稳定的。

- A+规范强调了不同实现之间的互操作和混用，通过术语thenable来区分promise对象，当一个对象拥有then函数就认为是promise对象

- A+定义当onFulfilled或者onRejected返回promise时后的处理过程，他们必须是作为函数来调用，而且调用过程必须是异步的

- A+严格定义了then方法链式调用时onFulfilled或者onRejected的调用顺序

目前判断是否为Promise/ A+规范主要看Promiise的方法含有new Pomise(function(resolve, reject) {})、then、resolve、all等方法。ES6 Promise的实现严格遵循了Promise/A+规范。例如Defferd就不是Promise/ A+的规范。

#### 2.2、Defferd实现规范

&emsp;&emsp;比较典型的是jquery的Defferd方法实现的Promise，另外jquery还有一个Promise的类型，实现的原理相同，但是不遵循Promise/A +规范，相对于Promise没有那么稳定。

&emsp;&emsp;我们先来看看jquery的Promise是怎样实现的。我们看下jquery的Deferred实现源码：

```javascript

// 精简后主要逻辑的源码
Deferred: function( func ) {
        var tuples = [
                // action, add listener, listener list, final state
                [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
                [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
                [ "notify", "progress", jQuery.Callbacks("memory") ]
            ],
            state = "pending",
            promise = {
                state: function() {},
                always: function() {},
                then: function( /* fnDone, fnFail, fnProgress */ ) { },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function( obj ) {}
            },
            deferred = {};
        jQuery.each( tuples, function( i, tuple ) {
            deferred[ tuple[0] + "With" ] = list.fireWith;
        });
        promise.promise( deferred );
        // All done!
        return deferred;
    },

// 调用时间订阅方法

var def = $.Deferred();
  def.done(function(){
     console.log(“成功”);
  }).fail(function(){
      console.log(“失败”);
  }).catch(function(){
      console.log(“再一次成功”);
  })
```

&emsp;&emsp;可见，jquery的Deferred是个工厂类，返回的是内部构建的deferred对象；tuples 含有三个$.Callbacks对象，分别表示成功，失败，处理中三种状态；创建的promise对象，具有state、always、then、primise方法；扩展primise对象生成最终的Deferred对象，返回该对象；没有resolve、reject、all等Promise/A+ 规范的常用方法。

### 三、兼容性

![](http://7tszky.com1.z0.glb.clouddn.com/FglTi7fYmY9pkdE0Ux3LA_h22bPe)

目前使用需要使用polyfill，也就是原生实现一个Promise支持较低浏览器，第三方实现库很多后面给了个学习的较好例子。

### 四、generator的异步

&emsp;&emsp;Promise处理异步问题相信都了解了。ES6里的generator还有另一个处理异步的方法，那ES6定义这两个特性岂不是重复了？

&emsp;&emsp;单独地介绍Generator没有太大价值，因为它除了更复杂外，功能与普通函数没有太大差别。真正让Generator具有价值的是yield关键字，这个yield关键字让Generator内部的逻辑能够切割成多个部分。并且可以灵活控制内部的执行情况。

```javascript
// 申明要用 var gen = function* (){} 的方式
var compute = function* (a, b) {
  yield console.log(a + b);
  yield console.log(a - b);
  yield console.log(a * b);
  yield console.log(a / b);
};

var generator = compute(4, 2);

generator.next(); // 6
generator.next(); // 2
generator.next(); // 8
generator.next(); // 2
```
运行时使用node --harmony-generators test.js

&emsp;&emsp;不难发现它的运行过程，generator函数运行到yield时会停止，等待下一个next()方法调用让它继续执行。我们改下成为异步方法，异步我们需要借助高阶函数

```javascript
var helper = function(fn) {
    return function() {
        var args = [].slice.call(arguments);
        var pass;
        args.push(function() { // 在回调函数中植入收集逻辑
            if (pass) {
                pass.apply(null, arguments);
            }
        });
        fn.apply(null, args);

        return function(fn) { // 传入一个收集函数
            pass = fn;
        };
    };
};
```

那么后面的写法做下修改

```javascript

var sum = helper(function sum(a, b){
    console.log(a + b);
});

var minus = helper(function minus(a, b){
    console.log(a - b);
});

var muti= helper(function muti(a, b){
    console.log(a * b);
});

var devide= helper(function devide(a, b){
    console.log(a / b);
});

var compute = function*(a, b) {
    yield sum(a, b);
    yield minus(a, b);
    yield muti(a, b);
    yield devide(a, b);
};

var generator = compute(5, 2);
var state = generator.next();

/**
 * next 返回 {value:'',done: false}的结构，value表示执行传入的值，done表示是否结束
 * @param  {[type]} !state.done [description]
 * @return {[type]}             [description]
 */
 
setTimeout(function() {

    while (!state.done) {
        state = generator.next();
    }
}, 100);

console.log('other');
```

generator实现异步的方法也有比较完整的封装方式，实现先可以看：https://github.com/ouvens/co
可以看个简单版的：

```javascript
var co = function(flow) {
    var generator = flow();
    var next = function(data) {
        var result = generator.next(data);
        if (!result.done) {
            result.value(function(err, data) {
                if (err) {
                    throw err;
                }
                next(data);
            });
        }
    };
    next();
};
```

我们小结一下通过Generator进行流程控制的特点。
- 每个异步方法都需要标准化为yield关键字能接受的方法，使我们有机会注入特殊逻辑，这个过程被称为thunkify。
- 需要巧妙地将异步调用执行完成得到的结果通过.next()传递给下一段流程。
- 需要递归地将业务逻辑执行完成。

需要注意的是yield只能暂停Generator内部的逻辑，它并不是真正暂停整个线程，Generator外的业务逻辑依然会继续执行下去。


### 五、总结

&emsp;&emsp;实现异步的方法目前有，自定义嵌套，Promise、generator、Defferd，还有ES7的async（其实是generator的封装），不同场景可以选择不同的方式去实现


**简单的Promise实现样例：**
https://github.com/ouvens/promise

**generator异步实现：**
https://github.com/tj/co

**参考文章：**
http://www.infoq.com/cn/articles/generator-and-asynchronous-programming/
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
http://www.shaynegui.com/promise-aplus-implementation/
http://www.html5rocks.com/zh/tutorials/es6/promises/
https://blog.domenic.me/youre-missing-the-point-of-promises/#toc_1
https://github.com/nodejs/node-v0.x-archive/wiki/modules#async-flow
http://www.html-js.com/article/JavaScript-tips-on-how-to-implement-a-ECMAScript-6-promise-patch