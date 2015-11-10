---
layout: post
title:  "移动端mvvm框架qvm实现"
date:   2015-08-20
author: ouven
tags:   mvvm qvm
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---

---
[gitHub地址](https://github.com/ouvens/qvm)

### 1，移动端minimvvm框架qvm实现
qvm概念，一个适用于移动端的mini mvvm(什么是mvvm？没了解的同学自己去了解)框架。参考了angular和vuejs的设计实现思路，并进行简化封装，目前使用的zepto基本依赖库，使用最少的代码实现了基础功能版。
### 2，为什么要做它
PC浏览器时代，实现mvvm有着麻烦的兼容性问题。而在移动浏览器时代，浏览器原生的支持可以让我们用最少的代码来实现一个mvvm框架库，来最大程度的减少移动端业务代码的开发工作。预计对于中大型的移动前端应用项目，使用mvvm能减少至少30%的业务量，让项目更容易维护。
   (不过目前仍有很多不完善的地方后面需要持续改进)
### 3，及其简单的API介绍
directive: 以q-开始的属性为我们定义的元素动作指令
###### vm模型结构介绍：
``` javascript
    {
    $id: 823832887973495, //qvm对象的全局id,每个qvm对象对应一个
    $elem: #div, //对应的view
    $model: {  //viewModel,通过directive关联view和model的操作
        text:{
            ns: ns, //获取对象data或指令的namespace
            accessor: accessor, //同一的外部访问器，vm通过修改它来改变
            key: text, //指令名称
            directive： [directive], //指令集
            setter: function, //对象设置方法
            getter: function, //对象获取值方法
            tpl: #div //模板字符串,部分指令需要使用，如repeat
            //后续可能还要增加
        }
    },
    data: {      //对应的model，即数据层
        }
    }
```
###### 3.1 q-text 改变节点innerHTML
```javascript
    <div id="demo" q-text='text'></div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var vm = qvm.get({
        selector: '#demo',
        data:{
            text: '<h2>Hello World!</h2>'
        }
    });
    setTimeout(function(){
        vm.text.accessor = '<h2>Fuck World!</h2>';    //渲染html，通过改变accessor改变innerHTML。
    },4000)
    </script>
```
###### 3.2 q-class 改变节点class属性
```javascript
    <style>
    .red{
        color: red;
    }
    .green{
        color: green;
    }
    </style>
    <div id="demo" q-text='text' q-class="color"></div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var vm = qvm.get({
        selector: '#demo',
        data:{
            text: '<h2>Hello World!</h2>',
            color: 'red'
        }
    });
    setTimeout(function(){
        vm.text.accessor = '<h2>Fuck World!</h2>';
        vm.class.accessor = 'green';
    },4000)
    </script>
```
###### 3.3 q-attr数据属性赋值
```javascript
    <div><a><img id="demo" q-attr-src="img" width="50" height="30"></a></div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var vm = qvm.get({
        selector: '#demo',
        data: {
            img: 'http://9.url.cn/edu/banner/img/505d9c39_760_300.jpg'
        }
    });
    setTimeout(function(){
        vm.attr_src.accessor = 'http://9.url.cn/edu/banner/img/880facff_760_300.jpg';
    },4000);
    </script>
```
vm.class.accessor = 'green'; 改变元素的class类，从red改为green。
这里注意一下使用attr- 和data-指令使用attr_src和data_src来读取访问器，后面需要统一接口。
###### 3.4 q-data数据属性赋值
```javascript
    <div id="demo" q-data-title="text"><a><img q-attr-src="img" width="50" height="30"></a></div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var vm = qvm.get({
        selector: '#demo',
        data: {
            text: 'PS 大神教程',
            img: 'http://9.url.cn/edu/banner/img/505d9c39_760_300.jpg'
        }
    });
    setTimeout(function(){
        vm.data_title.accessor = '艺术人生';
    },4000);
    </script>
```
此方法用于改变data属性。
###### 3.5 q-repeat 嵌套使用
```javascript
    <style>
    .red{
        color: red;
    }
    .green{
        color: green;
    }
    </style>
    <div id="demo" q-class="color" q-repeat="list">
        <div>
        <img q-attr-src="img" width="50" height="30"><span q-text="title" q-class="color"></span>
        </div>
    </div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var list =[{
                img: 'http://9.url.cn/edu/banner/img/10b0af94_760_300.jpg',
                title: '音乐改变世界'
            },{
                img: 'http://9.url.cn/edu/banner/img/880facff_760_300.jpg',
                title: 'PS 大神教程'
            },{
                img: 'http://9.url.cn/edu/banner/img/505d9c39_760_300.jpg',
                title: '艺术人生'
            }];
    var vm = qvm.get({
        selector: '#demo',
        data:{
            text: '<h2>Hello World!</h2>',
            color: 'red',
            list: list
        }
    });
    setTimeout(function(){
        delete list[2];
        list[0].title='music change the world';
        list[1].title='PS master learning';
        vm.class.accessor = 'green';
        vm.repeat.accessor = list;
    },4000);
    </script>
delete list[2];
list[0].title='music change the world';
list[1].title='PS master learning';
改变repeat渲染数组的内容，只对数组进行修改和删除长度。
```
###### 3.6 q-对象内部渲染
```javascript
    <style>
    .red{
        color: red;
    }
    .green{
        color: green;
    }
    </style>
    <div id="demo" q-repeat="list">
        <div>
            <span q-class="color" q-text="title"></span>
            <span>
                <img q-attr-src="img.src" width="50" height="30">
            </span>
        <div>
    </div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var data = {
        title: '<h2>Hello World!</h2>',
        color: 'red',
        img: {
            src: 'http://9.url.cn/edu/banner/img/880facff_760_300.jpg'
        }
    };
    var vm = qvm.get({
        selector: '#demo',
        data: {
            list: data
        }
    });
    setTimeout(function(){
        data.color = 'green';
        data.title = '<h2>Fuck World!</h2>';
        data.img.src = 'http://9.url.cn/edu/banner/img/10b0af94_760_300.jpg';
        vm.repeat.accessor = data;
    },4000);
    </script>
```
qvm支持嵌套渲染，但是viewModel以定义的最外层数据为准。
###### 3.7 q-on简单事件绑定
定义的动作和事件名，目前子节点上的on代理在根元素上，避免了重复绑定，如果根节点和根节点同时含有on方法，则按照冒泡的原则进行事件处理。实现时使用了根节点循环向下传递的方式。
###### 示例
```javascript
    <style>
    .red{
        color: red;
    }
    .green{
        color: green;
    }
    </style>
    <div id="demo" q-repeat="list" q-on="click|action">
        <div>
            <span q-class="color" q-text="title"></span>
            <span>
                <img q-attr-src="img.src" width="50" height="30">
            </span>
        <div>
    </div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var data = {
        title: '<h2>点我!</h2>',
        color: 'red',
        img: {
            src: 'http://9.url.cn/edu/banner/img/880facff_760_300.jpg'
        }
    };
    var vm = qvm.get({
        selector: '#demo',
        data: {
            list: data
        },
        action: function(){
            alert('点击事件!');
        }
    });
    </script>
```
目前实现了节点事件代理到最外层的qmv对象元素上。不对内部元素做绑定。
###### 3.8 q-*自定义directive
```javascript
    <style>
    .red{
        color: red;
    }
    .green{
        color: green;
    }
    </style>
    <div id="demo" q-repeat="list" q-on="click|action" q-self='selfProcess'>
        <div>
            <span q-class="color" q-text="title"></span>
            <span>
                <img q-attr-src="img.src" width="50" height="30">
            </span>
        <div>
    </div>
    <script type="text/javascript" src="js/zepto.js"></script>
    <script type="text/javascript" src="js/qvm.js"></script>
    <script>
    var data = {
        title: '<h2>点我!</h2>',
        color: 'red',
        img: {
            src: 'http://9.url.cn/edu/banner/img/880facff_760_300.jpg'
        }
    };
    var vm = qvm.get({
        selector: '#demo',
        data: {
            list: data
        },
        action: function(){
            alert('点击事件!');
        },
        selfProcess: function(key, vm){
            console.log(key, vm);
            alert('我是一个自定义处理指令!嘿嘿嘿~')
        }
    });
    </script>
```
子定义的指令需要遵守一定的规则，例如下面q-self对应的指令为selfProcess的函数，则节点扫描时会自动执行self指令的selfProcess函数。

TODO：
更好的dirtycheck实现，类似virtual dom的方式~