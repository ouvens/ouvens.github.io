---
layout: post
title:  "前端一站式异常解决方案"
date:   2017-05-04
author: ouven
tags: 前端异常 错误监控 前端监控
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---

#### 一、前端异常监控的重要性

&emsp;&emsp;软件异常监控常常直接关联到软件本身的质量，完备的异常监控体系常常能够快速定位到软件运行中发生的问题，并能帮助我们快速定位异常的源头，提升软件质量。
&emsp;&emsp;在服务器开发中，我们常常使用日志来记录请求的错误和服务器异常问题，但是在客户端，前端应用直接部署运行在用户的浏览器中，如果发生错误，应该怎样去捕获并传送给服务器呢？前端错误日志传送给服务器很简单，在异常发生时直接发请求就可以了，下面我们主要讨论下错误的捕获方案。

#### 二、现有的异常监控方案

- window.onerror全局异常捕获
&emsp;&emsp;目前前端捕获页面异常的方式主要有两种，window.onerror捕获整个页面中运行的错误，它的局限是对于跨域的JavaScript脚本需要添加跨域支持，也就是需要涉及服务器的修改成本，否则无法获取到运行时具体的堆栈错误信息，而是"script error"的信息，不利于我们定位问题。

```javascript
window.onerror = function(msg, file, row, column, errorObj) {
    console.log(msg); // script error.
    console.log(file); // 
    console.log(row); // 0
    console.log(column); // 0
    console.log(errorObj); // {}
    setTimeout(function() {
        // 发送请求上报日志信息
        errorReport(e.name, e.message + e.stack);
    }, 5000);
}
```

```html
<script src="//domain.com/path/main.js" crossorigin></script>
```

- try-catch运行时解决方案

&emsp;&emsp;现有的另一中方案则是try-catch，对于某个方法函数，我们可以这样定义来捕获函数里面运行时的异常，但是try-catch只能捕获当前单个作用域下的异常。另外，使用try-catch会带来一定的性能损耗，根据循环测试，平均大概会损失6%～10%的性能，但是为了提升应用的质量和稳定性，这些是可以接受的。

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

&emsp;&emsp;那么我们可以对常用的模块入口函数进行重定义，包括define，require等，这样模块中的主要作用域中的异常都可以通过try-catch来捕获了。在之前的处理方法中，这种方法是非常有效的，直接可以拿到大多数错误栈中的异常和堆栈信息。

#### 三、改进的一站式解决方案

&emsp;&emsp;React开发时代，这种方式就不能直接使用了，我们知道React的组件都是class，其实也就是构造函数，这里普及下class和构造函数其实是非常类似的，class A除了constructor为class A，其它信息和function A类似，typeof获取的类型也相同。但是我们是没办法把构造函数A直接装入try-catch中运行的，因为需要通过关键字new进行实例化，并创建新的作用域。

![](http://7tszky.com1.z0.glb.clouddn.com/FpDnomsz_IsC_43x0pHk2S9U8AAp)

![](http://7tszky.com1.z0.glb.clouddn.com/Fjd-fMI24ty5BJUeUPEUH-qh6IWW)

&emsp;&emsp;此时我们要处理的问题其实是捕获React中属性方法中的错误，应该还记得，JavaScript中函数有个特殊的属性prototype，当函数作为构造函数是，prototype中的属性就成了实例化后的属性方法，而且这一属性对class同样生效。那么我们可以对React中class的prototype这个特殊属性的内容进行处理，对Component中的方法函数进行封装。

```javascript
function defineReact(Component) {

    var proto = Component.prototype;

    for (var key in proto) {
        if (typeof(proto[key]) === 'function') {
            proto[key] = _wrapFunction(proto[key]);
        }
    }

    return Component;
}
```

&emsp;&emsp;这样通过实例化产生的React组件中的内部方法中的错误就可以被捕获到了。

```
class component extends React.Component {
    componentDidMount(){
        var a = {};
        console.log(a.b.c);
    }
    render() {
        return <div>hello world</div>;
    }
}
export default defineReact(component);
```

&emsp;&emsp;这里添加defineReact的操作就可以放到构建打包工具中去处理了，这样就避免了我们对代码层直接进行修改。

![](http://7tszky.com1.z0.glb.clouddn.com/FmCPi-SujhF8XxAJqkVqBWjQejMI)
React直接报错不利于定位问题

![](http://7tszky.com1.z0.glb.clouddn.com/FjmDKhbEjqlM_QhL_HHA7zzIjTi1)
封装后直接获取堆栈错误

#### 四、小结

&emsp;&emsp;小结一下，其实和原有的方式差别不大，仍然通过try-catch的方式，覆盖到React组件prototype属性中进行异常捕获，极大增加了错误捕获范围，不仅能帮助我们快速定位开发中的问题，也能捕获React线上应用的运行时错误。

完整例子：[https://github.com/ouvens/tryjs](https://github.com/ouvens/tryjs)
