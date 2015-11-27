---
layout: post
title:  "javascript实现数据双向绑定的三种方式"
date:   2015-11-30
author: ouven
tags: javascript 数据双向绑定 mvvm
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---

### 前端数据的双向绑定方法

&emsp;&emsp;前端的视图层和数据层有时需要实现双向绑定(two-way-binding)，例如mvvm框架，数据驱动视图，视图状态机等，目前实现数据双向绑定主要有以下三种

#### 1、手动绑定
比较老的实现方式，有点像观察者编程模式，主要思路是通过在数据对象上定义get和set方法(当然还有其它方法)，调用时手动调用get或set数据，改变数据后出发UI层的渲染操作；以视图驱动数据变化的场景主要应用与input、select、textarea等元素，当UI层变化时，通过监听dom的change，keypress，keyup等事件来出发事件改变数据层的数据。整个过程均通过函数调用完成。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>data-binding-method-set</title>
</head>
<body>
    <input q-value="value" type="text" id="input">
    <div q-text="value" id="el"></div>
    <script>
        var elems = [document.getElementById('el'), document.getElementById('input')];

        var data = {
            value: 'hello!'
        };

        var command = {
            text: function(str){
                this.innerHTML = str;
            },
            value: function(str){
                this.setAttribute('value', str);
            }
        };

        var scan = function(){        
            /**
             * 扫描带指令的节点属性
             */
            for(var i = 0, len = elems.length; i < len; i++){
                var elem = elems[i];
                elem.command = [];
                for(var j = 0, len1 = elem.attributes.length; j < len1; j++){
                    var attr = elem.attributes[j];
                    if(attr.nodeName.indexOf('q-') >= 0){
                        /**
                         * 调用属性指令，这里可以使用数据改变检测
                         */
                        command[attr.nodeName.slice(2)].call(elem, data[attr.nodeValue]);
                        elem.command.push(attr.nodeName.slice(2));
                    }
                }
            }
        }

        /**
         * 设置数据后扫描
         */
        function mvSet(key, value){
            data[key] = value;
            scan();
        }
        /**
         * 数据绑定监听
         */
        elems[1].addEventListener('keyup', function(e){
            mvSet('value', e.target.value);
        }, false);

        scan();

        /**
         * 改变数据更新视图
         */
        setTimeout(function(){
            mvSet('value', 'fuck');
        },1000)

    </script>
</body>
</html>

```
#### 2、脏检查机制
&emsp;&emsp;以典型的mvvm框架angularjs为代表，angular通过检查脏数据来进行UI层的操作更新。关于angular的脏检测，有几点需要了解些：
- 脏检测机制并不是使用定时检测。
- 脏检测的时机是在数据发生变化时进行。
- angular对常用的dom事件，xhr事件等做了封装， 在里面触发进入angular的digest流程。
- 在digest流程里面， 会从rootscope开始遍历， 检查所有的watcher。
（关于angular的具体设计可以看其他文档，这里只讨论数据绑定），那我们看下脏检测该如何去做：主要是通过设置的数据来需找与该数据相关的所有元素，然后再比较数据变化，如果变化则进行指令操作

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>data-binding-drity-check</title>
</head>

<body>
    <input q-event="value" ng-bind="value" type="text" id="input">
    <div q-event="text" ng-bind="value" id="el"></div>
    <script>

    var elems = [document.getElementById('el'), document.getElementById('input')];
    
    var data = {
        value: 'hello!'
    };

    var command = {
        text: function(str) {
            this.innerHTML = str;
        },
        value: function(str) {
            this.setAttribute('value', str);
        }
    };

    var scan = function(elems) {
        /**
         * 扫描带指令的节点属性
         */
        for (var i = 0, len = elems.length; i < len; i++) {
            var elem = elems[i];
            elem.command = {};
            for (var j = 0, len1 = elem.attributes.length; j < len1; j++) {
                var attr = elem.attributes[j];
                if (attr.nodeName.indexOf('q-event') >= 0) {
                    /**
                     * 调用属性指令
                     */
                    var dataKey = elem.getAttribute('ng-bind') || undefined;
                    /**
                     * 进行数据初始化
                     */
                    command[attr.nodeValue].call(elem, data[dataKey]);
                    elem.command[attr.nodeValue] = data[dataKey];
                }
            }
        }
    }

    /**
     * 脏循环检测
     * @param  {[type]} elems [description]
     * @return {[type]}       [description]
     */
    var digest = function(elems) {
        /**
         * 扫描带指令的节点属性
         */
        for (var i = 0, len = elems.length; i < len; i++) {
            var elem = elems[i];
            for (var j = 0, len1 = elem.attributes.length; j < len1; j++) {
                var attr = elem.attributes[j];
                if (attr.nodeName.indexOf('q-event') >= 0) {
                    /**
                     * 调用属性指令
                     */
                    var dataKey = elem.getAttribute('ng-bind') || undefined;

                    /**
                     * 进行脏数据检测，如果数据改变，则重新执行指令，否则跳过
                     */
                    if(elem.command[attr.nodeValue] !== data[dataKey]){

                        command[attr.nodeValue].call(elem, data[dataKey]);
                        elem.command[attr.nodeValue] = data[dataKey];
                    }
                }
            }
        }
    }

    /**
     * 初始化数据
     */
    scan(elems);

    /**
     * 可以理解为做数据劫持监听
     */
    function $digest(value){
        var list = document.querySelectorAll('[ng-bind='+ value + ']');
        digest(list);
    }

    /**
     * 输入框数据绑定监听
     */
    if(document.addEventListener){
        elems[1].addEventListener('keyup', function(e) {
            data.value = e.target.value;
            $digest(e.target.getAttribute('ng-bind'));
        }, false);
    }else{
        elems[1].attachEvent('onkeyup', function(e) {
            data.value = e.target.value;
            $digest(e.target.getAttribute('ng-bind'));
        }, false);
    }

    setTimeout(function() {
        data.value = 'fuck';
        /**
         * 这里问啥还要执行$digest这里关键的是需要手动调用$digest方法来启动脏检测
         */
        $digest('value');
    }, 2000)

    </script>
</body>
</html>
```

#### 3、前端数据劫持(Hijacking)

&emsp;&emsp;第三种方法则是avalon等框架使用的数据劫持方式。基本思路是使用Object.defineProperty对数据对象做属性get和set的监听，当有数据读取和赋值操作时则调用节点的指令，这样使用最通用的=等号赋值就可以了。具体实现如下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>data-binding-hijacking</title>
</head>

<body>
    <input q-value="value" type="text" id="input">
    <div q-text="value" id="el"></div>
    <script>


    var elems = [document.getElementById('el'), document.getElementById('input')];

    var data = {
        value: 'hello!'
    };

    var command = {
        text: function(str) {
            this.innerHTML = str;
        },
        value: function(str) {
            this.setAttribute('value', str);
        }
    };

    var scan = function() {
        /**
         * 扫描带指令的节点属性
         */
        for (var i = 0, len = elems.length; i < len; i++) {
            var elem = elems[i];
            elem.command = [];
            for (var j = 0, len1 = elem.attributes.length; j < len1; j++) {
                var attr = elem.attributes[j];
                if (attr.nodeName.indexOf('q-') >= 0) {
                    /**
                     * 调用属性指令
                     */
                    command[attr.nodeName.slice(2)].call(elem, data[attr.nodeValue]);
                    elem.command.push(attr.nodeName.slice(2));

                }
            }
        }
    }

    var bValue;
    /**
     * 定义属性设置劫持
     */
    var defineGetAndSet = function(obj, propName) {
        try {
            Object.defineProperty(obj, propName, {

                get: function() {
                    return bValue;
                },
                set: function(newValue) {
                    bValue = newValue;
                    scan();
                },

                enumerable: true,
                configurable: true
            });
        } catch (error) {
            console.log("browser not supported.");
        }
    }
    /**
     * 初始化数据
     */
    scan();

    /**
     * 可以理解为做数据劫持监听
     */
    defineGetAndSet(data, 'value');

    /**
     * 数据绑定监听
     */
    if(document.addEventListener){
        elems[1].addEventListener('keyup', function(e) {
            data.value = e.target.value;
        }, false);
    }else{
        elems[1].attachEvent('onkeyup', function(e) {
            data.value = e.target.value;
        }, false);
    }

    setTimeout(function() {
        data.value = 'fuck';
    }, 2000)
    </script>
</body>

</html>

```

&emsp;&ensp;但值得注意的是defineProperty支持IE8以上的浏览器，这里可以使用____defineGetter____和____defineSetter____来做兼容但是浏览器兼容性的原因，直接用defineProperty就可以了。至于IE8浏览器仍需要使用其它方法来做hack。如下代码可以对IE8进行hack，defineProperty支持IE8。例如使用es5-shim.js就可以了。（IE8以下浏览器忽略）

#### 4、小结
&emsp;&emsp;首先这里的例子只是简单的实现，读者可以深入感受三种方式的异同点，复杂的框架也是通过这样的基本思路滚雪球滚大的。

[演示例子](https://github.com/ouvens/demo-file/tree/master/two-ways-binding)

参考：

https://gist.github.com/brettz9/4093766#file_html5_dataset.js
https://github.com/xufei/blog/issues/10

