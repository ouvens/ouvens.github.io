---
layout: post
title:  "css居中与自适应布局"
date:  2014-11-08
author: ouven
tags: css 居中自适应布局
categories: frontend-css
cover: "assets/category/type-css.png"
---


### 一、居中的世界

1、使用inline-block，vertical-align，line-height。(推荐写法)

```html
<!doctype html>
<html>
<head>
<style>
body{
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    display: inline-block;
    line-height: 500px;
    vertical-align: middle;
    text-align: center;
    background: green; 
}
.inline{
    width:50px;
    height: 50px;
    border: 1px red solid;
    display: inline;
    padding: 10px;
    background: red;
}
</style>
</head>
<body>
    <div class="inline" id="a">inline</div>
</body>
</html>
```

优点使用简单，兼容性好，缺点是内部元素必须为inline，line-height只能为像素值。

2、使用position:absolute、top/left、margin-top/margin-left。使用简单，但性能不好。

3、使用margin-top: expression((a.clientHeight-50)/2)，性能低禁用。

4、父元素使用

```css
{
    display: table-cell;
    height: 300px;
    vertical-align: middle;
}
```

IE不支持，不推荐。

5、水平居中使用margin：0 auto;和text-align:center，但注意层级关系。

### 二、自适应布局(四种写法，三种方案)

1、使用position：absolute.

```html
<!doctype html>
<html>
<head>
<style>
body{
    width: 100%;
    padding: 0;
    margin: 0;
}
div{
    height: 500px;
}

.div1{
    width: 100px;
    background: red;
    float: left;
}
.div2{
    height: 500px;
    background: blue;
    position: absolute;
    left: 100px;
    right: 100px;
}
.div3{
    width: 100px;
    background: green;
    float: right;
}
</style>
</head>
<body>
<div class="div1">i</div>
<div class="div2">ii</div>
<div class="div3">iii</div>
</body>
</html>
```

优点实现简单，缺点由于使用absolute性能不好。也可以使最左和最右的div绝对定位。

```html
<!doctype html>
<html>
<head>
<style>
body{
    width: 100%;
    padding: 0;
    margin: 0;
}
div{
    height: 500px;
}

.div1{
    width: 100px;
    background: red;
    position: absolute;
    left: 0;
        top:0;
}
.div2{
    margin: 0 100px;
    background: blue;
}
.div3{
    width: 100px;
    background: green;
    position: absolute;
    right: 0;
        top:0;
}
</style>
</head>
<body>
<div class="div1">i</div>
<div class="div2">ii</div>
<div class="div3">iii</div>
</body>
</html>
```

2、使用margin负值法。该方法中间元素需放在最前面，而且里面包含两层div，难以理解。

```html
<!doctype html>
<html>
<head>
<style>
body{
    width: 100%;
    padding: 0;
    margin: 0;
}
div{
    height: 500px; 
}

.div1{
    width: 100px;
    background: red;
    float: left;
    margin-left: -100%;
}
.div2{
    width: 100%;
    float: left;
    background: blue
}
.div2 div{
    margin: 0 100px;
}
.div3{
    width: 100px;
    background: green;
    float: right;
    margin-left: -100px;
}
</style>
</head>
<body>
<div class="div2"><div>ii</div></div>
<div class="div1">i</div>
<div class="div3">iii</div>
</body>
</html>
```

3、使用自身浮动。该方法中间的只能放在后面。

```html
<!doctype html>
<html>
<head>
<style>
body{
    width: 100%;
    padding: 0;
    margin: 0;
}
div{
    height: 500px;
}

.div1{
    width: 200px;
    background: red;
    float: left;
}
.div2{
    margin: 0 200px;
    background: blue;
}
.div3{
    width: 200px;
    background: green;
    float: right;
}
</style>
</head>
<body>
<div class="div1">i</div>
<div class="div3">iii</div>
<div class="div2">ii</div>
</body>
</html>
```