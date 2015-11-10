---
layout: post
title:  "fis3试用与构建配置研究"
date:   2015-08-15
author: ouven
tags: fis3
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---


### 一、安装

- 安装初始化

```
npm i -g fis3
fis3 -v
fis3 init
```

### 二、配置

类似Gruntfile.js或Gulpfile.js，新建fis-config.js文件
配置api介绍如下：
#### fis.set(key, value)
设置一些配置，如系统内置属性 project、namespace、modules、settings。 fis.set 设置的值通过fis.get()获取
#### fis.get(key)
获取已经配置的属性，和 fis.set() 成对使用
#### fis.match(selector, props, [, important])
给匹配到的文件分配属性，文件属性决定了这个文件进行怎么样的操作；fis.match 模拟一个类似 css 的覆盖规则，负责给文件分配规则属性，这些规则属性决定了这个文件将会被如何处理；另外，后面分配到的规则会覆盖前面的；

```javascript
fis.match('{a,b}.js', {
    release: '/static/\$0'
});

fis.match('b.js', {
    release: '/static/new/\$0'
});
```

这里b.js的输出为 /static/new/$0，如果important为true则规则不能被覆盖
#### fis.media(mode)
fis.media 是模仿自 css 的 @media，表示不同的状态。这是 fis3 中的一个重要概念，其意味着有多份配置，每一份配置都可以让 fis3 进行不同的编译；

```javascript
fis.media('dev').match('*.js', {
    optimizer: null
});
 
fis.media('rd').match('*.js', {
  domain: 'http://rd-host/static/cdn'
});
```

#### fis.plugin(name, [props, [, place]])

http://fis.baidu.com/fis3/docs/api/config-api.html#%E5%85%A8%E5%B1%80%E5%B1%9E%E6%80%A7

####--几种重要属性设置
1. 全局属性介绍：

```javascript
var DEFAULT_SETTINGS = {
  project: {
    charset: 'utf8',    //字符编码，@param: string
    md5Length: 7,    //md5长度， @param: number
    md5Connector: '_',    //设置md5与文件的连接字符，@param: string
    files: ['**'],    //设置项目源码文件过滤器，@param:
    ignore: ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']    //排除某些不处理的文件
    fileType:{
        text: ['html', 'js'],    //追加文本文件后缀列表，@param: array | string
        image: ['png']    //最佳图片类二进制文件后缀列表，@param: array | string
    }
  },

    // project的属性也可以通过 fis.set('project.charset', 'utf8') 来设置，其它的类似
 
  component: {
    skipRoadmapCheck: true,  
    protocol: 'github',
    author: 'fis-components'
  },
 
  modules: {
    hook: 'components',
    packager: 'map'
  },
 
  options: {}
};
```

2. 文件属性：

```javascript
fis.set('timeDate', Date.now());    //获取当前时间戳
fis.match('/widget/{*,**/*}.js', {
    charset: 'utf8',    //指定文本文件的输出编码。@param: string
    url: '/static/proj/pkg_widget.js', //指定文件的资源定位路径，以 / 开头。默认是 release 的值，url可以与发布路径 release 不一致。@param: string
    release: '/static/$0',    //设置文件的产出路径。设置为false表示不生成文件,@param: string
    packTo: '/static/pkg_widget.js',     //分配到这个属性的文件将会合并到这个属性配置的文件中,@param: string
    query: '?=t' + fis.get('timeDate'),    //指定文件的资源定位路径之后的query，比如'?t=123124132'。@param: string
    isHtmlLike: true,     //指定对文件进行 html 相关语言能力处理.@param: bool
    isCssLike: true,     //指定对文件进行 css 相关的语言能力处理.@param: bool
    isJsLike: true,    //指定对文件进行 js 相关的语言能力处理
    useSameNameRequire: true,    //开启同名依赖.@param: bool
    requires:[    //默认依赖的资源id表
        ''static/lib/jquery.js''
    ],
    extras: {    //在[静态资源映射表][]中的附加数据，用于扩展[静态资源映射表][]表的功能。@param: object
        isPage: true
    }
});

fis.match('/widget/mod.js', {
    packOrder: -100,     //用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用。@param:number
});

fis.match('/widget/jquery.js', {
    //使用 var $ = require('jquery');
    id: 'query',    //指定文件的资源id。默认是 namespace + subpath 的值,@param: string
    moduleId: 'jquery',    //指定文件资源的模块id。在插件fis3-hook-module里面自动包裹define的时候会用到，默认是 id 的值。@param: string
    isMod: true    //标示文件是否为组件化文件。@param: bool
});

fis.media('prod').match('*.css', {
    useHash: true,     //是否携带md5戳。@param: true
    domain: 'http://www.qq.com',   //给文件 URL 设置cdn替换前缀。@paran: string
});

fis.match('*.less', {
    rExt: '.css'    //设置最终文件产出后的后缀.@param: string
    userMap: true,    //文件信息是否添加到 map.json,用于处理声明依赖，后面会讲到。@param: bool
    
});
```

3. 插件配置属性：

```javascript
fis.match('*.js', {
    lint: fis.plugin('js', {    //启用 lint 插件进行代码检查
 
    });
});
fis.match('*.less', {
   parser: fis.plugin('less'), //启用fis-parser-less插件
   rExt: '.css'
});
fis.match('*.sass', {
    parser: fis.plugin('sass'), //启用fis-parser-sass插件
    rExt: '.css'
});
fis.match('*.{css,less}', {
    paser: fis.plugin('image-set')
});
fis.match('::package', {
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites')
});
fis.media('prod').match('::package', {
    spriter: fis.plugin('csssprites')
});
// 发布部署等
fis.match('**', {
      deploy: fis.plugin('http-push', {
          receiver: 'http://target-host/receiver.php', // 接收端
          to: '/home/work/www' // 将部署到服务器的这个目录下
      })
  })
```

当然更多插件可以查看 http://npmsearch.com/?q=fis-parser%20fis3-parser
通过插件我们就可以使用一些基础功能的组合了：

```javascript
// 加 md5
fis.match('*.{js,css,png}', {
    useHash: true
});
 
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
    spriter: fis.plugin('csssprites')
})
 
// 对 CSS 进行图片合并
fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});
 
fis.match('*.js', {
     // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});
 
fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});
 
fis.match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});
```
如果开发阶段有时不需要那么多处理流程可以禁用某些功能：
```javascript
fis.media('debug').match('*.{js,css,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
})
```

### 三、调试与发布
FIS3 构建后，默认情况下会对资源的 URL 进行修改，改成绝对路径。同样FIS3 内置一个简易 Web Server，可以方便调试构建结果。
- 1、开启server到内置server调试目录

```javascript
fis3 server open
```

- 2、发布到内置server发布目录

```javascript
fis3 release
```

- 3、文件监听

```javascript
fis3 release -w    //FIS3 通过对 release 命令添加 -w 或者 --watch 参数启动文件监听功能。
fis3 release -wL  //文件修改自动构建发布了，如果浏览器能自动刷新。
```

- 4、发布配置
发布只需要配置就可以完成

```javascript
fis.match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php',
        to: '/home/work/htdocs' // 注意这个是指的是测试机器的路径，而非本地机器
    });
});
```

### 四、内置功能
- 4.1 嵌入资源
html和css中内嵌只需要在引用加载的文件后面加上__inline就可实现:

```html
<img title="百度logo" src="images/logo.gif?__inline"/>
<link rel="stylesheet" type="text/css" href="demo.css?__inline">
<script type="text/javascript" src="demo.js?__inline"></script>
<link rel="import" href="demo.html?__inline">

 @import url('demo.css?__inline');

```

js中内嵌资源稍有点不同：


```javascript
__inline('demo.js');
var img = __inline('images/logo.gif');
var css = __inline('a.css');
```

- 4.2 资源定位
其实官方文档讲了很多，但很简单，主要是在没有inline的条件下将内嵌的资源处理后加上后缀，放入到相对应的发布目录中自动定位。


```javascript
var img = __uri('images/logo.gif');
// 处理后变成，其它的原理类似
var img = '/static/pic/logo_74e5229.gif';
```

- 4.3 声明依赖
html中声明依赖。用户可以在html的注释中声明依赖关系，这些依赖关系最终会被记录下来，当某个文件中包含字符 __RESOURCE_MAP__ 那么这个记录会被字符串化后替换 __RESOURCE_MAP__。
例如index.html中含有并且设置了useMap：

```javascript
<!--
    @require demo.js
    @require "demo.css"
-->
```

```javascript
//fis-conf.js
fis.match('*.html', {
    useMap: true
})
```
那么发布后会产生如下manifest.json文件：

```javascript
{
    "res" : {
        "index.html" : {
            "uri" : "/index.html",
            "type" : "html",
            "deps" : [ "demo.js", "demo.css" ]
        }
    },
    "pkg" : {}
}
```

同样js和css中的配置方式和html中完全一致

### 五、工作原理

#### 1. 构建流程

FIS3 是基于文件对象进行构建的，每个进入 FIS3 的文件都会实例化成一个 File 对象，整个构建过程都对这个对象进行操作完成构建任务。一个文件的构建流程分为三个阶段：

- 扫项目目录拿到文件并初始化出一个文件对象的列表，列表包含需要处理文件的文件对象
- 对文件对象中每一个文件进行单文件编译
- 获取用户设置的 package 插件，进行打包处理（包括合并图片）

单文件进行处理的流程依次为：lint -> parser -> preprocessor -> standard -> postprocessor -> optimizer。正如上面所配置的，这六个过程可以通过配置插件来定义我们最终想要的结果。例如，
lint 代码校验检查，比较特殊，所以需要 release 命令命令行添加 -l 参数
parser 预处理阶段，比如 less、sass、es6、react 前端模板等都在此处预编译处理
preprocessor 标准化前处理插件
standard 标准化插件，处理内置语法
postprocessor 标准化后处理插件

### 2. File对象
当一个文件被实例化为一个 File 对象后，包括一些文件基本属性，如 filename、realpath 等等，当这个文件被处理时，FIS3 还会把用户自定义的属性 merge 到文件对象上。例如

```javascript
fis.match('a.js', {
  myProp: true
});
```

fis将给这个a.js加上myPorp属性，有点类似与gulp的pipe处理。

### 六、用fis3进行项目开发
#### 1. 插件使用
npm install -g 插件名 可以用来安装fis插件，插件列表见 http://npmsearch.com/?q=fis-parser%20fis3-parser
配置调试使用见上文的配置，fis3内置的插件如下，有这些觉得基本可以用来开发一个正式项目了。
fis-optimizer-clean-css
fis-optimizer-png-compressor
fis-optimizer-uglify-js
fis-spriter-csssprites
fis3-deploy-local-deliver
fis3-deploy-http-push
fis3-hook-components
fis3-packager-map

http://fis.baidu.com/fis3/docs/api/config-system-plugin.html

#### 2. 插件编写
不到万不得已不要去扩展插件，用到的时候再说吧，fis3扩展了些插件，99%能满足开发需要。
#### 3. 模块化开发
进行模块化开发首先安装npm install -g fis3-hook-module

```javascript
fis.hook('module');


fis.hook('module', {
    mode: 'amd'    //这里支持amd和commonJs
});

fis.match('/module/*.js', {
  isMod: true // 标记匹配文件为组件
});
```

#### 2. 项目开发基本规范

```javascript
// 开发目录规范
.
├── page    // 放置页面模板
│   └── index.html
├── static    //公用静态资源
│   └── lib    //公用静态资源库。例如jquery、zepto等
├── test    //一些测试数据和用例
└── widget    //一切组件，包括模板、css、js、图片以及其他前端资源
    ├── header
    ├── nav
    └── ui

//发布部署规范
.
├── static    //所有的静态资源都放到这个目录下
├── template    //所有的模板都放到这个目录下
└── test    还是一些测试数据、用例

//构建工具配置
foo
foo/bin/foo.js
foo/index.js
package.json
```

基于 FIS3 配置目录规范和部署规范的配置文件编写：

```javascript
// 所有的文件产出到 static/ 目录下
fis.match('*', {
    release: '/static/$0'
});
 
// 所有模板放到 tempalte 目录下
fis.match('*.html', {
    release: '/template/$0'
});
 
// widget源码目录下的资源被标注为组件
fis.match('/widget/**/*', {
    isMod: true
});
 
// widget下的 js 调用 jswrapper 进行自动化组件化封装
fis.match('/widget/**/*.js', {
    postprocessor: fis.plugin('jswrapper', {
        type: 'commonjs'
    })
});
 
// test 目录下的原封不动产出到 test 目录下
fis.match('/test/**/*', {
    release: '$0'
});
 
// optimize
fis.media('prod')
    .match('*.js', {
        optimizer: fis.plugin('uglify-js', {
            mangle: {
                expect: ['require', 'define', 'some string'] //不想被压的
            }
        })
    })
    .match('*.css', {
        optimizer: fis.plugin('clean-css', {
            'keepBreaks': true //保持一个规则一个换行
        })
    });
 
// pack
fis.media('prod')
    // 启用打包插件，必须匹配 ::package
    .match('::package', {
        packager: fis.plugin('map'),
        spriter: fis.plugin('csssprites', {
            layout: 'matrix',
            margin: '15'
        })
    })
    .match('*.js', {
        packTo: '/static/all_others.js'
    })
    .match('*.css', {
        packTo: '/staitc/all_others.js'
    })
    .match('/widget/**/*.js', {
        packTo: '/static/all_comp.js'
    })
    .match('/widget/**/*.css', {
        packTo: '/static/all_comp.css'
    });
```

实现 /bin/foo.js

```javascript
// vi foo/bin/foo.js
 
var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
  name: 'foo', // 命令名字
  processTitle: 'foo',
  moduleName: 'foo',
  configName: 'fis-conf',
 
  // only js supported!
  extensions: {
    '.js': null
  }
});
 
cli.launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, function(env) {
  var fis;
  if (!env.modulePath) {
    fis = require('../');
  } else {
    fis = require(env.modulePath);
  }
  fis.set('system.localNPMFolder', path.join(env.cwd, 'node_modules/foo'));
  fis.set('system.globalNPMFolder', path.dirname(__dirname));
  fis.cli.run(argv, env);
});
```

### 七、必须掌握的

命令行 fis3 <command> : 

```javascript
fis3 release [-d path]     //发布目录
fis3 install 插件名        //安装一个插件
fis3 init     //初始化一个项目
fis3 server [start | stop | restart | open | info ]      //内置服务器操作
fis3 inspect     //比较实用的命令，用来查看文件 match 结果
```

大概fis3文档的内容全部覆盖了，只有插件编写没有去深究。感觉整体能应对我们平时遇到的99%的问题。后面也靠fis团队更新插件了，至于缺少方便的插件的开发环境这点，个人觉得不到万不得已不要自己去造轮子，fis2很多插件缺少可以理解，后面还是尽量不要自己去造插件了。


