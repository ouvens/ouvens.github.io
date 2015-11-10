---
layout: post
title:  "javascript基础--深入理解proto与__proto__"
date:  2014-05-16
author: ouven
tags: javascript proto __proto__
cover: "assets/category/type-javascript.png"
---

这里重新讲述prototype原型这个概念，今天我们深度的分析下prototype与____proto____。



### 例子

```javascript
var Person = function(name)  
 {  
     this.name = name ;  
 };  
var p = new Person("Ben");  
console.log(p.name);  
```

代码简单的 你不用说明了，如果现在让大家根据上面的代码画一张包含Function与Object的内存图，大家肯定回想什么叫包含Function与Object，上面的代码和它们有几毛钱的关系。好了，下面我先按要求把图画出来，大家参考下：

![](http://7tszky.com1.z0.glb.clouddn.com/Fr5kpmvSgM5JuW4gJF66-xtsAMB9)

解析下：

1、任何一个由构造器产生的对象都有____proto____属性，且此属性指向该构造器的prototype。

2、所有构造器/函数的____proto____都指向Function的prototype

拿第2条对比第1条，貌似我们发现了什么，没错函数的构造器就是Function，看下面的代码：

```javascript
//函数表达式  
    var Person = function(name)  
    {  
        this.name = name ;  
    };  
     //函数声明  
     function Person(name)  
     {  
         this.name = name ;  
     }  
     //上面两种方式实际上就相当与new Function  
     var Person = new Function("name" , "this.name = name ;" );  
```

当然了不能说说，下面看代码验证：

```javascript
    console.log(Person.__proto__ === Function.prototype);  //true  
    console.log(typeof p.__proto__);//objcect  
    console.log(p.__proto__.__proto__ === Object.prototype); //true  
```

有人会问，那么Function与Object的prototype,__prop__到底是什么呢？

```javascript
    console.log(Object.__proto__ === Function.prototype); // true  
   console.log(Function.__proto__ === Function.prototype); //true  
   console.log(Function.prototype.__proto__ == Object.prototype); //true  
   console.log(Object.prototype.__proto__); //null  
```

有此可见

1、所有的构造器包括Object和Function都继承了Function.prototype的方法，由第三行可知所有的构造器都是对象，即js中一切皆为对象。

2、____proto____最终的指向都是Object.prototype，这也就是js中的原型链。



最后我们看一下Object的文档：

Properties
The following table lists properties of the Object Object.

| Property | Description |
|---|---|
| ____proto____ Property | Specifies the prototype for an object. |
| constructor Property | Specifies the function that creates an object.|
| prototype Property | Returns a reference to the prototype for a class of objects.|

发现Object还有个constructor属性。
1、constructor属性指向的是创建当前对象的构造函数。

2、每个函数都有一个默认的属性prototype，而这个prototype的constructor默认指向这个函数

看下面的例子：

```javascript
//函数表达式  
var Person = function(name)  
{  
    this.name = name ;  
};  

var p = new Person("Ben");  

console.log(p.constructor === Person);//true  
console.log(Person.prototype.constructor === Person);  //true  
console.log(Person.prototype instanceof  Object);  //true  
console.log(Person.prototype instanceof  Person);  //false  
//改变Person的prototype  
Person.prototype = {name:"123"} ;  
var p2 = new Person("Ben");  
console.log(p2.constructor === Object);//true  
console.log(p2.constructor === Person.prototype.constructor);//true  
console.log(Person.prototype.constructor === Object);//true  
console.log(Person.prototype.constructor === Person);//false  
```

当改变Person的prototype时，会发现，Person.prototype.constructor指向了Object，主要是因为:

Person.prototype = {name:"123"} 相当于Person.prototype=new Object({name:"123"} );此时的构造器变成了Object.


### 再具体看下____proto____是什么

____proto____ 属性可用于设置对象的原型。
该对象或函数继承新原型的所有方法和属性，以及新原型的原型链中的所有方法和属性。 对象可以仅有一个原型（不包括原型链中继承的原型），因此当您调用 ____proto____ 属性时，将替换以前的原型。

Object.prototype.____proto_____
Object.prototype.____proto____ is an accessor property with attributes { [[Enumerable]]: false, [[Configurable]]:true }. The [[Get]] and [[Set]] attributes are defined as follows

B.2.2.1.1
get Object.prototype.____proto____

> The value of the [[Get]] attribute is a built-in function that requires no arguments. It performs the following steps:

- Let O be the result of calling ToObject passing the this value as the argument.
- ReturnIfAbrupt(O).
- Return the result of calling the [[GetPrototypeOf]] internal method of O.
B.2.2.1.2
set Object.prototype.____proto____

> The value of the [[Set]] attribute is a built-in function that takes an argument proto. It performs the following steps:

- Let O be RequireObjectCoercible(this value).
- ReturnIfAbrupt(O).
- If Type(proto) is neither Object nor Null, then return undefined.
- If Type(O) is not Object, then return undefined.
- Let status be the result of calling the [[SetPrototypeOf]] internal method of O with - - argument proto.
- ReturnIfAbrupt(status).
- If status is false, then throw a TypeError exception.
- Return undefined. 

 