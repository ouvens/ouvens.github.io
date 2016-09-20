---
layout: post
title:  "理解ionic2 + angular2开发方案"
date:   2016-09-20
author: ouven
tags:   ionic2 angular2
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---


&emsp;&emsp;看了下ionic2的官方文档，做了简单的分析理解。

####  1. 安装使用

&emsp;&emsp;ionic2的安装运行基本和前版本的ionic基本一致，非常简单。

```
npm install -g ionic    # 安装ionic工具集
ionic start projectName --v2    # --v2表示使用ionic2 + angular2的组合方式创建项目，否则使用ionic + angular创建项目，此时ionic会下载所需要的相关包
cd projectName  # 进入创建的项目名称目录
ionic serve # 启用浏览器调试应用页面，这时通过浏览器打开默认端口页面http://localhost:8100/#/tab/dash就可以打开应用页面了
```

> 当然这里需要保证你的开发环境SDK已经安装成功了，例如Android打包平台的运行环境，可以参考[Ionic Hybrid跨终端应用程序开发方案研究](http://jixianqianduan.com/frontend-client/2015/06/16/ionic-app-dev.html)

&emsp;&emsp;如果需要在移动设备上打包运行，则需要添加相对应的插件模块。

```
npm install -g cordova  # 如果没有真实设备，可以通过这个命令来安装模拟环境
ionic platform add ios # 添加ios运行支持
ionic emulate ios   # 模拟运行ios环境
ionic platform add android  # 添加Android运行环境支持
ionic run android   # 使用Android运行应用
```

&emsp;&emsp;正常情况下，这里ionic会将打包的文件安装到设备或调试模拟器上运行打开应用。

####  2. 和ionic的区别

&emsp;&emsp;ionic2是建立在angular 2上的，angular 2推荐使用typescript进行项目的开发，所以到了ionic2，就可以这样来开发我们的项目了。一般情况下，我们创建应用完成后，www/目录为我们页面的源代码。其目录结构如下：

```
+ www/
    + css/
    + img/
    + js/
    + lib/
    + templates/
    + index.html
    + manifest.json
    + service-worker.js
```

&emsp;&emsp;我们以www/js/app.js为例。

```javascript
// 入口JavaScript文件，配置页面路由与加载的视图
// ionic版本写法
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    }).controller('MainCtrl', function($scope){
        $scope.data ={
            text: 'Hello World'
        }
    }
)

});

// ionic 2写法
@Component({
    templateUrl:'main/main.html'
});
export class MainCmp {
    constructor(){
        this.data ={
            text: 'Hello World'
        }
    }
}

```

&emsp;&emsp;templates/tabs.html的内容如下。

```html
<ion-content ng-controller="MainCtrl">
    <ion-item>
    {{data.text}}
    </ion-item>
</ion-content>
```

&emsp;&emsp;ionic2里面里可以这样来适应原来的版本：

```html
<ion-content ng-controller="MainCtrl as main">
    <ion-item>
    {{main.data.text}}
    </ion-item>
</ion-content>
```

&emsp;&emsp;值得注意的是，这里`<ion-content>`等为ionic-angular提供的组件模块，它类似于Webcomponent的方式，能被angular识别解析。通俗的理解就是一个类似bootstrap的UI组件库。

#### 3、组件

&emsp;&emsp;ionic2除了提供统一便捷式APP打包的解决方案，还提供了一个用于移动端的UI组件库。其实类似的组件库有很多，bootstrap、frozenui、wui等等，但是与其它框架提供UI组件不同的是，ionic2提供的组件规范是面向未来Webcomponent的方式实现的。

&emsp;&emsp;例如对于一个对话框组件，一般的UI框架可能这样来实现，相信类似的框架大家多少用过。这里以frozenui为例，一般通过对元素添加不同的class名称来控制组件的样式和显示，而像`ui-dialog`这些类名是UI库统一定义好的。

```html
<div class="ui-dialog">
    <div class="ui-dialog-cnt">
      <header class="ui-dialog-hd ui-border-b">
                  <h3>新手任务</h3>
                  <i class="ui-dialog-close" data-role="button"></i>
              </header>
        <div class="ui-dialog-bd">
            <h4>标题标题</h4>
            <div>这是标题的内容！</div>
        </div>
        <div class="ui-dialog-ft">
            <button type="button" data-role="button">取消</button>
            <button type="button" data-role="button">开通</button>
        </div>
    </div>        
</div>
<script class="demo-script">
$(".ui-dialog").dialog("show");
</script>
```

&emsp;&emsp;但是使用ionic2，你可能会这样来使用，在这里，我们没有去对模块元素添加一些样式的类，因为angular2将自定义组件标签`ion-header`对应的CSS已经通过Webcomponent的形式引入了，那么我们只用管怎样使用结构层结构就可以了，但是这里注意的是`primary block`等类名没有添加到class中。

```html
<ion-header>
    <ion-navbar>
        <ion-title>Confirm</ion-title>
    </ion-navbar>
</ion-header>

<ion-content padding>
    <button primary block (click)="doConfirm()">确认对话框</button>
</ion-content>

<script>
import { AlertController } from 'ionic-angular';
export class MyPage {
    constructor(public alertCtrl: AlertController) {}
    showConfirm() {
        let confirm = this.alertCtrl.create({
            title: '标题标题',
            message: '这是标题的内容',
            buttons: [{
                text: '取消',
                handler: () => {
                    console.log('取消');
                }
            }, {
                text: '确定',
                handler: () => {
                    console.log('A确定');
                }
            }]
        });
        confirm.present();
    }
}
</script>
```

&emsp;&emsp;其它的相关组件的方式类似，同时你也可以去自定义遵循Webcomponent的element 组件。

> 更多API: http://ionicframework.com/docs/v2/components/#alert-prompt

#### 4、native交互

&emsp;&emsp;当然，ionic2还提供了与Native客户端的相互调用能力，前端相关的一套JavaScript调用库被称为Ionic Native。如果在你的APP需要调用Native调用能力。现需要安装引入对应的模块，一边在分析打包时引入。

```
npm install ionic-native --save
```

&emsp;&emsp;调用时就可以这样来使用。

```
import {Geolocation} from 'ionic-native';

Geolocation.getCurrentPosition().then(pos => {
    console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
});

let watch = Geolocation.watchPosition().subscribe(pos => {
    console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
});

// to stop watching
watch.unsubscribe();
```

&emsp;&emsp;使用ionic2也可以使用ES6+的方式来实现。

```
// ES6 / TypeScript / Ionic 2 / Angular 2
import {Camera} from 'ionic-native';
this.platform().then(() => {
    Camera.getPicture().then(
        res => console.log("We have taken a picture!"),
        err => console.error("Error taking picture", err)
    );
});
```

> 具体更多API: http://ionicframework.com/docs/v2/native/

#### 5、主题与图标

&emsp;&emsp;如果你需要改变ionic2 UI组件库的显示风格，你也可以自定义自己的APP样式。方法也很简单，ionic2 的UI组件库样式引用了通用的样式变量，在`app/theme/app.variables.scss`里面修改响应的颜色和字体值就可以了。这点和其它UI框架是一样的。当然你也可以修改保存多个主题风格的变量文件，以供选择使用。

```scss
$colors: (
    primary:    #387ef5;
    secondary:  #32db64;
    danger:     #f53d3d;
    light:      #f4f4f4;
    dark:       #222;
);
```

&emsp;&emsp;对于图标的话就没什么讲的了，和fontawsome一样，ionic2给了UI框架自带的可选图标，大家可以根据下面的文档说明选择使用。

> 图标参考: http://ionicframework.com/docs/v2/ionicons/

#### 6、总结

&emsp;&emsp;总结来看，ionic2不仅为我们提供了打包前端页面应用的解决方案，还为我们提供了一整套的UI组件库，而且组件均使用Web Component规范来实现，开发体验有了较好的改善。

> 更多API: http://ionicframework.com/docs/v2/