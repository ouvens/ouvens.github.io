---
layout: post
title:  "javascript设计模式概述"
date:   2015-01-03
author: ouven
categories: frontend-javascript
tags: javascript 设计模式
cover:  "assets/category/type-javascript.png"
---

javascript设计模式的作用，提高重用性，可读性，已维护和拓展。

### 一，元素设计。

- 私有属性和方法：函数有作用域，在函数内用var
- 关键字声明的变量在外部无法访问，私有属性和方法本质就是你希望在对象外部无法访问的变量。
- 特权属性和方法：创建属性和方法时使用的this关键字，因为这些方法定义在构造器的作用域中，所以它们可以访问到私有属性和方法；只有那些需要直接访问私有成员的方法才应该被设计为特权方法。
- 共有属性和方法：直接链在prototype上的属性和方法，不可以访问构造器内的私有成员，可以访问特权成员，子类会继承所有的共有方法。
- 共有静态属性和方法：最好的理解方式就是把它想象成一个命名空间，实际上相当于把构造器作为命名空间来使用。

### 二、设计模式与举例

1、单体模式：使用单体的方法就是用一个命名空间包含自己的所有代码的全局对象。
  示例：

```javascript
var a={};var b=function(){};
```

对象字面量和构造函数字面量都属于单体模式。
2、工厂模式：提供一个创建一系列相关或相互依赖对象的接口，而无需指定他们具体的类。
  示例：

```javascript
var base=function(){}
base.get=function(){alert('简单工厂模式');}    //简单工厂模式可直接调用
base.prototype={'get':function(){alert('抽象工厂模式')}}    /抽象工厂模式需实例化后使用

```

3、桥接模式：在实现api的时候非常有用。
  示例：

```javascript
element.onclick=function(){new func(element,param,callback);} 
```

4、装饰者模式：为对象动态增加方法或属性。
  示例：

```javascript
var obj={};obj.method=function(){};
```

5、组合模式：将对象组合成树形结构以表示“部分-整体”的层次结构。它使得客户对单个对象和复合对象的使用具有一致性。
  示例：
6、门面模式：创建统一接口，通过创建接口定义不同对象。

```javascript
var define=function(name,obj){ scope[name]=obj;}
define("loadModule",function(name,options){ return new scope[name](options);});

```

7、适配器模式： 用一个新的接口对现有类得接口进行包装。例如对不同接口的参数进行封装成统一接口。
8、享元模式。
9、代理模式(监听模式)。模式最基本的形式是对访问进行控制。代理对象和另一个对象（本体）实现的是同样的接口，可是实际上工作还是本体在做，它才是负责执行所分派的任务的那个对象或类，代理对象不会在另以对象的基础上修改任何方法，也不会简化那个对象的接口。
10、观察者模式。定义对象间的一种一对多的依赖关系，以便当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动刷新。
  
11、命令模式

```javascript
var obj={'get':function(name){alert(name)}}
obj.get('stephen');
```

12、职责链模式。

附注，在返回对象时，对象可包含多个方法。
  
