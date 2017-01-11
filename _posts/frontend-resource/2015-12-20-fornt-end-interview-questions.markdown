---
layout: post
title:  "一些前端编程题"
date:   2015-12-20
author: ouven
tags:  一些前端编程题
categories: frontend-resource
cover:  "assets/category/type-javascript.png"
---



###### 1，数组元素统计方法，统一数组中各个元素出现的次数，使用O(1)复杂度算法。

```javascript
function makeCount(arr){
    let countObj = {};
    for(let item of arr){
        if(countObj[item]){
            countObj[item] ++;
        }else{
            countObj[item] = 1;
        }
    }
    return countObj;
}
```

###### 2，计算目录/a/b/c/d/e.js和/a/b/f/g.js的相对目录。

```javascript
function caculateRoute(path1, path2) {
    let pathArr1 = path1.split('/'),
        pathArr2 = path2.split('/'),

        routeArr = [],
        fileArr = [],
        diff = false,

        length = pathArr1.length;

    for (let i = 1; i < length; i++) {
        if (pathArr1[i] !== pathArr2[i] || diff) {
            if (pathArr1[i]) {
                routeArr.push('..');
            }
            if (pathArr2[i]) {
                fileArr.push(pathArr2[i]);
            }

            diff = true;
        } else {
            diff = false;
        }
    }
    return routeArr.join('/') + '/' + fileArr.join('/');
}

let path = caculateRoute('/a/b/c/d/e.js', '/a/b/f/g.js'); //  ../../../f/g.js

```


###### 3，原生实现ajax请求函数。创建，发送，监听三部分

```javascript
function ajax(opt){
    let xhr;
    if(window.ActiveXObject){
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }else{
        xhr = new XMLHttpRequest();
    }

    xhr.open(opt.type, opt.url, true);
    xhr.send(opt.data);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            opt.success(xhr.responseText);
        }else{
            opt.error(xhr.error);
        }
    }
}

ajax({
    type: 'get',
    url: 'http://www.a.com',
    data: {
        name: 'ouven'
    },
    success: function(data){
        console.log(data);
    },
    error: function(e){
        console.log(e);
    }
});
```

###### 4，js实现原生拖拽效果。

###### 5，实现一个输入框的实时输入功能，与自动补全功能。

###### 6，实现两个大数相加。例如1862836423423423486348+8236483927349234

```javascript
function add(num1, num2) {
    var numArr1 = num1.toString().split('').reverse(),
        numArr2  = num2.toString().split('').reverse(),
        maxLength = numArr1.length > numArr2.length?numArr1.length:numArr2.length;
        flowArr = [0],
        resultArr = [];

    for(let i = 0; i < maxLength; i++){
        numArr1[i] = parseInt(numArr1[i], 10) || 0;
        numArr2[i] = parseInt(numArr2[i], 10) || 0;

        if(numArr1[i] + numArr2[i] + (flowArr[i] || 0) >= 10){
            resultArr[i] = numArr1[i] + numArr2[i] - 10;
            flowArr[i+1] = 1;
        }else{
            resultArr[i] = numArr1[i] + numArr2[i];
            flowArr[i+1] = 0;
        }
    }

    for(let i = 0; i < flowArr.length; i++){
        resultArr[i] = (resultArr[i] || 0) + (flowArr[i] || 0);
    }

    if(resultArr[flowArr.length -1] === 0){
        resultArr.pop();
    }

    return resultArr.reverse().join('');
}

console.log(add('410', '699'));
```

###### 7，统计页面打开次数，每次刷新打开加1。

```javascript

var count = localStorage.getItem('count') || 0;

count ++;

localStorage.setItem('count', count);

document.getElementById('test').innerHTML = count;
```

###### 8，js实现排序算法。

```javascript
function select(array){
    let min, tmp;
    for(var i = 0, len = array.length; i < len; i++){
        min = i;
        for(var j = i + 1; j < len; j ++){
            if(array[j] < array[i]){
                min = j;
            }
        }
        
        tmp = array[i];
        array[i] = array[min];
        array[min] = tmp;
        console.log(min);
    }

    return array;

}


function insert(array){
    let array1 = [array[0]];

    console.log(array1);

    for(let i = 1, len = array.length; i < len; i ++){
        let len1 = array1.length;
        console.log(array[i], array1, len1, i);
        for(let j = 0; j < len1; j ++ ){

            if(array[i] <= array1[j]){
                array1.splice(j, 0, array[i])
                break;
            }

            if( j+1 < len1 && array[i] > array1[j] && array[i] <= array1[j+1] ){
                array1.splice(j+1, 0, array[i]);
                break;
            }

            if(array[i] > array1[j] && j+1 === len1){
                array1.splice(j+1, 0, array[i]);
                break;
            }

        }
    }
    console.log(array1);
    return array1;
}

insert([2,1,23,32,12,34,12,3,8,9]);
```

###### 9，实现一个右键菜单，点击选项后消失。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
    html,
    body {
        height: 100%;
        width: 100%;
        background-color: #eee;
    }
    
    .menu {
        position: fixed;
        z-index: 9;
        display: none;
        background-color: #fff;
    }
    </style>
</head>

<body>
    <button id="test">按钮</button>
    <ul class="menu" id="menu">
        <li class="menu-item">菜单1</li>
        <li class="menu-item">菜单2</li>
        <li class="menu-item">菜单3</li>
    </ul>
    <script>
    document.body.oncontextmenu = function(e) {
        e.preventDefault();
        e = e || window.event;

        var menu = document.getElementById('menu');
        menu.style.display = 'inline-block';
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';

        menu.onclick = function(e) {
            e.preventDefault();
            e = e || window.event;
            var target = e.target || e.srcElement;
            alert(target.innerHTML);

            menu.style.display = 'none';

        }
    }

    document.body.onclick = function(e) {

        e.preventDefault();
        e = e || window.event;
        var menu = document.getElementById('menu');
        menu.style.display = 'none';
        document.body.onclick = null;

    }
    </script>
</body>
</html>
```

###### 10，新建一个ul元素，往里面插入1000个li元素。完成后再将这1000个li子元素倒序显示？(使用原生js实现)。

###### 11，实现类的继承。

###### 12，自适应三列布局，左右定宽，中间自适应。

###### 13，实现一个右键菜单，点击左键或其它地方消失。

###### 14，js原生实现事件绑定方法？要求兼容ie和chrome。

```
function on(type, fn) {
    var el = this;
    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (el.attacheEvent) {
        el.attachEvent('on' + type, fn.bind(el));
    } else {
        el['on' + type] = fn;
    }
}

var $ = function(selector) {
    document.getElementById(selector).__proto__.on = on;
    return document.getElementById(selector);
}

$('test').on('click', function(e) {
    console.log('obj');
});
```

###### 15，实现一个方块从浏览器左边移动到右边，再回到左边的循环动画。


###### 16，实现一个Animal类，type属性为animal，实现一个Dog继承Animal，catogery属性为dog，用Dog类生成一个Mydog实例，name属性为Bolt？（尽量用多种方法实现）


###### 17，实现银行卡号输入时自动按四个数字格式化;数字按照因为数字添加逗号；

```javascript
'937493453453'.replace(/(\d{4})/g, '$1 ').trim()

'937493453453'.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/,$/,'').split('').reverse().join('');
```

###### 18，实现一个超大数组的计算。

function chunkExec(content, processArr, lengthArr, delayArr){
    
}

###### 19， js保留两位小数的修正方法

```javascript
function fixedNumber(num){

    let numString = num + "",
        pointerIndex = numString.indexOf('.'),
        result = "";

    // 当含有两位小数并且小数点后第二位大于等于5时且第三位等于5时会发生不进位的现象

    if (pointerIndex >= 0 && numString.match(/\.(\d*)/)[1].length === 3 && numString.match(/\.\d(\d)/)[1] > '5') {
        result = Number(num.toFixed(2)) + 0.01;
    } else {
        result = num.toFixed(2);
    }
    return result;
}

console.log(fixedNumber(1.2354));
```

###### 20，实现一个迭代相加函数，求阶乘。

```javascript
function caculateTower(number){
    if(number - 1 > 0){
        return number * caculateTower(number -1);
    }
    return number;
}

caculateTower(4); // 24
```

###### 21，使用promise 4秒后打印'A'，然后经过3秒打印'B'，再经过2秒打印'C'，再经过一秒打印'D'。

```javascript
let promise = new Promise(function(resolve){
    setTimeout(function(){
        console.log('A');
        resolve();
    }, 4000);    
});

promise.then(function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log('B');
            resolve();
        }, 3000)
    });
}).then(function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log('C');
            resolve();
        }, 2000)
    });
}).then(function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log('D');
        }, 1000)
    });
});
```