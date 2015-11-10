---
layout: post
title:  "Ionic Hybrid跨终端应用程序开发方案研究"
date:   2015-06-16
author: ouven
tags: ionic
cover:  "assets/category/type-client.png"
---

ionic是最近一个很流行的Hybird移动开发解决方案，个人兴趣研究了一下，还是不错的
https://github.com/driftyco/ionic

### 1.环境准备
- 安装nodejs
- 安装cordova和ionic

```javascript
$npm install -g cordova ionic
```

或者下载github上项目代码进行构建(不推荐)
- 安装java JDK
    jdk是Java运行开发环境，按android开发必须的开发的环境
    
```
JAVA_HOME D:/program file/java/jdk_1.7.34/
path D:/program file/java/jdk_1.7.34/bin
classpath   C:/apache-ant-1.8.1/lib
```

测试方法：java -version

- 安装Apache ant
Apache Ant,是一个将软件编译、测试、部署等步骤联系在一起加以自动化的一个工具，大多用于Java环境中的软件开发。由Apache软件基金会所提供。这里用到的的是用于android签名证书等打包(android开发过程中ide使用gradle配置打包，早期都是用的ant打包，这里使用的方法比较原始)
http://ant.apache.org/bindownload.cgi 上下载最新版apache-bin(可选择安装型或压缩包型)，然后添加系统环境变量

```
ANT_HOME    C:/ apache-ant-1.9.5
path        C:/ apache-ant-1.9.5/bin
classpath   C:/apache-ant-1.9.5/lib
```

测试方法：ant -version

- 安装Android sdk
下载最新的adk，http://developer.android.com/sdk/installing/index.html 下载后解压到某个目录(例如D盘)，然后添加系统环境变量

```
ANDROID_HOME   D:/android-sdk-windows
path        D:/android\android-sdk-windows\tools
classpath  D:/android\android-sdk-windows\tools\lib
```

测试方法：android
必须掌握的两个命令：abd start-server/ adb kill-server，用于启动android debug服务，adb使用与启动模拟器或是通过手机的自动安装调试，并可以看到log信息。这两个命令会经常用到
然后 命令行运行一下tns，如果看到以下提示信息，就可以开始第一个开发了。

```
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

### 2.开始开发
- 创建项目

```
$ ionic start projectName tabs
$ cd projectName
├── bower.json     // bower dependencies
├── config.xml        // cordova configuration，例如标题和入口页面
├── gulpfile.js        // gulp tasks
├── hooks              // custom cordova hooks to execute on specific commands
├── resources         // custom static files such as icon
├── ionic.project    // ionic configuration
├── package.json   // node dependencies
├── platforms      // iOS/Android specific builds will reside here
├── plugins         // where your cordova/ionic plugins will be installed
├── scss               // scss code, which will output to www/css/
└── www            // application - what we need pay attention。JS code and libs, CSS, images, etc.
```

- 配置移动平台

```
$ ionic platform add ios
$ ionic platform add android
$ ionic build android/ios
$ ionic emulator/run android/ios (emulator将在模拟器上启动，run将在真实手机上启动)
```

如果能够正常启动，就可以任性的开发了。

### 3.项目代码结构分析
对于前端开发来说，只要关注www/下的项目代码就可以了，打包编译后www将会到android项目的asset目录下面。而客户端的主页面是通过一个入口html来开始运行的，如下：

```
package com.ionicframework.demo862117;

import android.os.Bundle;
import org.apache.cordova.*;
public class MainActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }
}
```

这里主页面打包后会生成带上主要的android/ios外壳，界面产生的所有内容由H5实现。

### 4.angular与组件化

ionic使用了angular作为基础开发库，并用组件化的方案来管理自己的一套前端库，主要用到angular，angular-ui，iconfont，svg等前端技术知识，这里不一一展开了。
http://www.ionicframework.com/docs/components/ ，当然这里有了一套完整的前端开发框架很文档。即如果我们用它来开发应用的话，是需要用它的框架来写代码就可以了。

### 5.总结分析

#### 优势

1. 大量可参考的组件和文档，使得开发入门成本比较低
2. 兼容angular(当然自己也可以用其他的，只是默认创建项目时引入了angular)
3. 整理来说，ionic的方案仍然集中在hybrid开发的集成化，对于快速开发内嵌页面来说是很好的选择
4. 前端人员除了搭环境，不需要了解过多客户端的知识，就可以开发hybrid跨终端的app了

#### 可能存在的不足：

1. 直接将页面打包发布会使得迭代不好解决，如果使用离线包机制可以解决这一问题，但是客户端的定制化仍然我们对预- - 处理后的代码进行较大的二次修改
2. 依然停留在webview开发阶段，不能突破webview解析dom的性能问题
3. 目前没有自动化调试，需借助外部工具来做