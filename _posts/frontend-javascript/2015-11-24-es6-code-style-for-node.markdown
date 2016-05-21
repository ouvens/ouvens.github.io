---
layout: post
title:  "现代前端体系-第一章 2-JavaScript发展"
date:   2016-07-18
author: ouven
tags: 现代前端体系 第一章 2-JavaScript发展
categories: modern-frontend
cover:  "assets/category/type-javaScript.png"
---

#### 1.3、JavaScript发展

&emsp;&emsp;JavaScript的诞生和早期发展史有兴趣的读者可以去查阅下，JavaScript早期是EcmaScript的一个主要部分，现在基本遵循EcmaScript规范。我们这里将从EcmaScript 5开始说起。2009年12月，ECMAScript 5.0版正式发布。Harmony项目(Harmony项目是未发布的Ecmascript 4.0，由于草案发生分歧，最后被命名Harmony代号搁置)则一分为二，一些较为可行的设想定名为JavaScript.next继续开发，后来演变成ECMAScript 6；一些不是很成熟的设想，则被视为JavaScript.next.next，在更远的将来再考虑推出。2015年6月17日，ECMAScript 6发布正式版本，即ECMAScript 2015，支持EcmaScript特性上进行了最大的修改合完善。2016年EcmaScript7确定发布。

###### 1.3.1、EcmaScript

&emsp;&emsp;具体先来看下EcmaScript 5,主要包括严格模式、JSON对象、新增Object接口、新增Array接口、Function.prototype.bind。

**严格模式**

&emsp;&emsp;Ecmascript 5的严格模式为开发者提供了更加安全规范的编程范围，通俗的说就是让一些之前不合理的语法直接报错，来提高代码的质量，例如：

- 未声明的变量赋值抛出一个ReferenceError, 而不是创建一个全局变量。
- 不止一次对对象字面量分配相同的属性会抛出SyntaxError.
- 使用with语句抛出SyntaxError.

**JSON**

&emsp;&emsp;对于JSON大家需要了解JSON.parse和JSON.stringify就好了，问题是要知道的JSON对象解析不是伴随着EcmaScript就有的，例如IE8下面，就不能直接使用JSON的解析方法。不过你可以在你的浏览器中添加es5-shim来添加es5的功能。

```
<script src="//xxx.domain.com/es5-shim.js"></script>
```

&emsp;&emsp;es5-shim的功能主要是在不兼容es5的浏览器上晚上es5新添加的功能，对于JSON对象来说，JSON.parse实现的思路是eval字符串，反之则是遍历对象进行字符串拼接。例如：

```
&emsp;&emsp;eval('(' + jsonstr + ')');
```

**新增Object接口**

根据文档Ecmascript 5规范，es5中Object新增的方法包含

|方法|描述|
|---|---|
|getPrototypeOf|返回一个对象的原型|
|getOwnPropertyDescriptor|返回某个对象自有属性的属性描述符|
|getOwnPropertyNames|返回一个数组，包括对象所有自有属性名称集合（包括不可枚举的属性）|
|create|创建一个拥有置顶原型和若干个指定属性的对象|
|defineProperty|为对象定义一个新属性，或者修改已有的属性，并未属性重新设置getter和setter，这里可以被用作数据绑定的对象劫持左右(这个我们后面讲到)|
|defineProperties|在一个对象上添加或修改一个或者多个自有属性，和defineProperty类似|
|seal|锁定对象。阻止修改现有属性的特性，并阻止添加新属性。但是可以修改已有属性的值|
|freeze|阻止对对象的一切操作和更改。冻结对象将变为只读。|
|preventExtensions|让一个对象变的不可扩展，也就是不能再添加新的属性。|
|isSealed|判断对象是否被锁定|
|isFrozen|判断对象是否被锁定|
|isExtensible|判断对象是否可以被扩展 |
|keys|返回一个由给定对象的所有可枚举自身属性的属性名组成的数组 |

&emsp;&emsp;es5对象的方方法应用非常广泛，例如处理共享数据，原型属性操作已经实现mv*框架时都被广泛应用，后面会慢慢讲到。

**新增Array接口**

|方法|描述|
|---|---|
|indexOf|返回根据给定元素找到的第一个索引值，否则返回-1|
|lastIndexOf|方法返回指定元素在数组中的最后一个的索引，如果不存在则返回 -1|
|every|测试数组的所有元素是否都通过了指定函数的测试|
|some|测试数组中的某些元素是否通过了指定函数的测试|
|forEach|让数组的每一项都执行一次给定的函数|
|map|返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组|
|filter|利用所有通过指定函数测试的元素创建一个新的数组，并返回|
|reduce|接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终为一个值|
|reduceRight|接受一个函数作为累加器，让每个值（从右到左，亦即从尾到头）缩减为一个值|

&emsp;&emsp;数组新增的方法对象为数组的操作提供了更加便利的途径。Array 还有一个新增的接口， Array.isArray 。显然此新增接口并不是实例方案，而是类似“静态方法”一样的存在，作用是判断某一对象是否为数组。

**Function.protptype.bind**

&emsp;&emsp;bind()方法会创建一个新函数，称为绑定函数。当调用这个绑定函数时,绑定函数会以创建它时传入 bind()方法的第一个参数作为 this,传入 bind() 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。此方法的用法如下：

```
fun.bind(thisArg[, arg1[, arg2[, ...]]])
```

Javascript中重新绑定 this 变量的语法糖还有 call 和 apply 。不过 bind 显然与它们有着明显的不同。 bind 将会返回一个新的函数，而 call 或者 apply 则是使用新的 this 指针直接进行函数调用。

###### 1.3.2、EcmaScript 6

EcmaScrtipt 6于2015年6年17日正式发布，也被命名为EcmaScript 2015。早在草案制定阶段，es6就被部分开发者使用在实际项目中。es6版本在es5的基础上进行了较多的改进，完善和增强。

* 一、类型规范
* 二、字符串模板
* 三、数组类型
* 四、解构类型
* 五、函数
* 六、arrow箭头函数
* 七、对象
* 八、类
* 九、模块
* 十、Iterators 和 Generators
* 十一、属性访问
* 十二、map + set + weakmap + weakset 数据结构
* 十三、promise、symbols、proxies
* 十四、统一码
* 十五、进制数支持
* 十六、不建议使用reflect对象和tail calls尾调用

###### 1.3.3、

**TypeScript**
