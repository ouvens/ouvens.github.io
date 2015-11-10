---
layout: post
title:  "css在IE下问题及解决方法"
date:  2014-11-06
author: ouven
tags: css iebug
categories: frontend-css
cover: "assets/category/type-css.png"
---


### 1、IE6浮动双边距bug和浮动时3个像素的bug

当元素浮动并且同时有外边距时，在IE6下会产生双倍距离。

```css
.content{
    float:left;
    margin-left:10px;
}
```

其他浏览器下左边距是10px，IE6下左边距是20px

解决方法：

```css
.content{
    float:left;
    margin-left:10px;
    display:inline;
}
```

同层两个浮动的元素，都设了float：left时，标准浏览器下会贴在一起，IE下会有3个像素的间隙。

解决方法：display:inline;

### 2、奇数宽高bug


在相对定位和绝对定位下，当外层相对定位的宽度或高度是奇数时，在IE6下会产生这个bug。我们看下例子：

```html
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=gb2312">
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <title>奇数宽高bug</title>
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
        }
        .rel {
            width: 501px;
            height: 501px;
            position: relative;
            background: red;
        }

        .abs {
            width: 200px;
            height: 100px;
            position: absolute;
            background: yellow;
            right: 0;
            bottom: 0;
        }
    </style>
</head>
<body>
<div class="rel">
    <div class="abs"></div>
</div>
</body>
</html>
```

在ie6下运行可以看出，黄色背景的div并没有完全在右下角，下边和右边各留了1像素。
解决方法：将外层相对定位的div宽高改为偶数即可。

### 3、IE6 position:fixed; 无效

如今很多页面上都有分享的功能，我们可以发现随着浏览器的滚动，位置并没有变化，这是因为使用了position:fixed;效果，但是在IE6下并不支持这个属性。那怎么办呢？该如何实现这样的效果呢？很简单，在css中用表达式写js来实现这个效果。
例如：

```css
/*定位在左上角*/
.ie6fixedLT{
    position:absolute;
    left:expression(eval(document.documentElement.scrollLeft));
    top:expression(eval(document.documentElement.scrollTop));
}

/* 修正ie6振动bug */ 
 *html,*html body{
     background-image:url(about:blank);
     background-attachment:fixed;
}

```

### 4、IE6高度小于10像素bug

在IE6下有默认行高，这就使得高度小于10像素的块级元素无法显示正确的高度。
解决方法：给高度小于10像素的元素添加 font-size:0;overflow:hidden;
             
### 5、IE6最小高度

在IE6中，并不认识 min- 和 max- 前缀的宽度高度。但是有时我们做页面的时候会用到，该如何解决呢？
解决方法：
方法一：用 js 来解决（不值得推荐）

```css
.maxWidth{
    max-width:200px; 
    width:expression(this.width > 200 ? '200px' : true);
} 

 .minHeight{
     min-height:200px;
     height:expression(this.height < 200 ? '200px' : true);
}
```

解决 expression 性能问题

```css
.minWidth{
    min-width:200px; 
    width:expression(
        (function(o){o.style.width = 
        (o.width < 200 ? '200px' : o.width);})(this));
    }
```

方法二：hack写法（推荐）

```css

.minHeight{
    height:auto !important;
    height:100px;
    min-height:100px;
}
```

注意写法的顺序

### 6、IE6下div无法遮盖select

```html

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <title>div无法遮盖select</title>
    <style type="text/css">
        .wrapper-1 {
            position: relative;
            top: 10px;
            left: 26px;
            width: 300px;
            height: 300px;
        }
        .box-1 {
            position: absolute;
            top: 0;
            left: 50px;
            width: 200px;
            height: 200px;
            background: #FDF3D9;
            border: 1px solid #EEAC53;
        }
    </style>
</head>
<body>
<div class="wrapper-1">
    <select name="select" id="select">
        <option>测试选项</option>
        <option>测试选项2</option>
        <option>测试选项3</option>
    </select>
    <div class="box-1"></div>
</div>
</body>
</html>

```

产生的原因：在IE6下，浏览器将select元素视为窗口级元素，这时div或者其他元素无论z-index设置有多高，都无法遮住select元素。
解决方法：在需要遮盖的div中放入一个空的iframe。

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <title>无标题文档</title>
    <style type="text/css">
        .wrapper-1 {
            position: relative;
            top: 10px;
            left: 26px;
            width: 300px;
            height: 300px;
        }

        .box-1 {
            position: absolute;
            top: 0;
            left: 50px;
            width: 200px;
            height: 200px;
            background: #FDF3D9;
            border: 1px solid #EEAC53;
        }

        .box-1 iframe {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 200px;
            height: 200px;
            filter: alpha(opacity = 1);
        }
        </style>
</head>
<body>
<div class="wrapper-1">
    <div class="box-1">
        <!--[if IE 6]>
        <iframe frameborder="0"></iframe>
        <![endif]-->
    </div>
    <select name="select" id="select">
        <option>测试选项</option>
        <option>测试选项2</option>
        <option>测试选项3</option>
    </select>
</div>
</body>
</html>
```


7、文字溢出bug（IE6注释bug）
 形成原因：
1、一个容器包含2个具有 float 样式的子容器，且第一个子容器为内联元素
2、第二个容器的宽度大于父容器的宽度，或者父容器宽度减去第二个容器宽度的值小于3
3、在第二个容器前存在注释（ie6注释bug）

```html
<div style="width:400px;height:200px;">
    <div style="float:left;background:red;"></div>
    <!--注释-->
    <div style="float:left;width:405px;background:#ccc;">重复文字测试</div>
</div>
```

解决方法：
1、改变结构，不出现【一个容器包含2个具有float的子容器】的结构
2、减小第二个容器的宽度，使父容器宽度减去第二个容器宽度的值大于3
3、去掉注释（推荐）
4、修正注释的写法。将<!--注释-->写成<!-->注释<![endif]-->
5、将文字放入新的容器内（推荐）

```html
<div style="width:400px;height:200px;">
    <div style="float:left;background:red;"></div>
    <!--注释-->
    <div style="float:left;width:405px;background:#ccc;"><span>重复文字测试</span></div>
</div>
</div>
```

8、IE6及FF内部div使用margin-top，成为外部div的margin-top
前面几个都是介绍IE6下的bug，这次介绍FF下的bug。

 解决方法：display:inline-block;或者overflow:hidden; （BFC）
 
```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <title>firefox内部div使用margin-top，成为外部div的margin-top</title>
    <style>
    .clear {
        clear: both;
    }
    .a {
        border: 1px solid red;
    }
    .b1 {
        width: 200px;
        height: 130px;
        background: yellow;
    }
    .b2 {
        width: 200px;
        height: 130px;
        background: yellow;
        display: inline-block;
        overflow: hidden;
    }
   .c {
        width: 150px;
        height: 100px;
        background: green;
        margin-top: 30px;
    }
   </style>
</head>
<body>
<div class="a"></div>
<div class="b1">
    <div class="c">firefox内部div使用margin-top，成为外部div的margin-top</div>
</div>
<div class="clear"></div>
<br/><br/>
<div class="a"></div>
<div class="b2">
    <div class="c">这下子正常了</div>
</div>
</body>
</html>
```
 

    

    

