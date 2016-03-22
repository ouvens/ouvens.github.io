---
layout: post
title:  "web安全机制问题全解析"
date:  2016-03-20
author: ouven
tags: web安全 https xss csrf
categories: frontend-weboptimize
cover: "assets/category/type-javascript.png"
---


&emsp;&emsp;web安全方面技术含有的东西较多，这里就来理一理web安全方面所涉及的一些问题。

### 一、xss与sql攻击

> 入门级的安全知识，攻击手段和防范方法这里略过，不过注意的是xss分存储型xss、反射型xss、mxss，主要防范思路是检查验证要输入到页面上的内容是否安全。
    
### 二、csrf

> 入门级的安全知识，攻击手段和防范方法这里略过

### 三、请求劫持与HTTPS

#### 3.1、请求劫持

&emsp;&emsp;请求劫持现在主要分为两种，DNS劫持与HTTP劫持：

**DNS劫持：**

> DNS劫持就是通过劫持了DNS服务器，通过某些手段取得某域名的解析记录控制权，进而修改此域名的解析结果，导致对该域名的访问由原IP地址转入到修改后的指定IP，其结果就是对特定的网址不能访问或访问的是假网址，从而实现窃取资料或者破坏原有正常服务的目的。DNS劫持通过篡改DNS服务器上的数据返回给用户一个错误的查询结果来实现的。
&emsp;&emsp;DNS劫持症状：在某些地区的用户在成功连接宽带后，首次打开任何页面都指向ISP提供的“电信互联星空”、“网通黄页广告”等内容页面。还有就是曾经出现过用户访问Google域名的时候出现了百度的网站。这些都属于DNS劫持。
再说简单点，当你输入google.com这个网址的时候，你看到的网站却是百度的首页。

**http劫持：**

> 在用户的客户端与其要访问的服务器经过网络协议协调后，二者之间建立了一条专用的数据通道，用户端程序在系统中开放指定网络端口用于接收数据报文，服务器端将全部数据按指定网络协议规则进行分解打包，形成连续数据报文。
&emsp;&emsp;用户端接收到全部报文后，按照协议标准来解包组合获得完整的网络数据。其中传输过程中的每一个数据包都有特定的标签，表示其来源、携带的数据属性以及要到何处，所有的数据包经过网络路径中ISP的路由器传输接力后，最终到达目的地，也就是客户端。
&emsp;&emsp;HTTP劫持是在使用者与其目的网络服务所建立的专用数据通道中，监视特定数据信息，提示当满足设定的条件时，就会在正常的数据流中插入精心设计的网络数据报文，目的是让用户端程序解释“错误”的数据，并以弹出新窗口的形式在使用者界面展示宣传性广告或者直接显示某网站的内容。列入本地的fiddler为一种劫持

**请求劫持唯一可行的预防方法就是尽量使用HTTPS协议访问。**

#### 3.1、公钥和私钥

&emsp;&emsp;什么是https，这里不再解释了，简单理解就是通过SSL（Secure Sockets Layer）层来加密http数据来进行安全传输。 那使用HTTPS是怎样进行安全数据传输的？

**先看个有意思的问题：**

&emsp;&emsp;A、B两个人分别在两个岛上，并且分别有一个箱子，一把锁，和打开这把锁的钥匙（A的钥匙打不开B手上的锁，B的钥匙也打不开A的锁）。此时A要跟B互通情报，此时需要借助C的船运输，C是一个不可靠的人，如果A直接把情报送给B或把情报放在箱子里给B，都可能会被C偷走；如果A把情报锁在箱子里，B没有打开A锁的钥匙无法获得情报内容。请问有什么办法可以尽可能快的让A和B互通情报。

&emsp;&emsp;这就是公钥和私钥的问题了，答案比较简单，也对应了公钥和私钥在https中的应用过程。

&emsp;&emsp;公钥（Public Key）与私钥（Private Key）是通过一种算法得到的一个密钥对（即一个公钥和一个私钥），公钥是密钥对中公开的部分，私钥则是非公开的部分。公钥通常用于加密会话密钥、验证数字签名，或加密可以用相应的私钥解密的数据。通过这种算法得到的密钥对能保证在世界范围内是唯一的。使用这个密钥对的时候，如果用其中一个密钥加密一段数据，必须用另一个密钥解密。比如用公钥加密数据就必须用私钥解密，如果用私钥加密也必须用公钥解密，否则解密将不会成功。---[百度百科](http://baike.baidu.com/link?url=RlMLbClmwYxXJsNwQTL4w6RhQG7tcdTbqw6tJRKGAKf1oNkHwPVGq18LDFppQFO9yI-HJJhTvcagSt6PmB8sS_)

#### 3.2、Https的通信过程

整个通信过程如下图，以公钥加密方式为例：

![](http://7tszky.com1.z0.glb.clouddn.com/FuC_r2Y4_AbsAX0nTHgR4H1Y_7uh)

1、客户端发送https请求，告诉服务器发将建立https连接
2、服务器将服务端生成的公钥返回给客户端，如果是第一次请求将告诉客户端需要验证链接
3、客户端接收到请求后'client finished'报文串通过获取到的服务器公钥加密发送给服务器，并将客户端生成的公钥也发送给服务器
4、服务器获取到加密的报文和客户端公钥，先使用服务器私钥解密报文，然后将报文通过客户端的公钥加密返回给客户端。
5、客户端通过私钥解密报文，判断是否为自己开始发送的报文串；如果正确，说明安全连接验证成功，将数据通过服务器公钥加密不断发送给服务器，服务器也不断解密获取报文，并通过客户端公钥加密返回给客户端验证。这样就建立了不断通信的连接。

#### 3.3、Https协议头解析

以打开 https://github.com/ 的过程为例，请求通用头部如下

`Request URL:https://github.com/ouvens\n
Request Method:GET
Status Code:200 OK (from cache)
Remote Address:192.30.252.131:443
Response Headers
`

---

先看下请求头的字段

![](http://7tszky.com1.z0.glb.clouddn.com/Fo332kYdGi30_-qrri5_kYRZq-jK)

再截取部分返回头的字段

![](http://7tszky.com1.z0.glb.clouddn.com/FpAwlzDokatbdAcBTfqmFZ5-EiNF)


&emsp;

---
**需要注意的upgrade-insecure-requests**

https正常升级后chrome浏览器会出现下面的警告

![](http://7tszky.com1.z0.glb.clouddn.com/FhQ5_3yHfetPMnZ8usY6s90qlKLW)

考虑到这个问题，w3c在2015年4月份出了一个 Upgrade Insecure Requests 的草案，他的作用就是让浏览器自动升级请求。在服务器的响应头中加入：

header("Content-Security-Policy: upgrade-insecure-requests");

### 四、其它浏览器web安全控制

http层面上浏览器设置的安全性控制较多，这里列几个典型的来看看：

#### 1. X-XSS-Protection

这个header主要是用来防止浏览器中的反射性xss。现在，只有IE，chrome和safari（webkit）支持这个header。

正确的设置:

`X-XSS-Protection:1; mode=block
0 – 关闭对浏览器的xss防护  
1 – 开启xss防护  
1; mode=block – 开启xss防护并通知浏览器阻止而不是过滤用户注入的脚本。  
1; report=http://site.com/report – 这个只有chrome和webkit内核的浏览器支持，这种模式告诉浏览器当发现疑似xss攻击的时候就将这部分数据post到指定地址。  
通常不正确的设置`

---

#### 2.X-Content-Type-Options

&ems;&emsp;这个header主要用来防止在IE9、chrome和safari中的MIME类型混淆攻击。firefox目前对此还存在争议。通常浏览器可以通过嗅探内容本身的方法来决定它是什么类型，而不是看响应中的content-type值。通过设置 X-Content-Type-Options：如果content-type和期望的类型匹配，则不需要嗅探，只能从外部加载确定类型的资源。举个例子，如果加载了一个样式表，那么资源的MIME类型只能是text/css，对于IE中的脚本资源，以下的内容类型是有效的：

`application/ecmascript  
application/javascript  
application/x-javascript  
text/ecmascript  
text/javascript  
text/jscript  
text/x-javascript  
text/vbs  
text/vbscript`
对于chrome，则支持下面的MIME 类型：

`text/javascript  
text/ecmascript  
application/javascript  
application/ecmascript  
application/x-javascript  
text/javascript1.1  
text/javascript1.2  
text/javascript1.3  
text/jscript  
text/live script`

nosniff – 这个是唯一正确的设置，必须这样。  

---

#### 3. Strict-Transport-Security

Strict Transport Security (STS) 是用来配置浏览器和服务器之间安全的通信。它主要是用来防止中间人攻击，因为它强制所有的通信都走TLS。目前IE还不支持 STS头。需要注意的是，在普通的http请求中配置STS是没有作用的，因为攻击者很容易就能更改这些值。为了防止这样的现象发生，很多浏览器内置了一个配置了STS的站点list。
 
正确的设置  :
注意下面的值必须在https中才有效，如果是在http中配置会没有效果。
 
`max-age=31536000 – 告诉浏览器将域名缓存到STS list里面，时间是一年。  
max-age=31536000; includeSubDomains – 告诉浏览器将域名缓存到STS list里面并且包含所有的子域名，时间是一年。  
max-age=0 – 告诉浏览器移除在STS缓存里的域名，或者不保存此域名。  
通常不正确的设置`

判断一个主机是否在你的STS缓存中，chrome可以通过访问chrome://net-internals/#hsts，首先，通过域名请求选项来确认此域名是否在你的STS缓存中。然后，通过https访问这个网站，尝试再次请求返回的STS头，来决定是否添加正确。

---

#### 4.Content-Security-Policy

CSP是一种由开发者定义的安全性政策性申明，通过CSP所约束的的规责指定可信的内容来源（这里的内容可以指脚本、图片、iframe、fton、style等等可能的远程的资源）。通过CSP协定，让WEB能够加载指定安全域名下的资源文件，保证运行时处于一个安全的运行环境中。

正确配置：

`Content-Security-Policy:default-src *; base-uri 'self'; block-all-mixed-content; child-src 'self' render.githubusercontent.com; connect-src 'self' uploads.github.com status.github.com api.github.com www.google-analytics.com github-cloud.s3.amazonaws.com wss://live.github.com; font-src assets-cdn.github.com; form-action 'self' github.com gist.github.com; frame-src 'self' render.githubusercontent.com; img-src 'self' data: assets-cdn.github.com identicons.github.com www.google-analytics.com collector.githubapp.com *.gravatar.com *.wp.com *.githubusercontent.com; media-src 'none'; object-src assets-cdn.github.com; plugin-types application/x-shockwave-flash; script-src assets-cdn.github.com; style-src 'self' 'unsafe-inline' assets-cdn.github.com`

---

#### 5.X-Frame-Options

这个header主要用来配置哪些网站可以通过frame来加载资源。它主要是用来防止UI redressing 补偿样式攻击。IE8和firefox 18以后的版本都开始支持ALLOW-FROM。chrome和safari都不支持ALLOW-FROM，但是WebKit已经在研究这个了。

正确的设置

`X-Frame-Options: deny
deny – 禁止所有的资源（本地或远程）试图通过frame来加载其他也支持X-Frame-Options 的资源。  
sameorigion – 只允许遵守同源策略的资源（和站点同源）通过frame加载那些受保护的资源。  
allow-from http://www.example.com – 允许指定的资源（必须带上协议http或者https）通过frame来加载受保护的资源。这个配置只在IE和firefox下面有效。其他浏览器则默认允许任何源的资源（在X-Frame-Options没设置的情况下）。 `

---

#### 6.Access-Control-Allow-Origin

Access-Control-Allow-Origin是从Cross Origin Resource Sharing (CORS)中分离出来的。这个header是决定哪些网站可以访问资源，通过定义一个通配符来决定是单一的网站还是所有网站可以访问我们的资源。需要注意的是，如果定义了通配符，那么 Access-Control-Allow-Credentials选项就无效了，而且user-agent的cookies不会在请求里发送。

正确的设置

`Access-Control-Allow-Origin : *
*– 通配符允许任何远程资源来访问含有Access-Control-Allow-Origin 的内容。  
http://www.example.com – 只允许特定站点才能访问(http://[host], 或者 https://[host])`

---

#### 7.Public-Key-Pins

&emsp;&emsp;公钥固定（Public Key Pinning）是指一个证书链中必须包含一个白名单中的公钥，也就是说只有被列入白名单的证书签发机构（CA）才能为某个域名*.example.com签发证书，而不是你的浏览器中所存储的任何 CA 都可以为之签发。可以理解为https的证书域名白名单。
&emsp;&emsp;Public-Key-Pins (PKP)的目的主要是允许网站经营者提供一个哈希过的公共密钥存储在用户的浏览器缓存里。跟Strict-Transport-Security功能相似的是，它能保护用户免遭中间人攻击。这个header可能包含多层的哈希运算，比如pin-sha256=base64(sha256(SPKI))，具体是先将 X.509 证书下的Subject Public Key Info (SPKI) 做sha256哈希运算，然后再做base64编码。然而，这些规定有可能更改，例如有人指出，在引号中封装哈希是无效的，而且在33版本的chrome中也不会保存pkp的哈希到缓存中。

&emsp;&emsp;这个header和 STS的作用很像，因为它规定了最大子域名的数量。此外，pkp还提供了一个Public-Key-Pins-Report-Only 头用来报告异常，但是不会强制阻塞证书信息。当然，这些chrome都是不支持的。

**请求头说明参考：**

https://www.veracode.com/blog/2014/03/guidelines-for-setting-security-headers/

### 五、总结

&emsp;&emsp;总结下web的安全策略，主要介绍了websql注入防范、xss防范、csrf防范、劫持与https、Content-Security-Policy、Strict-Transport-Security、Access-Control-Allow-Origin、X-Frame-Options等。
    
参考文章

https://raymii.org/s/articles/HTTP_Public_Key_Pinning_Extension_HPKP.html

https://www.veracode.com/blog/2014/03/guidelines-for-setting-security-headers/

http://baike.baidu.com/link?url=OvUAVwOrPUGV8evCRgV4pynfzPTC5162ra4IGm_O-_KFQ3-gWqhvWhaD5hfXO2-vVobpMY_0KuW-O0flokSZz_

