---
layout: post
title:  "ionic进阶开发中的命令使用"
date:   2015-10-24
author: ouven
tags: ionic 进阶开发
cover:  "assets/category/type-client.png"
---


## ionic 开发构建之路

### 1，创建一个自定义路径的项目
如何基于现有的代码路径创建一个项目

```javascript

ionic start projectPath repositryPath
eg:
ionic start ./demo "E:\github\qvm\dist" #注意带上引号，否则报错了，这里如果需要做的话只需要做到将dist的目录创建就可以了，而且文件使用相对路径

ionic serve -p 80 #在80端口启动调试服务并自动watch
ionic platform add android/ios
ionic run/emulate android/ios

ionic io init #添加签名和授权
ionic resources -i a.png #上传app icon图片，默认icon放在resources下面
ionic resources -s a.png #上传app 启动图片图片，默认icon放在resources下面

```

### 2，命令行翻译指南

---

ionic命令行指令:
start [options] <PATH> [template] .............  在制定的目录中创建一个项目
                                    [options] 命令行任意的标识
                                    <PATH> 创建项目的目录，必填
                                   [template] 起始模板，可以使用github库，本地路径或代码包，默认使用"tabs"模板
      [--appname|-a]  .........................  制定app的名称 (注意名称加引号)
      [--id|-i]  ..............................  app的包名 <widget id> 配置, 例如: com.mycompany.myapp
      [--no-cordova|-w]  ......................  创建一个不带cordova 环境的基础框架，Cordova提供了一组设备相关的API，通过这组API，移动应用能够以JavaScript访问原生的设备功能，如摄像头、麦克风等。如果创建与原生无关的app，则可以使用-w
      [--sass|-s]  ............................  设置使用sass预处理器
      [--list|-l]  ............................  可用的起始模板
      [--io-app-id]  ..........................  指定Ionic.io使用的app ID
      [--template|-t]  ........................  指定项目的初始模板
      [--zip-file|-z]  ........................  指定项目初始模板的zip包下载url地址

---
serve [options] ...............................  启动本地服务器进行开发测试 dev/testing
      [--consolelogs|-c]  .....................  输入app的控制台到ionic的控制台显示
      [--serverlogs|-s]  ......................  输入本地服务器日志到ionic的控制台显示
      [--port|-p]  ............................  指定本地服务器的开发端口 (8100默认)
      [--livereload-port|-r]  .................  自动刷新端口(35729默认)
      [--nobrowser|-b]  .......................  不自动打开浏览器
      [--nolivereload|-d]  ....................  不使用livereload
      [--noproxy|-x]  .........................  不使用代理
      [--address]  ............................  使用指定的host地址打开
      [--all|-a]  .............................  所有地址上启动调试 (0.0.0.0)
      [--browser|-w]  .........................  指定使用的浏览器 (safari, firefox, chrome)
      [--browseroption|-o]  ...................  指定一个具体路径打开 (/#/tab/dash)
      [--lab|-l]  .............................  在多种平台系统和多个屏幕下打开测试
      [--nogulp]  .............................  服务器开启时不运行gulp
      [--platform|-t]  ........................  指定的平台模拟打开 (ios/android)

---

platform [options] <PLATFORM> .................  添加创建app的平台
         [--noresources|-r]  ..................  不使用默认的app logo和启动画面
         [--nosave|-e]  .......................  不保存平台配置到package.json画面

---

run [options] <PLATFORM> ......................  在连接的设备上启动app
    [--livereload|-l]  ........................ 实时刷新设备中文件
    [--port|-p]  ..............................  运行设备的端口号 (8100默认，需要启动livereload.)
    [--livereload-port|-r]  ...................  自动刷新端口(35729默认)
    [--consolelogs|-c]  .......................   输入app的控制台到ionic的控制台显示(需要启动livereload)
    [--serverlogs|-s]  ........................  输入本地服务器日志到ionic的控制台显示 (需要启动livereload)
    [--debug|--release]  ...................... 生成发布版本
    [--device|--emulator|--target=FOO]

---

emulate [options] <PLATFORM> ..................  在连接的模拟器上启动app
        [--livereload|-l]  ....................  实时刷新设备中文件
        [--port|-p]  ..........................  运行设备的端口号 (8100默认，需要启动livereload.)
        [--livereload-port|-r]  ...............  自动刷新端口(35729默认)
        [--consolelogs|-c]  ...................   输入app的控制台到ionic的控制台显示(需要启动livereload)
        [--serverlogs|-s]  ....................  输入本地服务器日志到ionic的控制台显示 (需要启动livereload)
        [--debug|--release]  .................. 生成发布版本
        [--device|--emulator|--target=FOO]

---

build [options] <PLATFORM> ....................  未指定平台构建一个app
      [--nohooks|-n]  .........................  不使用Cordova的调用

---

plugin add [options] <SPEC> ................... 添加一个Cordova插件
                                                 <SPEC> 可以是插件ID，本地路径或者git地址
       [--searchpath <directory>]  ............  当使用ID时，优先查找目录，而不是git的url
       [--nosave|-e]  .........................  不保存插件到package.json文件

---

resources .....................................  自动生成app图标和启动画面图片 (beta)
                      将图片放在 ./resources 目录下，命名为splash.png或icon， 文件类型为 .png, .ai, and .psd
                      Icon大小为192x192 px的无圆角图片.
                      splash大小为2208x2208 px, 并把要显示的内容至于中间.
          [--icon|-i]  ........................  生成logo图标
          [--splash|-s]  ......................  生成启动画面图片

---

upload ........................................ 上传app到ionic账户
       [--email|-e]  ..........................  Ionic账户邮箱
       [--password|-p]  .......................  Ionic账户密码
       [--note]  ..............................  上传描述
       [--deploy <channel_tag>]  ..............  部署上传的APP到开发通道

---

share <EMAIL> .................................  分享app到邮箱
                                                 <EMAIL> 要分享的邮箱

---

lib [options] [update] ........................  获取ionic的库版本或升级ionic库
                                                 [update] 升级Ionic框架的www/lib/ionic
    [--version|-v]  ...........................  指定版本，否则使用最新版本

---

setup [sass] .................................. 使用工具配置项目 (beta)
                                                 [sass] 设置项目使用sass预处理

---

io <command> ..................................  集成app到ionic.io平台服务 (alpha)
                                                 <command> init

---

security <command> [options] ..................  保存app平台上的签名证书(alpha)
                                                 <command> profiles list, profiles add "<name>", credentials android, or credentials ios
         [--profile <tag>]  ...................  (credentials <platform>) 指定profile证书保存的路径
         [--keystore|-s <path>]  ..............  (credentials android) 指定 keystore文件路径
         [--keystore-password|-p <password>]  .  (credentials android) 指定app的 keystore password (exclude for prompt)
         [--key-alias|-k <alias>]  ............  (credentials android) 指定app的key alias
         [--key-password|-w <password>]  ......  (credentials android) 指定app的key password  (exclude for prompt)
         [--cert|-c <path>]  ..................  (credentials ios) 指定p12 文件的路径
         [--cert-password|-p <password>]  .....  (credentials ios)指定 certificate 密码 (exclude for prompt)
         [--provisioning-profile|-r <path>]  ..  (credentials ios) 指定 .mobileprovision 文件路径

---

push ..........................................  上传 APNS 和 GCM 证书到 Ionic Push (alpha)
     [--ios-dev-cert]  ........................  上传开发的 .p12文件到 Ionic Push
     [--ios-prod-cert]  .......................  上传发布的 .p12文件到Ionic Push
     [--production-mode=y,n]  .................  Tell Ionic Push to use production (y) or sandbox (n) APNS servers
     [--google-api-key <your-gcm-api-key>]  ...  设置app 早Ionic Push的 GCM API key

---

package <command> [options] ...................  使用ionic打包构建app
                                                 <command> build android, build


---

ios, list, info, or download
        [--release]  ..........................  (构建 <platform>) 标记为发布版
        [--profile|-p <tag>]  .................  (构建 <platform>) 指定证书或安全签名
        [--destination|-d <path>]  ............  (download) 指定打包下载的输出目录

---
   
config <command> [key] [value] ................  设置ionic的运行环境(alpha)
                                                 <command> set, unset, build, or info
                                                 [key] 设置的key
                                                 [value] 设置的值

---

browser <command> [browser] ...................  添加另一个浏览器给一个平台
                                                 <command> "add remove rm info versions upgrade list ls revert"
                                                 [browser] 需要操作的浏览器 (Crosswalk)
        [--nosave|-n]  ........................  不保存平台和插件到package.json

---

service add [options] <SPEC> .................. 添加ionic服务包并安装需要的插件
                                                 <SPEC> 可以是服务名称或git

---

add [name] .................................... 添加可用的图标，组件和(附加组件)addons
                                                 [name] 需要添加的图标，组件和(附加组件)addons

---

remove [name] ................................. 移除可用的图标，组件和(附加组件)addons
                                                 [name] 需要移除的图标，组件和(附加组件)addons

---

list ..........................................  查看项目可用的图标，组件和(附加组件)addons

---

ions ..........................................  查看可使用的图标

---

templates .....................................  查看可用的起始模板

---

info ..........................................  查看用户的运行环境

---

help [command] ................................  查看某个命令的帮助文档
                                                 [command] 要查看帮助文档的命令

---

link [appId] ..................................  设置APP的Ionic App ID
                                                 [appId] 设置的app id
     [--reset|-r]  ............................  重置appid

---

hooks [add|remove|permissions|perm] ...........  管理 Cordova调用
                                                 [add|remove|permissions|perm] 添加，移除，修改默认cordavo调用的权限

---

state <COMMAND> ...............................  保存或恢复当前app的状态到package.json文件中
                                                 <COMMAND> [ save | restore | clear | reset ]
      [save]  .................................  保存平台和插件
      [restore]  .............................. 恢复平台和插件
      [clear]  ................................  清除平台和插件
      [reset]  ................................  重置平台和插件
      [--plugins]  ............................  只对插件操作
      [--platforms]  ..........................  只对平台操作

---

docs <TOPIC> ..................................  打开Ionic文档
                                                 <TOPIC> 要浏览的文档内容，使用ls可以查看所有


