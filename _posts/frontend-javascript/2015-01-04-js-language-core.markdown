---
layout: post
title:  "javascript基础--javascript语言精髓"
date:   2015-01-04
author: ouven
tags: javascript 语言精髓
categories: frontend-javascript
cover: "assets/category/type-javascript.png"
---

### 一、精华与糟粕
    略

### 二、语法

1，铁路图
    看懂铁路图

2，注释
    建议使用//注释，不推荐使用/**/。why?

3，保留字
    undefined，NaN，Infinity等也是保留字，不能用来作为变量名，也不能作为对象属性。还有预保留字，例如int，float等，虽然没被javascript使用但仍不能作为变量使用。

4，数字类型
    javascript只有一个数字类型。整形，float，double都是number类型。NaN是一个数值，他表示一个不能产生正常结果的运算结果。Infinity表示无穷大。javascript有个Math队形，它包含一套作用于数字的方法。

5，字符串
    Unicode是16位的字符集，所以javascript中的所有字符时16位的。注意javascript没有字符类型。中文字符占3个字符。但是使用length是计算的是占位符。

6，语句
    当var 语句被用于函数内不是，它定义的是这个函数的私有变量。

7，字面量
    对象(数组)字面量是一种可以方便按照指定规则常见新对象(数组)的方法。

### 三、对象

1，对象字面量：提供一种方便创建对象值得表示法，并可以出现在任何允许表达式出现的地方。属性名可以使包括空字符串在内的字符串。例如属性名为first-name则必须使用引号。在对象字面两种如果属性名是合法标识符且不是保留字则可不用引号，否则并需要用引号，但是不同浏览器支持不同，建议所有情况都使用引号。

2，检索：使用合法标识符可以使用.来访问，否则必须通过中括号来访问。检索一个不存在的属性会返回一个TypeError异常。或运算符可以用来填充默认值。

3，引用。对象通过引用来拷贝，用于无法被拷贝。

4，原型。每个对象都连接到一个原型对象，并可以从中继承属性和方法，所用通过字面量声明的对象都连接到Object.prototype这个标准对象中。

5，反射。hasOwnProverty只会检查对象是否具有属性，不会检查原型上的属性。

6，枚举。for in列举出的对象属性名不是顺序的，若要保持顺序关系需使用数组。

7，减少全局污染。尽量使用变量容器，即多个变量使用对象字面量中。

### 四、函数

1，对象字面量产生连接到Object.prototype上，函数字面量产生连接到Function.prototype上，而Function.prototype本省连接到Object.prototype上。其它Math,Reg,Date等对象与Function类似。

2，函数调用方式：方法调用、函数调用、构造器调用、apply调用。

3，函数的arguments属性不是一个真正的数组，而是一个array-like的对象，它拥有length属性，但是不具有数组方法。

4，所有函数默认返回undefined，如果用构造方法调用则返回this(改新对象)。

5，尾递归。如果一个函数返回自身的调用结果，那么调用的过程会被替换为一个循环，可以用来提高速度。

6，闭包。内部函数可以访问创建它的外部作用域定义的属性和方法。

7，级联。构造方法返回函数对象本省可以构造级联。

8，构造器。JSLint强制约定构造器函数必须以首字母大写形式命名。


### 五、javascript缺陷：
1，全局变量。禁止全局上任何形式的直接挂载变量。

2，没有块级作用域。在每个函数开头声明所有变量。

3，自动插入分号。分号一律自己加。

4，预保留字。保留字没有在语言中使用，开发者一律避免使用。

5，Unicode。

6，typeof。typeof null结果为object，反人类。

7，parseInt。parseInt(09)返回0，所以尽量使用parseIn(09,10),后一个参数进制。

8，+。尽可以运算也可以连接。

9，不能处理浮点数。例如0.1+0.2!=0.3。而浮点数中运算的整数运算是正确的。

10，NaN。typeof Nan==='number'为true，指判断不是一个数字，判断一个值是否可以是数字最佳方法是isFinite,它会筛掉NaN和Infinity。

11，伪数组。typeof运算不能判断辨别数组和对象，要判断数组还要判断他的constructor属性。或使用Object.protytype.toString.call().

12，假值。0、NaN、''、false、null、undefined都等同于false。

13，hasOwnProverty。是一个方法，可能被不同函数或飞函数替换。

14，对象。不会有空对象，因为他会从原型链中取值。

### 六、javascript问题：
1，先看下面例子

```javascript

''=='0' //false
0==''//true
0=='0'//true

false=='false'//false
'false'=='0'  //true
'false'==undefined //false
'false'==null //false
null==undefided//true
```

2，with语句。例如with(obj){a=b}。严重影响javascript速度，因为他阻止了变量名的此法作用域绑定。永远不使用。

3，eval使用eval使程序难以阅读，也使性能和安全性下降，而且非常不安全。禁止使用。

4，continue。语句跳到循环的顶部。但是会影响代码执行效率。避免使用。

5，缺少块语句。块语句必须用花括号括起来。避免使用。

6，++和--。避免使用使代码变得整洁。

7，位运算。

8，function语句对比函数表达式。function语句在解析时会发生被提升的情况，所以function不管放到哪都会被定义到作用域顶部。语句不能以函数表达式开通，解决方法是函数使用闭包自运行，(function(){})();

9，类型包装对象。禁止使用类型包装对象。

10，new。

11，void。在javascript中void是一个运算符，接受一个值返回undefined，没有意义，避免使用。

12，for in。会遍历所以从原型链继承而来的成员元素，而且含有属性和方法。

JSON使用

1，使用JSON.parse方法代替eval进行json处理，处理eval安全的问题。

2，json结构尽量保持扁平结构提高效率。

    

    

