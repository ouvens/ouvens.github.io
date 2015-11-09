---
layout: post
title:  "javascript基础--js不同浏览器的差异性"
date:   2015-01-01
author: ouven
categories: frontend-javascript
tags: js兼容性
cover:  "assets/category/type-javascript.png"
---

### javascript的浏览器差异性特征

```javascript
var ie6=!-[1,]&&!window.XMLHttpRequest
//检查IE6最简洁代码
```

兼容性问题是由于多个浏览器同时存在而导致的。这些浏览器在处理一个相同的页面时，表现有时会有差异。这种差异可能很小，甚至不会被注意到；也可能很大，甚至造成在某个浏览器下无法正常浏览。我们把引起这些差异的问题统称为“浏览器兼容性问题”。下面让我们一起来看Javascript在解决兼容性问题上的方法。

1. document.form.item 问题
问题：
代码中存在 document.formName.item("itemName") 这样的语句，不能在FF下运行
解决方法：
改用 document.formName.elements["elementName"]
2. 集合类对象问 
问题：
代码中许多集合类对象取用时使用()，IE能接受，FF不能
解决方法：
改用 [] 作为下标运算，例： 

```javascript
document.getElementsByName("inputName")(1)  改为 document.getElementsByName("inputName")[1]
```

3. window.event
问题：
使用 window.event 无法在FF上运行
解决方法：
FF的 event 只能在事件发生的现场使用，此问题暂无法解决。可以把 event 传到函数里变通解决：

```javascript
onMouseMove = "functionName(event)" 
function functionName (e) {  
e = e || window.event;  
......  
}  
```
 
 
4. HTML对象的 id 作为对象名的问题
问题：
在IE中，HTML对象的 ID 可以作为 document 的下属对象变量名直接使用，在FF中不能
解决方法：
使用对象变量时全部用标准的 getElementById("idName")

5. 用 idName 字符串取得对象的问题
问题：
在IE中，利用 eval("idName") 可以取得 id 为 idName 的HTML对象，在FF中不能
解决方法：
用 getElementById("idName") 代替 eval("idName")

6. 变量名与某HTML对象 id 相同的问题
问题：
在FF中，因为对象 id 不作为HTML对象的名称，所以可以使用与HTML对象 id 相同的变量名，IE中不能
解决方法：
在声明变量时，一律加上 var ，以避免歧义，这样在IE中亦可正常运行
最好不要取与HTML对象 id 相同的变量名，以减少错误

7. event.x 与 event.y 问题
问题：
在IE中，event 对象有x,y属性，FF中没有
解决方法：
在FF中，与 event.x 等效的是 event.pageX ，但event.pageX IE中没有
故采用 event.clientX 代替 event.x ，在IE中也有这个变量
event.clientX 与 event.pageX 有微妙的差别，就是滚动条
要完全一样，可以这样：
mX = event.x ? event.x : event.pageX;
然后用 mX 代替 event.x

8. 关于frame
问题：
在IE中可以用 window.testFrame 取得该frame，FF中不行
解决方法：

```javascript
window.top.document.getElementById("testFrame").src = 'xx.htm' 
window.top.frameName.location = 'xx.htm' 
```

9. 取得元素的属性
在FF中，自己定义的属性必须 getAttribute() 取得

10. 在FF中没有 parentElement，parement.children 而用 parentNode，parentNode.childNodes
问题：
childNodes 的下标的含义在IE和FF中不同，FF的 childNodes 中会插入空白文本节点
解决方法：
可以通过 node.getElementsByTagName() 来回避这个问题 
问题： 
当html中节点缺失时，IE和FF对 parentNode 的解释不同，例如：

```javascript
<form>
<table>
<input/>
</table>
</form> 
```

FF中 input.parentNode 的值为form，而IE中 input.parentNode 的值为空节点 
问题： 
FF中节点自己没有 removeNode 方法
解决方法：
必须使用如下方法 node.parentNode.removeChild(node)

11. const 问题
问题：
在IE中不能使用 const 关键字
解决方法：
以 var 代替

12. body 对象
FF的 body 在 body 标签没有被浏览器完全读入之前就存在，而IE则必须在 body 完全被读入之后才存在
这会产生在IE下，文档没有载入完时，在body上appendChild会出现空白页面的问题
解决方法：
一切在body上插入节点的动作，全部在onload后进行

13. url encoding
问题：
一般FF无法识别js中的&
解决方法：
在js中如果书写url就直接写&不要写&

14. nodeName 和 tagName 问题
问题：
在FF中，所有节点均有 nodeName 值，但 textNode 没有 tagName 值，在IE中，nodeName 的使用有问题
解决方法：
使用 tagName，但应检测其是否为空

15. 元素属性
IE下 input.type 属性为只读，但是FF下可以修改

16. document.getElementsByName() 和 document.all[name] 的问题
问题：
在IE中，getElementsByName()、document.all[name] 均不能用来取得 div 元素
是否还有其它不能取的元素还不知道（这个问题还有争议，还在研究中）

17. 调用子框架或者其它框架中的元素的问题
在IE中，可以用如下方法来取得子元素中的值
document.getElementById("frameName").(document.)elementName  
window.frames["frameName"].elementName 
在FF中则需要改成如下形式来执行，与IE兼容：
window.frames["frameName"].contentWindow.document.elementName  
window.frames["frameName"].document.elementName 

18. 对象宽高赋值问题
问题：
FireFox中类似 obj.style.height = imgObj.height 的语句无效
解决方法：
统一使用 obj.style.height = imgObj.height + "px";

19. innerText的问题
问题：
innerText 在IE中能正常工作，但是 innerText 在FireFox中却不行
解决方法：
在非IE浏览器中使用textContent代替innerText

20. event.srcElement和event.toElement问题
问题：
IE下，even对象有srcElement属性，但是没有target属性；Firefox下，even对象有target属性，但是没有 srcElement属性
解决方法：

```javascript
var source = e.target || e.srcElement;  
var target = e.relatedTarget || e.toElement; 
```

21. 禁止选取网页内容
问题：
FF需要用CSS禁止，IE用JS禁止
解决方法：

```javascript
IE: obj.onselectstart = function() {return false;}
FF: -moz-user-select:none;
```

22. 捕获事件
问题：
FF没有setCapture()、releaseCapture()方法
解决方法：

```javascript
IE:
    obj.setCapture();   
    obj.releaseCapture(); 
FF:
    window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
    window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
    if (!window.captureEvents){  
        o.setCapture();  
    }else{  
        window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
    }  
    if (!window.captureEvents){  
        o.releaseCapture();  
    }else   {  
        window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);  
    }  
```
本文主要介绍的是IE和FF两个浏览器中的兼容性问题。随着浏览器种类的增多，出现的兼容性问题肯定也越来越多。浏览器兼容性问题的“解决”需要浏览器开发商、W3C、开发者共同的努力才能实现。
 