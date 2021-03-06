---
layout: post
title:  "whistle工具全程入门"
date:   2017-06-20
author: ouven
tags:   whistle
categories: frontend-build
cover:  "assets/category/type-javascript.png"
---

&emsp;&emsp;接触过前后端开发的同学应该都了解网络请求代理工具fiddler(mac下面常用的是Charles)，可以用来拦截分析请求、包装请求、本地调试和移动端代理开发调试等。多多少少，fiddler和Charles使用起来还是有些区别，不过还好都是可视化的界面使用配置起来也都比较方便。

&emsp;&emsp;先说下使用体验。对于一个追求高效的开发者来说，总是觉得要经常切换两个工具的使用比较麻烦，但是配置规则不通用，fiddler+willow组合的使用很不错，但也总是让电脑比较慢，而且规则配置需要点击输入显得不那么高效；Charles是mac上一款不错的网络代理工具，不过是收费的，价格不便宜（当然你可以找破解），但是路径替换功能使用起来比较麻烦，这点体验很不好。在两个平台上都折腾过，而且要经常切来切去（自己的电脑是windows），后来决定尝试入坑whistle（由avenwu@tencent开发），发现非常高效易用，解决了困扰多年的问题。这里总结梳理下常用的功能和使用方式。

&emsp;&emsp;[whistle文档](https://avwo.github.io/whistle/install.html)入口在这里，安装入门使用和原理介绍略过，执行下面命令，然后打开 http://127.0.0.1:8899 就可以了。
```
npm i -g whistle  #需要配代理的自己配
w2 start
```

&emsp;&emsp;一看就懂，当然文档是比较基础的，内容全，但也比较多，不适合快速入门，所以这里为大家梳理下实际开发中常用的一些规则配置，快速入门，大家可以对应fiddler或Charles的使用对号入座。

#### 使用一键代理切换

&emsp;&emsp;安装启动whistle后，通常浏览器需要设置代理指向whistle Server地址127.0.0.1:8899，为了方便切换，chrome下推荐安装使用proxyOmega插件来提高切换效率，这样就可以一键切换代理。
&emsp;&emsp;![](http://7tszky.com1.z0.glb.clouddn.com/FqCAuksBVtshgVIuULo14RXJQblo)

&emsp;&emsp;打开界面我们主要关注Rules菜单项，点击create就可以在规则集合里面书写规则了。

&emsp;&emsp;![](http://7tszky.com1.z0.glb.clouddn.com/Fs6GpkFCI8_Tt3R7Yg6U0usbiJ9P)

##### 1. host映射和特定子路径的host映射，whistle不仅支持传统的host配置，还支持子路径和端口的host转发配置

```javascript
10.125.36.59 ke.qq.com  					# 直接的host配置
127.0.0.1:8086 ke.qq.com www.qq.com 		# 对全部域名路径替换host
10.125.36.59 ke.qq.com/ads  			  # 对特定的路径替换host
```

##### 2. 本地文件或文件路径替换，协议头可以加也可以不加，不加表示匹配所有协议，否则只对某个协议生效。类似willow的路径替换。

```javascript
ctc.i.gtimg.cn/qzone/biz/gdt/atlas/mod/message.html  C:\Users\ouvenzhang\Desktop\edit.html # 单个文件的本地替换
ctc.i.gtimg.cn/qzone/biz/   C:\Users\ouvenzhang\Desktop\biz\build\  # 文件路径的替换，一般用这条就可以了
http://ctc.i.gtimg.cn/qzone/biz/ C:\Users\ouvenzhang\Desktop\biz\build\   #只针对http请求的文件路径替换

/ctc\.i\.gtimg\.cn\/qzone\/biz\/gdt\/phoenix\/(\S+?)_\d{8}_\d{3,10}\.js/ E:/svn/daily_1.1.18/app/qzap/build/gdt/phoenix/$1.js # 根据正则替换匹配
/ctc\.i\.gtimg\.cn\/qzone\/biz\/gdt\/phoenix\/(\S+?)\.js/ E:/svn/daily_1.1.18/app/qzap/build/gdt/phoenix/$1.js # 根据正则替换匹配
```

##### 3，请求转发，将指定域名请求转发到另一个域名

```javascript
www.qq.com ke.qq.com # 指定域名转发生效
**.qq.com ke.qq.com  # 所有qq.com子域名转发生效
```

##### 4，脚本注入，可以将一段脚本（可以使html、js、CSS片段）注入到dom页面中进行调试

```javascript
ke.qq.com html://E:\xx\test\test.html
ke.qq.com js://C:\Users\ouvenzhang\Desktop\gdt\console.js
ke.qq.com css://E:\xx\test\test.css
```

##### 5, 匹配模式，可以根据正则式匹配路径

```
#/keyword/i #关键字匹配
/ke\.qq\.com\/atlas\/(\d+)\/order\/edit/i C:\Users\ouvenzhang\Desktop\gdt\edit.html  # 正则匹配
ke.qq.com/atlas/25610/order/edit C:\Users\ouvenzhang\Desktop\gdt\edit.html	# 直接匹配
```

##### 6，忽略特性的请求内容
```
/qq.com/ filter://rule|hide    # 忽略包含qq域名下的请求并不在network中显示
/spa\-monitor\.min\.js/i filter://rule  # 忽略匹配包含spa-monitor.min.js，但在network中显示，相当于文件白名单
```

##### 7，请求改写与接口mock
```
ke.qq.com ua://{test_ua}  #注意这里的改写是whistle抓包请求的改写，浏览器调试看到的内容仍然是原来的
ke.qq.com/ec/api.php?mod=utilities&act=estimate tpl://{mock-price}
```

&emsp;&emsp;test_ua和mock-price是values里面的设置，那么对应请求会直接返回values对应的内容，很方便：
&emsp;&emsp;![](http://7tszky.com1.z0.glb.clouddn.com/FpCbduEQ2d4HH9rTxW5YVxB3oNWk)

##### 8, 远程调试，把手机的请求代理到whistle，ip为whistle所在机器的ip，端口号为whistle的监听的端口号(默认为：8899) 配置要注入的请求(系统会自动判断是否为html，如果不是则不会自动注入)

```
# xxx为对应的weinre id，主要用于页面分类，默认为anonymous
www.example.com weinre://xxx  
```

##### 9, 设置https代理

&emsp;&emsp;https的内容文档写的比较清楚，设置也很简单，这里就不重复了https://avwo.github.io/whistle/webui/https.html

&emsp;&emsp;小结：除此之外，whistle还有更多复杂强大的功能，不过目前我们常用的就上面这些，了解这些就基本满足我们的开发配置了，需要了解更多内容，大家可以进一步查阅具体文档了解。[whistle文档](https://avwo.github.io/whistle/install.html)