---
layout: post
title:  "前端一站式异常捕获方案(全)"
date:   2018-02-22
author: ouven
tags: 前端异常 错误监控 前端监控
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---

#### 一、前端异常监控的重要性

&emsp;&emsp;软件异常监控常常直接关联到软件本身的质量，完备的异常监控体系常常能够快速定位到软件运行中发生的问题，并能帮助我们快速定位问题的源头，提升软件质量。

&emsp;&emsp;在服务器开发中，我们常常使用日志来记录请求的错误和服务器异常问题，但是在前端开发中，前端工程师按照需求完成页面开发，通过产品体验确认和测试，页面就可以上线了。但不幸的是，产品很快就收到了用户的投诉。用户反映页面点击按钮没反应而且能复现，我们试了一下却一切正常，于是追问用户所用的环境，最后结论是用户使用了一个非常小众的浏览器打开页面，因为该浏览器不支持某个特性，因此页面报错，整个页面停止响应。在这种情况下，用户反馈的投诉花掉了我们很多时间去定位问题，然而这并不是最可怕的，更让我们担忧的是更多的用户遇到这种场景后便会直接抛弃这个有问题的“垃圾产品”。这个问题唯一的解决办法就是在尽量少的用户遇到这样的场景时就把问题即时修复掉，保证尽量多的用户可以正常使用。

&emsp;&emsp;首先我们需要在少数用户使用产品出错时知道有用户出错，而且尽量定位到是什么错误。由于用户的运行环境是在浏览器端的，因此可以在前端页面脚本执行出错时将错误信息上传到服务器，然后打开服务器收集的错误信息进行分析来改进产品的质量，下面我们主要讨论下错误的捕获方案。。

#### 二、现有的异常监控方案

- window.onerror全局异常捕获

&emsp;&emsp;目前前端捕获页面异常的方式主要有两种：try...catch和window.onerror。

&emsp;&emsp;window.onerror的方法可以在任何执行上下文中执行，如果给window对象增加一个错误处理函数，便既能处理捕获错误又能保持代码的优雅性了。window.onerror一般用于捕捉脚本语法错误和运行时错误，可以获得出错的文件信息，如出错信息、出错文件、行号等，当前页面执行的所有JavaScript脚本出错都会被捕捉到。

```javascript
window.onerror = function (msg, url, line){
         // 可以捕获异步函数中的错误信息并进行处理，提示Script error.
    console.log(msg);   // 获取错误信息
    console.log(url);   // 获取出错的文件路径
    console.log(line);  // 获取错误出错的行数
};

setTimeout(function() {
    console.log(obj);   // 可以被捕获到，并在onerror中处理
}, 200);
```

&emsp;&emsp;然而，使用onerror要注意，在不同浏览器中实现函数处理返回的异常对象是不相同的，而且如果报错的JavaScript和HTML不在同一个域名下，错误时window.onerror中的errorMsg全部为script error而不是具体的错误描述信息，此时需要添加JavaScript脚本的跨域设置。

```html
<script src="//www.domain.com/main.js" crossorigin></script>
```

&emsp;&emsp;如果服务器因为一些原因不能设置跨域或设置起来比较麻烦，那就只能在每个引用的文件里添加try...catch进行处理。


- try-catch运行时解决方案

&emsp;&emsp;一般来说，使用try...catch可以捕捉前端JavaScript的运行时错误，同时拿到出错的信息，例如错误信息描述、堆栈、行号、列号、具体的出错文件信息等。我们也可以在这个阶段将用户浏览器信息等静态内容一起记录下来，快速地定位问题发生的原因。需要注意的是，try...catch无法捕捉到语法错误，只能在单一的作用域内有效捕获错误信息，如果是异步函数里面的内容，就需要把function函数块内容全部加入到try...catch中执行。

```javascript
try{
    // 单一作用域try...catch可以捕获错误信息并进行处理
    console.log(obj);
}catch(e){
    console.log(e); //处理异常，ReferenceError: obj is not defined
}

try{
    // 不同作用域不能捕获到错误信息
    setTimeout(function() {
        console.log(obj); // 直接报错，不经过catch处理
    }, 200);
}catch(e){
    console.log(e);
}

// 同一个作用域下能捕获到错误信息
setTimeout(function() {
    try{
        // 当前作用域try...catch可以捕获错误信息并进行处理
        console.log(obj); 
    }catch(e){
        console.log(e); //处理异常，ReferenceError: obj is not defined
    }
}, 200);

```

&emsp;&emsp;但是在上面的这个例子中，try...catch无法获取异步函数setTimeout或其他作用域中的错误信息，这样就只能在每个函数里面添加try...catch了。

&emsp;&emsp;虽然使用window.onerror可以获取页面的出错信息、出错文件和行号，但是window. onerror有跨域限制，如果需要获取错误发生的具体描述、堆栈内容、行号、列号和具体的出错文件等详细日志，就必须使用try…catch，但是try…catch又不能在多个作用域中统一处理错误。

&emsp;&emsp;幸运的是，我们可以对前端脚本中常用的异步方法入口函数或模块引用的入口方法统一使用try…catch进行一层封装，这样就可以使用try…catch捕获每个引用模块作用域下的主要错误信息了。例如我们就可以对setTimeout函数用如下方式进行封装并捕获错误信息。另外，使用try-catch会带来一定的性能损耗，根据循环测试，平均大概会损失6%～10%的性能，但是为了提升应用的质量和稳定性，这些是可以接受的。

```javascript
function wrapFunction(fn) {
    return function() {
        try {
            return fn.apply(this, arguments);
        } catch (e) {
            console.log(e);
            _errorProcess(e);
            return;
        }
    };
}

// 之后fn函数里面的代码运行出错时则是可以被捕获到的了
fn = wrapFunction(fn);

// 或者异步函数里面的回调函数中的错误也可以被捕获到
var _setTimeout = setTimeout;
setTimeout = function(fn, time){
    return _setTimeout(wrapFunction(fn), time);
}

// 模块定义函数也可以做重写定义
var _require = require;
require = function(id, deps, factory) {
    if (typeof(factory) !== 'function' || !factory) {
        return _require(id, deps);
    } else {
        return _require(id, deps, wrapFunction(factory));
    }
};
```

&emsp;&emsp;这是我们可以对常用的模块入口函数进行重定义，包括setTimeout、setInterval、define、require等，这样模块中的主要作用域中的异常都可以通过try-catch来捕获了。在之前的处理方法中，这种方法是非常有效的，直接可以拿到大多数错误栈中的异常和堆栈信息。

&emsp;&emsp;我们可以对不同作用域的setTimeout参数函数的引入方式使用try…catch进行封装，让try…catch能捕获到setTimeout脚本中的错误并使用setTimeoutTry函数来代替。对于异步引入模块定义函数require或define也可以进行类似的封装，这样就可以获取到不同模块里面作用域的错误信息了。因此，这里捕获错误的方式可以根据具体的条件和场景灵活选择，在没有特别限制的情况下，使用window.onerror是比较高效、便捷的。

#### 三、改进的一站式解决方案

- ES6 Class的异常捕获方案

&emsp;&emsp;尽管window.onerror和try...catch结合可以解决较多的问题，但是React开发时代，这种方式就不能直接使用了，我们知道React的组件都是class，其实也就是构造函数，这里普及下class和构造函数其实是非常类似的，class A除了constructor为class A，其它信息和function A类似，typeof获取的类型也相同。但是我们是没办法把构造函数A直接装入try-catch中运行的，因为需要通过关键字new进行实例化，并创建新的作用域。

![](http://7tszky.com1.z0.glb.clouddn.com/FpDnomsz_IsC_43x0pHk2S9U8AAp)

![](http://7tszky.com1.z0.glb.clouddn.com/Fjd-fMI24ty5BJUeUPEUH-qh6IWW)

&emsp;&emsp;此时我们要处理的问题其实是捕获React中属性方法中的错误，应该还记得，JavaScript中函数有个特殊的属性prototype，当函数作为构造函数是，prototype中的属性就成了实例化后的属性方法，而且这一属性对class同样生效。那么我们可以对React中class的prototype这个特殊属性的内容进行处理，对Component中的方法函数进行封装。

```javascript

/**
 * 封装React方法的错误处理,改成使用入参的prototype中是否有render生命周期函数来判断
 * @param  {object} Component 传入组件
 * @return {object} 返回包裹后的组件
 */
function _defineReact(Component) {

    var proto = Component.prototype;
    var key;

    // 封装本身constructor中的构造方法，React组件编译为ES5后是一个构造函数，ES6下面为class
    if (_isTrueFunction(Component)) {
        Component = wrapFunction(Component);
    }

    var componnetKeys = Object.getOwnPropertyNames(proto);

    // 支持ES6类的属性方法错误捕获
    for (var i = 0, len = componnetKeys.length; i < len; i++) {
        key = componnetKeys[i];
        proto[key] = wrapFunction(proto[key])
    }

    // 支持ES5下的属性方法错误捕获
    for (key in proto) {
        if (typeof proto[key] === 'function') {
            proto[key] = wrapFunction(proto[key]);
        }
    }

    return Component;
}

/**
 * 判断是否为真实的函数，而不是class
 * @param  {Function} fn [description]
 * @return {Boolean}     [description]
 */
function _isTrueFunction(fn) {

    var isTrueFunction = false;

    try {
        isTrueFunction = fn.prototype.constructor.arguments === null;
    } catch (e) {
        isTrueFunction = false;
    }

    for (var key in fn.prototype) {
        return false;
    }
    return isTrueFunction;
}
```

&emsp;&emsp;这样通过实例化产生的React组件中的内部方法中的错误就可以被捕获到了。即使代码不通过babel编译为ES5，class里面的异常也可以被捕获到。

```javascript
class component extends React.Component {
    componentDidMount(){
        var a = {};
        console.log(a.b.c);
    }
    render() {
        return <div>hello world</div>;
    }
}
export default _defineReact(component);
```

&emsp;&emsp;这里添加defineReact的操作也可以放到构建打包工具中去处理，这样就避免了我们对代码层直接进行修改。

![](http://7tszky.com1.z0.glb.clouddn.com/FmCPi-SujhF8XxAJqkVqBWjQejMI)
React直接报错不利于定位问题

![](http://7tszky.com1.z0.glb.clouddn.com/FjmDKhbEjqlM_QhL_HHA7zzIjTi1)
封装后直接获取堆栈错误

&emsp;&emsp;另外不得不说的是react 16里面提供了componentDidCatch方法，可以直接捕获react组件里面的异常来直接上报。这样其实对于react的场景就更简单了。

- Promise内的错误捕获

&emsp;&emsp;前端代码中，如果你希望浏览直接运行ES6代码，并且使用了Promise，那就不得不重新考虑下Promise的异常捕获了。因为window.onerror并不会去捕获到Promise里面的错误。是的，连script error都没有。就是onerror不会捕获promise里面的错误，应该是早期的浏览器onerror设计没有考虑到Promise直接运行的场景。但借助try-catch封装，我们仍可以做到。

```javascript

// 如果浏览支持Promise，捕获promise里面then的报错，因为promise里面的错误onerror和try-catch都无法捕获
if (Promise && Promise.prototype.then) {
    var promiseThen = Promise.prototype.then;
    
    Promise.prototype.then = function(resolve, reject) {
        return promiseThen.call(this, _wrapPromiseFunction(resolve), _wrapPromiseFunction(reject));
    }
}

/**
 * 输入一个函数，将函数内代码包裹进try-catch执行，then的resolve、reject和普通函数不一样
 * 
 * @param {any} fn 
 * @returns 一个新的函数
 */
function _wrapPromiseFunction(fn) {

    // 如果fn是个函数，则直接放到try-catch中运行，否则要将类的方法包裹起来，promise中的fn要返回null，不能返回空函数
    if (typeof fn !== 'function') {
        return null;
    }

    return function () {
        try {
            return fn.apply(this, arguments);
        } catch (e) {
            _errorProcess(e);
            throw e;
        }
    };
}
```

&emsp;&emsp;此时，promise里面resolve和reject就都可以在try-catch的环境运行了，里面的错误也可以被顺利的捕获到。

#### 四、小结

&emsp;&emsp;小结一下，其实和原有的方式差别不大，仍然通过try-catch的方式，覆盖到React组件prototype属性中进行异常捕获，极大增加了错误捕获范围，不仅能帮助我们快速定位开发中的问题，也能捕获React线上应用的运行时错误。
