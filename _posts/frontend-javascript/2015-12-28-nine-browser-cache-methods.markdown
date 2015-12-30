---
layout: post
title:  "九种浏览器端缓存机制知多少"
date:   2015-12-28
author: ouven
tags:   浏览器缓存 cache
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---

&emsp;&emsp;浏览器缓存（Browser Caching）是浏览器端保存数据用于快速读取或避免重复资源请求的优化机制，有效的缓存使用可以避免重复的网络请求和浏览器快速地读取本地数据，整体上加速网页展示给用户。浏览器端缓存的机制种类较多，总体归纳为九种，这里详细分析下这九种缓存机制的原理和使用场景。打开浏览器的调试模式->resources左侧就有浏览器的8中缓存机制。

&emsp;&emsp;![](http://7tszky.com1.z0.glb.clouddn.com/Fh5DJkgam82rD_89kXdaxA3cWBC7)

### 一、http缓存
&emsp;&emsp;http缓存是基于HTTP协议的浏览器文件级缓存机制。即针对文件的重复请求情况下，浏览器可以根据协议头判断从服务器端请求文件还是从本地读取文件，chrome控制台下的Frames即展示的是浏览器的http文件级缓存。以下是浏览器缓存的整个机制流程。主要是针对重复的http请求，在有缓存的情况下判断过程主要分3步：

- 判断expires，如果未过期，直接读取http缓存文件，不发http请求，否则进入下一步
- 判断etag，判断文件是否修改，如果修改，则带上if-none-match发送请求，返回200或304，否则进入下一步
- 判断last-modified，判断文件是否超过最大缓存时间，则带上if-modified-since发送请求，返回200或304，否则直接不带发送请求

&emsp;&emsp; ![](http://7tszky.com1.z0.glb.clouddn.com/Fg9HGSm1K7AlSY_67ZwhTbKWG7QA)

如果通过etag和last-modified判断，即使返回304有至少有一次http请求，只不过返回的是304的返回内容，而不是文件内容。所以合理设计实现expires参数可以减少较多的浏览器请求。

### 二、websql
&emsp;&emsp; websql这种方式只有较新的chrome浏览器支持，并以一个独立规范形式出现，主要有以下特点

- Web Sql 数据库API 实际上不是HTML5规范的组成部分；
- 在HTML5之前就已经存在了，是单独的规范；
- 它是将数据以数据库的形式存储在客户端，根据需求去读取；
- 跟Storage的区别是： Storage和Cookie都是以键值对的形式存在的；
-  Web Sql 更方便于检索，允许sql语句查询；
- 让浏览器实现小型数据库存储功能；
- 这个数据库是集成在浏览器里面的，目前主流浏览器基本都已支持；

&emsp;&emsp;websql API主要包含三个核心方法：

- openDatabase : 这个方法使用现有数据库或创建新数据库创建数据库对象。
- transaction : 这个方法允许我们根据情况控制事务提交或回滚。
- executeSql : 这个方法用于执行真实的SQL查询。

&emsp;&emsp; 
__openDatabase方法可以打开已经存在的数据库，不存在则创建__

```javascript
	var db = openDatabase('mydatabase', '2.0', my db', 2 * 1024);
```

&emsp;&emsp;openDatabasek中五个参数分别为：数据库名、版本号、描述、数据库大小、创建回调。创建回调没有也可以创建数据库。

__database.transaction() 函数用来查询，executeSql()用于执行sql语句__

&emsp;&emsp;例如在mydatabase数据库中创建表t1：

```javascript
   var db = openDatabase(' mydatabase ', '1.0', 'Test DB', 2 * 1024 * 1024);  
   db.transaction(function (tx) {    
      tx.executeSql('CREATE TABLE IF NOT EXISTS t1 (id unique, log)');  
   });
```

&emsp;&emsp;插入操作

```javascript
var db = openDatabase('mydatabase', '2.0', my db', 2 * 1024);

   db.transaction(function (tx) { 
      tx.executeSql('CREATE TABLE IF NOT EXISTS t1 (id unique, log)');  
      tx.executeSql('INSERT INTO t1 (id, log) VALUES (1, "foobar")');  
      tx.executeSql('INSERT INTO t1 (id, log) VALUES (2, "logmsg")');  
   });
```

&emsp;&emsp;在插入新记录时，我们还可以传递动态值，如：

```javascript
   var db = openDatabase(' mydatabase ', '2.0', 'my db', 2 * 1024);  
   db.transaction(function (tx) {    
     tx.executeSql('CREATE TABLE IF NOT EXISTS t1 (id unique, log)');  
     tx.executeSql('INSERT INTO t1 (id,log) VALUES (?, ?'), [e_id, e_log];  //e_id和e_log是外部变量
   });
```

&emsp;&emsp;读操作，如果要读取已经存在的记录，我们使用一个回调捕获结果：

```javascript
   var db = openDatabase(mydatabase, '2.0', 'my db', 2*1024);     
	  db.transaction(function (tx) { 
      tx.executeSql('CREATE TABLE IF NOT EXISTS t1 (id unique, log)');  
      tx.executeSql('INSERT INTO t1 (id, log) VALUES (1, "foobar")');  
      tx.executeSql('INSERT INTO t1 (id, log) VALUES (2, "logmsg")');  
   });  
   db.transaction(function (tx) { 
      tx.executeSql('SELECT * FROM t1, [], function (tx, results) { 
      var len = results.rows.length, i;  
      msg = "<p>Found rows: " + len + "</p>";  
      document.querySelector('#status').innerHTML +=  msg;  
      for (i = 0; i < len; i++){ 
         alert(results.rows.item(i).log );  
      } 
    }, null);  
   });
```
   
### 三、indexDB

&emsp;&emsp;IndexedDB 是一个为了能够在客户端存储可观数量的结构化数据，并且在这些数据上使用索引进行高性能检索的 API。虽然 DOM 存储 对于存储少量数据是非常有用的，但是它对大量结构化数据的存储就显得力不从心了。IndexedDB 则提供了这样的一个解决方案。
&emsp;&emsp;IndexedDB 分别为同步和异步访问提供了单独的 API 。同步 API 本来是要用于仅供 Web Workers  内部使用，但是还没有被任何浏览器所实现。异步 API 在 Web Workers 内部和外部都可以使用，另外浏览器可能对indexDB有50M大小的限制，一般用户保存大量用户数据并要求数据之间有搜索需要的场景。

- 异步API

&emsp;&emsp;异步 API 方法调用完后会立即返回，而不会阻塞调用线程。要异步访问数据库，要调用 window 对象 indexedDB 属性的 open() 方法。该方法返回一个 IDBRequest 对象 (IDBOpenDBRequest)；异步操作通过在 IDBRequest 对象上触发事件来和调用程序进行通信。

```javascript
- IDBFactory 提供了对数据库的访问。这是由全局对象 indexedDB 实现的接口，因而也是该 API 的入口。
- IDBCursor 遍历对象存储空间和索引。
- IDBCursorWithValue 遍历对象存储空间和索引并返回游标的当前值。
- IDBDatabase 表示到数据库的连接。只能通过这个连接来拿到一个数据库事务。
- IDBEnvironment 提供了到客户端数据库的访问。它由 window 对象实现。
- IDBIndex 提供了到索引元数据的访问。
- IDBKeyRange 定义键的范围。
- IDBObjectStore 表示一个对象存储空间。
- IDBOpenDBRequest 表示一个打开数据库的请求。
- IDBRequest 提供了到数据库异步请求结果和数据库的访问。这也是在你调用一个异步方法时所得到的。
- IDBTransaction 表示一个事务。你在数据库上创建一个事务，指定它的范围（例如你希望访问哪一个对象存储空间），并确定你希望的访问类型（只读或写入）。
- IDBVersionChangeEvent 表明数据库的版本号已经改变。
```

- 同步API

&emsp;&emsp;规范里面还定义了 [API 的同步](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)版本。同步 API 还没有在任何浏览器中得以实现。它原本是要和 [webWork](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) 一起使用的。

http://mxr.mozilla.org/mozilla-central/source/modules/libpref/src/init/all.js
http://caniuse.com/#feat=indexeddb

### 四、cookie

&emsp;&emsp;Cookie（或者Cookies），指一般网站为了辨别用户身份、进行session跟踪而储存在用户本地终端上的数据（通常经过加密）。cookie一般通过http请求中在头部一起发送到服务器端。一条cookie记录主要由键、值、域、过期时间、大小组成，一般用户保存用户的认证信息。cookie最大长度和域名个数由不同浏览器决定，具体如下：

| 浏览器 | 支持域名个数 | 最大长度 |
|-----|-----|-----|
|IE7以上| 50个 |4095B|
|Firefox| 50个 |4097B|
|Opera| 30个 |4096B|
|Safari/WebKit| 无限制 |4097B|

&emsp;&emsp;不同域名之间的cookie信息是独立的，如果需要设置共享可以在服务器端设置cookie的path和domain来实现共享。浏览器端也可以通过document.cookie来获取cookie，并通过js浏览器端也可以方便地读取/设置cookie的值。

https://github.com/component/cookie/blob/master/index.js

### 五、localstorage
&emsp;&emsp;localStorage是html5的一种新的本地缓存方案，目前用的比较多，一般用来存储ajax返回的数据，加快下次页面打开时的渲染速度。

| 浏览器  | 最大长度 |
|-----|-----|
|IE9以上| 5M|
|Firefox 8以上|5.24M|
|Opera|2M|
|Safari/WebKit| 2.6M|

```javascript
//localStorage核心API:
localStorage.setItem(key, value)	//设置记录
localStorage.getItem(key)			//获取记录
localStorage.removeItem(key)		//删除该域名下单条记录
localStorage.clear()				//删除该域名下所有记录
```

&emsp;&emsp;值得注意的是，localstorage大小有限制，不适合存放过多的数据，如果数据存放超过最大限制会报错，并移除最先保存的数据。

https://github.com/machao/localStorage

### 六、sessionstorage
&emsp;&emsp;sessionStorage和localstorage类似，但是浏览器关闭则会全部删除，api和localstorage相同，实际项目中使用较少。

### 七、application cache

&emsp;&emsp;application cahce是将大部分图片资源、js、css等静态资源放在manifest文件配置中。当页面打开时通过manifest文件来读取本地文件或是请求服务器文件。
&emsp;&emsp;离线访问对基于网络的应用而言越来越重要。虽然所有浏览器都有缓存机制，但它们并不可靠，也不一定总能起到预期的作用。HTML5 使用ApplicationCache 接口可以解决由离线带来的部分难题。前提是你需要访问的web页面至少被在线访问过一次。
&emsp;&emsp;使用缓存接口可为您的应用带来以下三个优势：

- 离线浏览 – 用户可在离线时浏览您的完整网站
- 速度 – 缓存资源为本地资源，因此加载速度较快。
- 服务器负载更少 – 浏览器只会从发生了更改的服务器下载资源。

&emsp;&emsp;一个简单的离线页面主要包含以下几个部分：

__index.html__

```html
<html manifest="clock.manifest">
  <head>
    <title>AppCache Test</title>
    <link rel="stylesheet" href="clock.css">
    <script src="clock.js"></script>
  </head>
  <body>
    <p><output id="clock"></output></p>
    <div id="log"></div>
  </body>
</html>
```

__clock.manifest__

```javascript
CACHE MANIFEST
#VERSION 1.0
CACHE:
clock.css
clock.js
```

clock.js和clock.css为独立的另外文件。
&emsp;&emsp;另外需要注意的是更新缓存。在程序中，你可以通过window.applicationCache 对象来访问浏览器的app cache。你可以查看 status 属性来获取cache的当前状态：

```javascript
var appCache = window.applicationCache;
switch (appCache.status) {
  case appCache.UNCACHED: // UNCACHED == 0
    return 'UNCACHED';
    break;
  case appCache.IDLE: // IDLE == 1
    return 'IDLE';
    break;
  case appCache.CHECKING: // CHECKING == 2
    return 'CHECKING';
    break;
  case appCache.DOWNLOADING: // DOWNLOADING == 3
    return 'DOWNLOADING';
    break;
  case appCache.UPDATEREADY:  // UPDATEREADY == 4
    return 'UPDATEREADY';
    break;
  case appCache.OBSOLETE: // OBSOLETE == 5
    return 'OBSOLETE';
    break;
  default:
    return 'UKNOWN CACHE STATUS';
    break;
};
```

&emsp;&emsp;为了通过编程更新cache，首先调用 applicationCache.update()。这将会试图更新用户的 cache（要求manifest文件已经改变）。最后，当 applicationCache.status 处于 UPDATEREADY 状态时， 调用applicationCache.swapCache()，旧的cache就会被置换成新的。

```javascript
var appCache = window.applicationCache;
appCache.update(); // Attempt to update the user’s cache.
…
if (appCache.status == window.applicationCache.UPDATEREADY) {
  appCache.swapCache();  // The fetch was successful, swap in the new cache.
}
```

&emsp;&emsp;这里是通过更新menifest文件来控制其它文件更新的。

### 八、cacheStorage
&emsp;&emsp;CacheStorage是在ServiceWorker的规范中定义的。CacheStorage 可以保存每个serverWorker申明的cache对象，cacheStorage有open、match、has、delete、keys五个核心方法，可以对cache对象的不同匹配进行不同的响应。

__cacheStorage.has()__
如果包含cache对象，则返回一个promise对象。
__cacheStorage.open()__
打开一个cache对象，则返回一个promise对象。
__cacheStorage.delete()__
删除cache对象，成功则返回一个promise对象，否则返回false。
__cacheStorage.keys()__
含有keys中字符串的任意一个，则返回一个promise对象。
__cacheStorage.delete()__
匹配key中含有该字符串的cache对象，返回一个promise对象。

```javascript
caches.has('v1').then(function() {
  caches.open('v1').then(function(cache) {
      return cache.addAll(myAssets);
  });
}).catch(function() {
  someCacheSetupfunction();
});;
```

```javascript
var response;
var cachedResponse = caches.match(event.request).catch(function() {
  return fetch(event.request);
}).then(function(r) {
  response = r;
  caches.open('v1').then(function(cache) {
    cache.put(event.request, response);
  });  
  return response.clone();
}).catch(function() {
  return caches.match('/sw-test/gallery/myLittleVader.jpg');
});
```

```javascript
then.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v2'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      });
    })
  );
});
```

https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage


### 九、flash缓存
&emsp;&emsp;这种方式基本不用，这一方法主要基于flash有读写浏览器端本地目录的功能，同时也可以向js提供调用的api，则页面可以通过js调用flash去读写特定的磁盘目录，达到本地数据缓存的目的。


#### 注释PS

- Web Storage / Web SQL Database / Indexed Database 的数据都存储在浏览器对应的用户配置文件目录(user profile directory)下，以 Windows 7 为例，Chrome 的数据存储在”C:\Users\your-account-name\AppData\Local\Google\Chrome\User Data\Default\”下，而 Firefox 的数据存储在”C:\Users\your-account-name\AppData\Local\Mozilla\Firefox\Profiles\”目录下。
- cookie文件存储于documents and settings\userName\cookie\文件夹下。通常的命名格式为：userName@domain.txt。 

- 较多的缓存机制目前主流浏览器并不兼容，不过可以使用polyfill的方法来处理

&emsp;&emsp;浏览器涉及的缓存方式主要包含这些，具体结合自己的业务场景进行选择使用