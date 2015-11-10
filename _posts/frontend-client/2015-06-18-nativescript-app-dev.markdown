---
layout: post
title:  "Nativescript跨终端应用程序开发方案研究"
date:   2015-06-18
author: ouven
tags: nativescript
cover:  "assets/category/type-client.png"
---

### 1.环境准备
- 安装nodejs
- 安装nativescript

```javascript
$npm install -g nativescript
```

或者下载github上项目代码进行构建(不推荐)
- 安装java JDK
jdk是Java运行开发环境，按android开发必须的开发的环境
    
```javascript
JAVA_HOME   D:/program file/java/jdk_1.7.34/
path         D:/program file/java/jdk_1.7.34/bin
classpath   D:/program file/java/jdk_1.7.34/lib
```

测试方法：java -version

- 安装Apache ant
Apache Ant,是一个将软件编译、测试、部署等步骤联系在一起加以自动化的一个工具，大多用于Java环境中的软件开发。由Apache软件基金会所提供。这里用到的的是用于android签名证书等打包(android开发过程中ide使用gradle配置打包，早期都是用的ant打包，这里使用的方法比较原始)
http://ant.apache.org/bindownload.cgi 上下载最新版apache-bin(可选择安装型或压缩包型)，然后添加系统环境变量

```javascript
ANT_HOME    C:/ apache-ant-1.9.5
path        C:/ apache-ant-1.9.5/bin
classpath   C:/apache-ant-1.9.5/lib
```

测试方法：ant -version

- 安装Android sdk
下载最新的adk，http://developer.android.com/sdk/installing/index.html 下载后解压到某个目录(例如D盘)，然后添加系统环境变量

```javascript
ANDROID_HOME   D:/android-sdk-windows
path        D:/android\android-sdk-windows\tools
classpath  D:/android\android-sdk-windows\tools\lib
```

测试方法：android
必须掌握的两个命令：abd start-server/ adb kill-server，用于启动android debug服务，adb使用与启动模拟器或是通过手机的自动安装调试，并可以看到log信息。这两个命令会经常用到
然后 命令行运行一下tns，如果看到以下提示信息，就可以开始第一个开发了。

```javascript
# NativeScript
┌─────────┬─────────────────────────────
───────────────────────────────────┐
│ Usage   │ Synopsis                                                       │
│ General │ $ tns <Command> [Command Parameters] [--command <Options>]     │
│ Alias   │ $ nativescript <Command> [Command Parameters] [--command       │
│         │ <Options>]                                                     │
└─────────┴─────────────────────────────
───────────────────────────────────┘
```

### 2.开始项目
- 创建项目

```javascript
$ tns create demo
$ cd demo
$ tns platform add andrdoi/ios
├── app     // bower dependencies
        ├── App_Resources    // bower dependencies
                        ├── Android  // android项目的drawble静态图片等文件，项目转换的时候直接拷贝到android项目下
                        ├── iOS        //ios项目用到的图片文件
        ├── tns_modules    //tns node模块，可以用来调用移动设备功能
        ├── app.css    // 内部控件样式
        ├── app.js    // 页面配置入口配置
        ├── LICENSE
        ├── main-page.js    // 页面js文件
        ├── main-page.xml    // 页面布局文件
        ├── main-view-model.js    // vm对象生成文件
        ├── package.json    // bower dependencies
├── node_module     // node插件忽略
├── platforms           // 转换后的移动端平台代码
        ├── android           // 标准的可移植android项目代码
        ├── ios                  //标准的可移植ios项目代码
└──package.json           //项目信息配置文件 
```
从项目的结构可以看出，项目代码使用的mvvm结构，而且它的viewmodel是通过方法操作的。

- 配置移动平台

```javascript
$ tns platform add ios/android
$ tns run android/ios (真机启动) 或者  tns run android/ios --emulator(启动模拟器)
```

如果没问题的话就可以看到手机或模拟器上启动了应用程序
来自： http://docs.nativescript.org/hello-world/hello-world-ns-cli.html

### 3.项目分析与实例
分析一下页面主要的代码结构
- app.js，页面的预处理入口，表示启动main-page这个页面

```javascript
var application = require("application");
application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start();
```

- main-page.js 页面的数据绑定处理，将vm和方法绑定，也可认为是把vm和对象关联绑定

```javascript
var vmModule = require("./main-view-model");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;
```

- main-view-model.js 页面的vm定义模块，申明方法和数据

```javascript
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");

var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);

    function HelloWorldModel() {
        _super.call(this);
        this.counter = 42;
        this.set("message", this.counter + " taps left");
    }

    HelloWorldModel.prototype.tapAction = function () {
        this.counter--;
        if (this.counter <= 0) {
            this.set("message", "Hoorraaay! You unlocked the NativeScript clicker achievement!");
        }
        else {
            this.set("message", this.counter + " taps left");
        }
    };
    return HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();
```

- app.css

```javascript
.title {
    font-size: 30;
    horizontal-align: center;
    margin:20;
}

button {
    font-size: 42;
    horizontal-align: center;
}

.message {
    font-size: 20;
    color: #284848;
    horizontal-align: center;
}
```

main-page.xml android上布局的文件，类似vm模板，注意，是xml的，不是html

```html
<Page xmlns="http://www.nativescript.org/tns.xsd" loaded="pageLoaded">
  <StackLayout>
    <Label text="Tap the button" cssClass="title"/>
    <Button text="TAP" tap="{{ tapAction }}" />
    <Label text="{{ message }}" cssClass="message" textWrap="true"/>
  </StackLayout>
</Page>
```

### 4.总结分析
1. 核心是用JavaScript来写代码，然后预处理成android/ios项目进行打包安装
2. 开发模式基本遵循前端的mvvm思想来实现，只是实现和表现不一样
3. 参考文档完善，整理来说是一个不错的native开发方案
4. 开发使用commonJs的规范，容易理解
5. 但是不足之处也很明显，很难做现有单页面的改造，迭代不方便，功能上线必须像客户端那样发布审核，某些程度上还是需要web页面的支持

当然这次只分析了个简单的例子，后面自己搞个复杂的例子来分享下，敬请期待(类似的还有samurai-native和react-native，坐等android支持)~