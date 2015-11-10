---
layout: post
title:  "html与css编码规范"
date:   2014-01-05
author: ouven
tags: 前端 html与css 编码规范
categories: frontend-resource
cover:  "assets/category/type-client.png"
---


### 1. 规范概述

规范的制定是我们长期以来对工作的积累与沉淀的产物，帮助我们更快、更好、更高效的完成繁重、复杂、多样化的任务，我们制作规范的主要目的在于：
- 降低每个组员介入项目的门槛成本；
- 提高工作效率及协同开发的便捷性；
- 高度统一的代码风格；
- 提供一整套HTML、CSS解决方案，来帮助开发人员快速做出高质量的符合要求的页面；

### 2. 基本信息

| 规范名称 | Cook |
|---|---|
| 制订日期 | 2013.12.18 |
| 当前版本 | beta0.1 |
| 对规范进行初步定义 | 规范制定|
| 最后更新 | 2014.12.19|


### 3. 文档目录结构

待添加。

### 4. 通用约定

#### 4.1 分离

- 结构（HTML）、表现（CSS）、行为分离（JavaScript）
将结构与表现、行为分离，保证它们之间的最小耦合，这对前期开发和后期维护都至关重要

#### 4.2 缩进

- 使用tab（4个空格宽度）来进行缩进，可以在IDE里进行设置
- 
#### 4.3 编码

- 以 UTF-8 无 BOM 编码作为页面格式；
- 在HTML中文档中用 <meta charset="utf-8"> 来指定编码；
- 不需要为CSS显示定义编码，因为它默认为utf-8；

#### 4.4 小写

- 所有的HTML标签必须小写
- 所有的HTML属性必须小写
- 所有的样式名及规则必须小写

#### 4.5 注释

- 尽可能的为你的代码写上注释。解释为什么要这样写，它是新鲜的方案还是解决了什么问题。

#### 4.6 待办事项

- 用 TODO 标示待办事项和正在开发的条目

```html

<!-- TODO: 图文混排 -->

<div class="g-imgtext">
<img src=”1.png” alt="">
 ...
/* TODO: 图文混排 comm: g-imgtext */

.g-imgtext{...}

```
 
#### 4.7 行尾空格

- 删除行尾空格，这些空格没有必要存在

#### 4.8 代码有效性

- 使用 http://validator.w3.org/ 来验证你的HTML代码有效性；
- 使用 http://jigsaw.w3.org/css-validator/ 来验证你的CSS代码有效性；
代码验证不是最终目的，真的目的在于让开发者在经过多次的这种验证过程后，能够深刻理解到怎样的语法或写法是非标准和不推荐的，即使在某些场景下被迫要使用非标准写法，也可以做到心中有数

### 5. HTML规范

#### 5.1 文档类型

- 统一使用HTML5的标准文档类型：<!doctype html>
HTML5文档类型具备前后兼容的特质，并且易记易书写

- 在文档doctype申明之前，不允许加上任何非空字符
任何出现在doctype申明之前的字符都将使得你的HTML文档进入非标准模式

- 不允许添加<meta>属性强制改变文档模式
避免出现不可控的问题

#### 5.2 省略type属性


- 在调用CSS和JavaScript时，可以将type属性省略不写
不推荐：

```html
<link type="text/css" rel="stylesheet" href="base.css">
<script type="text/javascript" src="base.js"></script>
```

推荐：

```html
<link rel="stylesheet" href="base.css">
<script src="base.js"></script>
```

因为HTML5在引入CSS时，默认type值为text/css；在引入JavaScript时，默认type值为text/javascript

#### 5.3 用双引号包裹属性值

- 所有的标签属性值必须要用双引号包裹，同时也不允许有的用双引号，有的用单引号的情况

```html
不推荐：
<a href=http://www.qunar.com class=home>首页</a>
推荐：
<a href="http://www.qunar.com" class="home">首页</a>
```

#### 5.4 属性值省略
- 非必须属性值可以省略

```html
不推荐：
<input type="text" readonly="readonly">
<input type="text" disabled="disabled">
```

推荐：

```html
<input type="text" readonly>
<input type="text" disabled>
```

这里的 readonly 和 disabled 属性的值是非必须的，可以省略不写，我们知道HTML5表单元素新增了很多类似的属性，如: required

####  5.5 嵌套
- 所有元素必须正确嵌套，不允许交叉，不允许inline元素包含block元素，不允许类似在ul下出现除了li外的其它子元素等等
不推荐：

```html
<span>
　　　<h1>这是一个块级h1元素</h1>
　　　<p>这是一个块级p元素</p>
</span>
<ul>
　　　<h3>xx列表</h3>
　　　<li>asdasdsdasd</li>
　　　<li>asdasdsdasd</li>
</ul>
```

推荐：

```html
<div>
　　　<h1>这是一个块级h1元素</h1>
　　　<p>这是一个块级p元素</p>
</div>
<div>
    <h3>xx列表</h3>
    <ul>
        <li>asdasdsdasd</li>
        <li>asdasdsdasd</li>
    </ul>
</div>
```

规则可参考：http://www.cs.tut.fi/~jkorpela/html/strict.html由于某些现实原因，在HTML5中对a元素做了一些变更，a元素除了可以包含inline元素外，也将可以包含block元素了。

#### 5.6 标签闭合

- 非自闭合标记必须关闭

```html
不推荐：
<div>balabala...

推荐：
<div>balabala...</div>
```
 

 

虽然有些标记没有要求必须关闭，但是为了避免出错的几率，要求必须全部关闭，省去判断某标记是否需要关闭的时间

- 自闭合标记无需关闭

```html
<base> <br> <col> <embed> <hr> <img> <input> <link> <meta> <param>...
```
 
#### 5.7 使用img的alt属性

- 为img元素加上alt属性

```html
不推荐：
<img src="banner.jpg">

推荐：
<img src="banner.jpg" alt="520即将到来，爱就大声说出来">
```

alt属性的内容为对该图片的简要描述，这对于盲人用户和图像损毁都非常有意义，即无障碍
对于纯粹的装饰性图片，alt属性值可以留空，如 alt=""

#### 5.8 使用label的for属性

- 为表单元素label加上for属性

```html
不推荐：
<label><input type="radio" name="color" value="0">蓝色</label>
<label><input type="radio" name="color" value="1">粉色</label>

推荐：
<label for="blue"><input type="radio" id="blue" name="color" value="0">蓝色</label>
<label for="pink"><input type="radio" id="pink" name="color" value="1">粉色</label>
```

for属性能让点击label标签的时候，同时focus到对应的 input 和 textarea上，增加响应区域

#### 5.9 按模块添加注释

- 在每个模块开始和结束的地方添加注释

```html
<!-- comment -->
注释内容左右两边保留和注释符号有1个空格位
在注释内容内不允许再出现中划线“-”，某些浏览器会报错

<!-- 新闻列表模块 -->
<div id="news" class="g-mod"
...
<!-- /新闻列表模块 -->
<!-- 排行榜模块 -->
<div id="topic" class="g-mod"
...
<!-- /排行榜模块 -->
```

#### 5.10 格式

- 将每个块元素、列表元素或表格元素都放在新行
- Inline元素视情况换行，以长度不超过编辑器一屏为宜
- 每个子元素都需要相对其父级缩进

```html
不推荐：
<div><h1>asdas</h1><p>dff<em>asd</em>asda<span>sds</span>dasdasd</p></div>

推荐：
<div>
　　　<h1>asdas</h1>
　　　<p>dff<em>asd</em>asda<span>sds</span>dasdasd</p>
</div>
```

#### 5.11 语义化标签

- 在合适的场景选择语义合适的标签
- 禁止使用被废弃的用于表现的标签，如 center, font等
- 部分在XHTML1中被废弃的标签，在HTML5中被重新赋予了新的语义，在选用时请先弄清其语义，如:b, i, u等

- 元素据标记
head, title, base, link, meta, style

- 章节标签
html, body, section, nav, article, aside, h1, h2, h3, h4, h5, h6, hgroup, header, footer, address

- 脚本标记
script, noscript

- 分组内容标记
p, hr, pre, blockquote, ol, ul, li, dl, dt, dd, figure, figcaption, div


- 文本标签
a, em, strong, small, s, cite, q, dfn, abbr, time, code, var, samp, kbd, sub, sup, i, b, u, mark, ruby, rt, rp, bdi, bdo, span, br, wbr, ins, del

- 媒体标签
img, iframe, embed, object, param, video, audio, source, track, canvas, map, area

- 互动标签
details, summary, command, menu

- 表单标签
form, fieldset, legend, label, input, button, select, datalist, optgroup, option, textarea, keygen, output, progress, meter

- 表格标签
table, caption, colgroup, col, thead, tbody, tfoot, tr, td, th

- 参考文档：
http://www.w3.org/TR/html5/
http://dev.w3.org/html5/markup/elements.html

#### 5.12 文档模板

```html
<!doctype html>
<html lang="zh-cn">
<head>
<meta charset="utf-8">
<title>网站项目名称-网站名称</title>
<link href="*.css" rel="stylesheet">
</head>
<body>
<div id=”doc”>
　　　<header id="hd">
　　　　　　头部诸模块
　　　</header >
　　　<div id="bd">
　　　　　　主体部分诸模块
　　　</div>
　　　<footer id="ft">
　　　　　　底部诸模块
　　　</footer>
</div>
<script src="*.js"></script>
</body>
</html>
```

所有的项目页面都可以直接使用上述的标准文档模板，并根据实际情况做 “加法” ，诸如meta的description, keywords之类，其中#doc级别不是必须的，视情况加减

#### 5.13 模块模板

```html
<section class="m-xxx g-mod">
　　　<header class="m-xxx-hd">
　　　　　　头部区域
　　　</header>
　　　<div class="m-xxx-bd">
　　　　　　模块正文
　　　</div>
　　　<footer class="m-xxx-ft">
　　　　　　底部区域
　　　</footer>
</section>
```

所有的模块默认都是上面这种固有结构，特殊情况可视场景而变，换句话说，有的时候你的某个模块可能会是一个aside。

### 6. CSS规范

#### 6.1 CSS文件规范

- 一律使用link的方式调用外部样式
使用fekit时，会处理样式内部的@import依赖关系，同时会合并文件，所以这里不反对使用在css文件内部使用@import

#### 6.2 样式的命名约定

__6.2.1 命名组成元素__

- 命名必须由单词、中划线 ① 组成。例如：.detail, .news-list, #topic, and etc...
- 不推荐使用拼音来作为样式名，尤其是缩写的拼音、拼音与英文的混合
- 所有命名都使用小写
①我们使用中划线 “-” 作为连接字符，而不是下划线 "_"。
我们知道2种方式都有不少支持者，但 "-" 能让你少按一次shift键，并且更符合CSS原生语法，所以我们只选一种目前业内普遍使用的方式

__6.2.2 前缀规范__

| 前缀 | 说明 | 示例|
|---|--|--|
| g- | 全局通用样式命名，前缀g全称为global，一旦修改将影响全站样式 |g-mod |
| m- | 模块命名方式 | m-detail |
| ui- | 组件命名方式 | ui-selector |
| J- | 所有用于纯交互的命名，不涉及任何样式规则。JSer拥有全部定义权限 | J-switch |

不允许出现以类似：.info, .current, .news 开头的选择器，比如：

```css
.info{sRules;} 
```

因为这样将给我们带来不可预知的管理麻烦以及沉重的历史包袱。你永远也不会知道哪些样式名已经被用掉了，如果你是一个新人，你可能会遭遇，你每定义个样式名，都有同名的样式已存在，然后你只能是换样式名或者覆盖规则。所以我们推荐这样写：

```css
.m-xxx .info{sRules;}
```

所有的选择器必须是以 g-, m-, ui- 等有前缀的选择符开头的，意思就是说所有的规则都必须在某个相对的作用域下才生效，尽可能减少全局污染。
J- 这种级别的className完全交由JSer自定义，但是命名的规则也可以保持跟重构一致，比如说不能使用拼音之类的

__6.2.3 命名单词的选择规范__

- 不以表现来命名，而是根据内容来命名。比如：left, right, center, red, black这种以表现来定命名，不允许出现；
- 推荐使用功能和内容相关词汇的命名，如：navigation, news, type, search
(待大家总结)

__6.2.4 样式命名缩写规范__

原则：缩写后还能较为清晰保持原单词所能表述的意思，如：

navigation   =>  nav
header       =>  hd
information  =>  info

__6.2.5 复用与重写规范__

参见模块化设计

__6.2.6 id与className的使用规范__

- id只可能出现在document layout级别上，意思就是说页面工程师几乎没有写id的场景，除了layout搭建者外

#### 6.3 书写风格与排版规范

__6.3.1 视觉封装__

- CSS代码书写不分行
- 不要以缩进的方式来体现层级关系

```css
不推荐：
.g-box{ sRules; }
　　　.g-box-hd .xx{ sRules; }
　　　　　　.g-box-hd .xx .aa{ sRules; }
推荐：
.g-box{ sRules; }
.g-box-hd .xx{ sRules; }
.g-box-hd .xx .aa{ sRules; }
```
 

 

这些都是为了达到简易视觉封装和一致性，让肉眼可以迅速以开头选择器作为检索的流从而主观识别区块

__6.3.2 规则与分号__

*每条规则结束后都必须加上分号

```css
不推荐：
body{margin:0;padding:0;font-size:14px}

推荐：
body{margin:0;padding:0;font-size:14px;}
```

__6.3.3 0与单位__

- 如果属性值为0，则不需要为0加单位

```css
不推荐：
body{margin:0px;padding:0px;}

推荐：
body{margin:0;padding:0;}
```

__6.3.4 0与小数__

- 如果是0开始的小数，前面的0可以省略不写
```css
不推荐：
body{opacity:0.6;text-shadow:1px 1px 5px rgba(0,0,0,0.5);}

推荐：
body{opacity:.6;text-shadow:1px 1px 5px rgba(0,0,0,.5);}
```

__6.3.5 去掉uri中引用资源的引号__

- 不要在url()里对引用资源加引号

不推荐：
```css
body{background-image:url("sprites.png");}
@import url("global.css");
```

推荐：
```css
body{background-image:url(sprites.png);}
@import url(global.css);
```

6.3.6 HEX颜色值写法
- 将所有的颜色值小写
- 可以缩写的缩写至3位

```css
不推荐：
body{background-color:#FF8000;}

推荐：
body{background-color:#f00;}
```

#### 6.4 样式规则书写顺序

- 遵循先布局后内容的顺序。

```css
.g-box{
　　　display:block;
　　　float:left;
　　　width:500px;
　　　height:200px;
　　　margin:10px;
　　　padding:10px;
　　　border:10px;
　　　background:#aaa;
　　　color:#000;
　　　font:14px/1.5 sans-serif;
}
```

这个应该好理解，比如优先布局，我们知道布局属性有 display, float, overflow 等等；内容次之，比如 color, font, text-align 之类。
- 组概念。
拿上例的代码来说，如果我们还需要进行定位及堆叠，规则我们可以改成如下：

```css
.g-box{
　　　display:block;
　　　position:relative;
　　　z-index:2;
　　　top:10px;
　　　left:100px;
　　　float:left;
　　　width:500px;
　　　height:200px;
　　　margin:10px;
　　　padding:10px;
　　　border:10px;
　　　background:#aaa;
　　　color:#000;
　　　font:14px/1.5 sans-serif;
}
```

从代码中可以看到，我们直接将z-index, top, left 紧跟在 position 之后，因为这几个属性其实是一组的，如果去掉position，则后3条属性规则都将失效。
- 私有属性在前标准属性在后

```css
.g-box{
　　　-webkit-box-shadow:1px 1px 5px rgba(0,0,0,.5);
　　　   -moz-box-shadow:1px 1px 5px rgba(0,0,0,.5);
　　　    -ms-box-shadow:1px 1px 5px rgba(0,0,0,.5);
　　　     -o-box-shadow:1px 1px 5px rgba(0,0,0,.5);
　　　        box-shadow:1px 1px 5px rgba(0,0,0,.5);
}
```

当有一天你的浏览器升级后，可能不再支持私有写法，那么这时写在后面的标准写法将生效，避免无法向后兼容的情况发生。

#### 6.5 注释规范

- 保持注释内容与星号之间有一个空格的距离

__6.5.1 普通注释（单行）__

/* 普通注释 */

__6.5.2 区块注释__

```css
/**
 * 模块：m-detail
 * author: joy.du
 * edit:   2013.12.19
 */
```

有特殊作用的规则一定要有注释说明
应用了高级技巧的地方一定要注释说明

#### 6.6 hack规范

- 尽可能的减少对Hack的使用和依赖，如果在项目中对Hack的使用太多太复杂，对项目的维护将是一个巨大的挑战；
- 使用其它的解决方案代替Hack思路；
- 如果非Hack不可，选择稳定且常用并易于理解的；

```css
.test{
    color:#000;       /* For all */
    color:#111\9;     /* For all IE */
    color:#222\0;     /* For IE8 and later, Opera without Webkit */
    color:#333\9\0;   /* For IE8 and later */
    color:#444\0/;    /* For IE8 and later */
    [;color:#555;];   /* For Webkit, IE7 and earlier */
    *color:#666;      /* For IE7 and earlier */
    _color:#777;      /* For IE6 and earlier */
}
```

- 严谨且长期的项目，针对IE可以使用条件注释作为预留Hack或者在当前使用
IE条件注释语法：

```html
<!--[if <keywords>? IE <version>?]>
<link rel=”stylesheet” href=”*.css” />
<![endif]-->
```

语法说明：
<keywords>
if条件共包含6种选择方式：是否、大于、大于或等于、小于、小于或等于、非指定版本
是否：指定是否IE或IE某个版本。关键字：空
大于：选择大于指定版本的IE版本。关键字：gt（greater than）
大于或等于：选择大于或等于指定版本的IE版本。关键字：gte（greater than or equal）
小于：选择小于指定版本的IE版本。关键字：lt（less than）
小于或等于：选择小于或等于指定版本的IE版本。关键字：lte（less than or equal）
非指定版本：选择除指定版本外的所有IE版本。关键字：!
<version>
目前的常用IE版本为6.0及以上，推荐酌情忽略低版本，把精力花在为使用高级浏览器的用户提供更好的体验上，另从IE10开始已无此特性

#### 6.7 避免类型选择器
- 避免出现标签名与ID或class组合的选择器
- 太多这种写法会让你的CSS效率变得糟糕
不推荐：

```css
div#doc{ sRules; }
li.first{ sRules; }
```

推荐：

```css
#doc{ sRules; }
.first{ sRules; }
```

#### 6.8 属性缩写与分拆

- 无继承关系时，使用缩写
- 存在继承关系时，使用分拆方式
- 根据规则条数选择缩写和拆分

__6.8.1 无继承关系时，使用缩写__

不推荐：

```css
body{
    margin-top:10px;
    margin-right:10px;
    margin-bottom:10px;
    margin-left:10px;
}
```

推荐：

```css
body{
    margin:10px;
}
```
 

 

__6.8.2 存在继承关系时，使用分拆方式__

不推荐：

```css
.m-detail{
    font:blod 12px/1.5 arial,sans-serif;
}

.m-detail .info{
    font:normal 14px/1.5 arial,sans-serif;
}
```
 
推荐：

```css
.m-detail{
    font:blod 12px/1.5 arial,sans-serif;
}
.m-detail .info{
    font-weight:normal;
    font-size:14px;
}
```

在存在继承关系的情况下，只将需要变更的属性重定义，不进行缩写，避免不需要的重写的属性被覆盖定义

__6.8.3 根据规则条数选择缩写和拆分__

不推荐：

```css
.m-detail{
    border-width:1px;
    border-style:solid;
    border-color:#000 #000 #f00;
}
```

推荐：

```css
.m-detail{
    border:1px solid #000;
    border-bottom-color:#f00;
}
```

### 7. 结语
坚持一致性的原则。
一个团队的代码风格如果统一了，首先可以培养良好的协同和编码习惯，其次可以减少无谓的思考，再次可以提升代码质量和可维护性。
统一的代码风格，团队内部阅读或编辑代码，将会变得非常轻松，因为组员都用一致思维环境。

待修改完善
 