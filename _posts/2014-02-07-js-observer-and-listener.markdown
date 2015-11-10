---
layout: post
title:  "javascript基础--监听与观察者模式"
date: 2015-02-07
author: ouven
categories: frontend-javascript
tags: javascript基础
cover: "assets/category/type-javascript.png"
---


这里主要看下监听者模式和观察者模式的两个例子

### 1、请看监听模式的代码示例

```javscript

// 事件对象
var Event = function(obj) {
    this.obj = obj;
    this.getSource = function() {
        return this.obj;
    }
}

// 监听对象
var F2 = function() {
    this.hander = function(event) {
        var f1 = event.getSource();
        console.log("f2 do something!");
        f1.callback();
    }
}

// 被监听对象
var F1 = function() {
    this.abc = function() {
        console.log("f1 do something one!");
        // 创建事件对象
        var e = new Event(this);
        // 发布事件
        this.f2.hander(e);
        console.log("f1 do something two!");
    }
    
    this.on = function(f2) {
       this.f2 = f2;
    }
    
    this.callback = function() {
       console.log("f1 callback invoke!");
    }
}

// 主函数
function main() {
    var f1 = new F1();
    var f2 = new F2();
    // 加入监听
    f1.on(f2);
    f1.abc();
}

// 运行主函数
main();

```

监听模式示例运行结果： 
引用

f1 do something one! 
f2 do something! 
f1 callback invoke! 
f1 do something two! 

### 2、观察者模式的代码示例： 

```javscript
// 观察者对象1
var F2 = function() {
    this.update = function(observable, obj) {
        console.log("f2 do something!");
        for (var i=0, len=obj.length; i<len; i++) {
            console.log(obj[i]);
        }
        observable.callback();
    }
}

// 观察者对象2
var F3 = function() {
    this.update = function(observable, obj) {
        console.log("f3 do something!");
        for (var i=0, len=obj.length; i<len; i++) {
            console.log(obj[i]);
        }
        observable.callback();
    }
}

// 被观察对象
var F1 = function() {
    // 保存所有观察者
    var observers = [];
    
    this.abc = function() {
        console.log("f1 do something one!");
        var datas = ["苹果", "桃子", "香蕉"];
        // 通知所有观察者
        this.notifyObservers(datas);
        console.log("f1 do something two!");
    }
    
    this.addObserver = function(observer) {
       observers.push(observer)
    }
    
    this.callback = function() {
       console.log("f1 callback invoke!");
    }
    
    this.notifyObservers = function(arg){
        if (observers.length == 0) {
           return;
        };
        for (var i = 0, len = observers.length; i < len; i++) {
            observers[i].update(this, arg);
        }
    }
}

// 主函数
function main() {
    var f1 = new F1();
    var f2 = new F2();
    var f3 = new F3();
    // 加入观察者
    f1.addObserver(f2);
    f1.addObserver(f3);
    f1.abc();
}

// 运行主函数
main();

```

观察者模式示例运行结果： 
引用

f1 do something one! 
f2 do something! 
苹果 
桃子 
香蕉 
f1 callback invoke! 
f3 do something! 
苹果 
桃子 
香蕉 
f1 callback invoke! 
f1 do something two!

---

### 总结:

1、在观察者模式示例中，被观察的对象有两个观察者，因此两个观察者的逻辑被各自调用了；在监听模式示例中，被监听的对象只有一个监听者，因此只有一个监听者逻辑被调用了。监听模式示例中的监听者也可以有多个，但通知的时候需要逐一通知，比较麻烦，而观察者就方便多了，所以，当一个对象只有一个需要通知的对象时，使用监听者模式比较简单，而当需要通知的对象比较多时，采用观察者模式比较简单明了，这些要结合相应的业务场景，譬如，邮件列表的订阅就适合用观察者模式。

2、这两种模式都使用了回调的机制，唯一区别不同的是，监听模式使用一个Event对象来保留回调的钩子（事件源处传入的对象，一般是被监听者本身），而观察者模式没有抽象Event事件对象，使用参数的方式将钩子传到观察者，并附带传入了一些其他的信息。因此，观察者模式和监听者模式都是使用回调机制，其设计思想异曲同工。

3、这两种模式都是采用了对象之间组合的方式进行职责解耦，这是软件设计的指导性思想，无论我们是否很精确的实现这两种设计模式，只要在设计中把握尽量采用组合方式，我们的软件结构就会相对比较清晰，耦合度就相对比较低了，这是这两种设计模式给我们的启示！
