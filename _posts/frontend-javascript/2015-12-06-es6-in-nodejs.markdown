---
layout: post
title:  "Nodejs下的ES6兼容性与性能分析"
date:   2015-12-06
author: ouven
tags:   es6 nodejs 兼容性
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---

ES6标准发布后，前端人员也开发渐渐了解到了es6，但是由于兼容性的问题，仍然没有得到广泛的推广，不过业界也用了一些折中性的方案来解决兼容性和开发体系问题，但大家仍很疑惑，使用ES6会有哪些兼容性问题。

#### 一、Nodejs下ES6兼容性现状
&emsp;&emsp;之前写了es6通过Babel编译后的在浏览器端的兼容性问题[《Babel下的ES6兼容性和规范》](http://ouvens.github.io/frontend-javascript/2015/10/16/es6-under-babel.html)，随着范围的扩展，ES6在Nodejs上兼容性也有必要重新梳理下。
&emsp;&emsp;随着iojs的引入，新版的Nodejs开始原生支持部分ES6的特性，既然ES6在浏览器端使用需要使用babel等编译，在Nodejs总可以放心使用了吧。然而事实并非如此，为此在nodejs端，我也做了特性兼容性研究：

### ES6新特性在Nodejs下的兼容性列表
这里罗列下nodejs支持的新特性，没列出的新特性均为不支持。

https://iojs.org/en/es6.html
https://kangax.github.io/compat-table/es6/

| ES6特性 | Nodejs兼容性 |
|------|------|
|let,const,块 | strict模式支持 |
|class类 | strict模式支持 |
|Map，Set 和 WeakMap，WeakSet | 支持 |
|generators | 支持 |
|进制转换| 支持 |
|对象字面量扩展 | 支持 |
|promise| 支持 |
|String对象新API | 支持 |
|symbols | 支持 |
|字符串模板 | 支持 |

可见，es6的新特性在Nodejs中比babel还要差，而新版的babel已经能够支持es6的90%新特性了~

#### 二、Nodejs ES6性能分析
&emsp;&emsp;尽管目前Node下使用ES6我们仍然会大失所望，但es6发展的趋势定是必然，这里还是有必要对ES6的原生性能做了详细的对比测试。测试基本方法：

**1，对于重复操作循环执行100万次**
**2，所有程序运行在Nodejs下执行**
**3，环境描述**
- CPU： Interl(R) Core(Tm) i5-3470 CPU @ 3.2GHz
- 内存：4.00GB
- 操作系统： 64位操作系统
- node版本：node v5.1.1

**2.1、let, const, 块**

| 运行次数 | ES5运行时间 | ES6运行时间 |
|------|------|------|
| 100万 | 52-53ms | 33-34ms |

结果让我震惊了，使用let，const声明变量的速度竟然比var快了约65%左右。原因可能是使用var会去检查作用域上的同名变量，而使用let或const不用考虑。

**2.2、class类使用**
| 运行次数 | ES5运行时间 | ES6运行时间 |
|------|------|------|
| 10万 | 1179-1211ms | 1411-1442ms |

可见使用Nodejs的Class比ES的function构造方法慢约25%

**2.3、Map，Set 和 WeakMap，WeakSet**
 | 运行次数 | ES5运行时间 | ES6运行时间 |
|------|------|------|
| 100万 | 11-13ms | 179-180ms |

测试结果看，Map的效率相对普通的对象key-value的结果相比慢的多，但是Map的Key可以使负责类型，这里的参考性也就不是绝对准确。建议是不到必须情况，不要使用Map等复杂类型。Set、WeakMap、WeakSet均相对object结构执行效率慢得多。

**2.4、字符串模板**
| 运行次数 | ES5运行时间 | ES6运行时间 |
|------|------|------|
| 100万 | 8ms | 59-61ms |

ES6的字符串模板看起来很好，但是由于执行时必须扫描这个串，找出里面的模板变量，所以整体上性能就相对ES5的字符串拼接慢了很多。

其它的特性实现有兴趣的同学可以自己继续研究。相信结果大概可以预测到。

[测试用例代码地址](https://github.com/ouvens/demo-file/tree/master/es6-performance-test)

#### 三、小结
&emsp;&emsp;这里选择了ES6中的少数特性和ES5的实现的执行效率做了对比，整体上说，ES6的新特性相对ES5的实现效率慢些，而有些特性当然是ES5无法实现的。所以在了解使用ES6的同时，除了了解它的新特性和优点，对于ES6本身的一些问题也要做到心中有数。当然，随着ES6的完善和Node的更新，相信这些也不会是大的问题，而且这些也不会影响ES6的发展。

&emsp;&emsp;https://github.com/ouvens/ecmaScript-2015-babel-rules