---
layout: post
title:  "css清除浮动"
date:  2014-11-07
author: ouven
tags: css 清除浮动
categories: frontend-css
cover: "assets/category/type-css.png"
---

### 一、什么是css float

理解float：元素float后，确实可以从文档流中消失，表现在他们外面的DIV的边框不能被他们撑起来。可是，文档中在他们下面的元素又确实不会和他们重叠。先理解下float做了什么。
​
|-| 是否脱离文档流 | 参考物 | 描述 |
|---|---|---|---|
| position:relative | 否 | 元素在文档流中位置 | top,left,right,bottom指定了相对于参考物位置 |
| postition:absolute | 是 | 最近外层relative元素 | 否则为body，top,left,right,bottom指定了相对于参考物位置 |
| float | 是 | 元素在文档流中位置，相对于参考物 | 尽可能向left(向左)，top(向上)，right向右，both(向两侧)|

### 二、清除浮动

#### 1，父级div自定义height

原理：父级div手动定义height，就解决了父级div无法自动获取到高度的问题。
优点：简单，代码少，容易掌握
缺点：只适合高度固定的布局，要给出精确的高度，如果高度和父级div不一样时，会产生问题
建议：不推荐使用，只建议高度固定的布局时使用
评分：★★☆☆☆

#### 2，尾处加入clear:both的空标签

原理：添加一个空div，利用css提高的clear:both清除浮动，让父级div能自动获取到高度
优点：简单，代码少，浏览器支持好，不容易出现怪问题
缺点：不少初学者不理解原理；如果页面浮动布局多，就要增加很多空div，让人感觉很不爽
建议：不推荐使用，但此方法是以前主要使用的一种清除浮动方法
评分：★★★☆☆

#### 3，父元素使用overflow:hidden触发BFC

原理：必须定义width或zoom:1，同时不能定义height，使用overflow:hidden时，浏览器会自动检查浮动区域的高度
优点：简单，代码少，浏览器支持好
缺点：不能和position配合使用，因为超出的尺寸的会被隐藏。
建议：只推荐没有使用position或对overflow:hidden理解比较深的朋友使用。
评分：★★★☆☆

#### 4，父元素使用overflow:auto触发BFC

原理：必须定义width或zoom:1，同时不能定义height，使用overflow:auto时，浏览器会自动检查浮动区域的高度
优点：简单，代码少，浏览器支持好
缺点：内部宽高超过父级div时，会出现滚动条。
建议：不推荐使用，如果你需要出现滚动条或者确保你的代码不会出现滚动条就使用吧。
评分：★★☆☆☆

#### 5，父级div定义 伪类:after和zoom

原理：IE8以上和非IE浏览器才支持:after，原理和方法2有点类似，zoom(IE转有属性)可解决ie6,ie7浮动问题
优点：浏览器支持好，不容易出现怪问题（目前：大型网站都有使用，如：腾迅，网易，新浪等等）
缺点：代码多，不少初学者不理解原理，要两句代码结合使用，才能让主流浏览器都支持。
建议：推荐使用，建议定义公共类，以减少CSS代码。
评分：★★★★☆

#### 6，让父元素也一起浮动

原理：所有代码一起浮动，就变成了一个整体
优点：没有优点
缺点：会产生新的浮动问题。
建议：不推荐使用，只作了解。
评分：★☆☆☆☆

#### 7，父元素div定义display:table

原理：将div属性变成表格
优点：没有优点
缺点：会产生新的未知问题。
建议：不推荐使用，只作了解。
评分：★☆☆☆☆

#### 8，结尾处加br标签clear:both

原理：父级div定义zoom:1来解决IE浮动问题，结尾处加 br标签 clear:both
建议：不推荐使用，只作了解。
评分：★☆☆☆☆
总结：建议使用方法3 overflow:hidden触发BFC或方法5 使用after、zoom两种方式解决问题

### 三、相对应实例如下

实例1：

```html
<style type="text/css"> 
.div1{background:#000080;border:1px solid red;/*解决代码*/height:200px;}
.div2{background:#800080;border:1px solid red;height:100px;margin-top:10px}
.left{float:left;width:20%;height:200px;background:#DDD}
.right{float:right;width:30%;height:80px;background:#DDD}
</style> 
<div class="div1"> 
    <div class="left">Left</div> 
    <div class="right">Right</div> 
</div>
<div class="div2">div2</div>
```

实例2

```html
<style type="text/css"> 
.div1{background:#000080;border:1px solid red}
.div2{background:#800080;border:1px solid red;height:100px;margin-top:10px}
.left{float:left;width:20%;height:200px;background:#DDD}
.right{float:right;width:30%;height:80px;background:#DDD}
/*清除浮动代码*/
.clearfloat{clear:both}
</style> 
<div class="div1"> 
    <div class="left">Left</div> 
    <div class="right">Right</div>
<div class="clearfloat"></div>
</div>
<div class="div2">div2</div>
```

实例3

```html
<style type="text/css"> 
.div1{background:#000080;border:1px solid red;/*解决代码*/overflow:hidden;}
.div2{background:#800080;border:1px solid red;height:100px;margin-top:10px}
.left{float:left;width:20%;height:200px;background:#DDD}
.right{float:right;width:30%;height:80px;background:#DDD}
</style> 
<div class="div1"> 
    <div class="left">Left</div> 
    <div class="right">Right</div> 
</div>
<div class="div2">div2</div>
```

实例4

```html
<style type="text/css"> 
.div1{background:#000080;border:1px solid red;/*解决代码*/overflow:auto}
.div2{background:#800080;border:1px solid red;height:100px;margin-top:10px}
.left{float:left;width:20%;height:200px;background:#DDD}
.right{float:right;width:30%;height:80px;background:#DDD}
</style> 
<div class="div1"> 
    <div class="left">Left</div> 
    <div class="right">Right</div> 
</div>
<div class="div2">div2</div>
 ```
 
实例5

```html
<style type="text/css"> 
.div1{background:#000080;border:1px solid red;}
.div2{background:#800080;border:1px solid red;height:100px;margin-top:10px}
.left{float:left;width:20%;height:200px;background:#DDD}
.right{float:right;width:30%;height:80px;background:#DDD}
/*清除浮动代码*/
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
</style> 
<div class="div1 clearfloat"> 
    <div class="left">Left</div> 
    <div class="right">Right</div> 
</div>
<div class="div2">div2</div>
```

实例6、实例7、实例8极不推荐，实例略
 