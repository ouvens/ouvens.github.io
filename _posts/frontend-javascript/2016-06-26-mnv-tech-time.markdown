---
layout: post
title:  "mnv*框架时代"
date:   2016-06-25
author: ouven
tags:   mnv*框架时代 mnv mnv*
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---

&emsp;&emsp;当下前端开发框架设计显然已经在mvvm方式上又发展了一步，`virtual dom` 提出不久，使用前端代码来调用native的思路就开始被实践。相信大家也知道是什么东西。到了今天，我们不得不承认，`mnv*` 框架开发时代已经到来。

&emsp;&emsp;mnv*是什么，具体可以这么理解，`model-Native-View-*`，而后面的*则可以认为是 `virtual dom` 或 `mvvm` 中的 `ViewModel`，或者我们也可以自己使用controller来实现的调用方式。想想这样定义是非常合适的。相比之前的不同，就是用 `nativeView`代替了 `htmlView`。那么我们再看看下从`dom api` 到 `mnv*`，我们为什么会看到这样的变化。 

#### 一、dom交互

&emsp;&emsp;在此之前不得不提下之前的dom交互框架，就是直接选择找到特定的dom进行操作，思路十分直接也很实用，通过dom交互框架，相比JavaScript原生API，我们可以比较高效的处理dom的改变和事件绑定了，这种高效的方式给我们到来了效率上的提高，但是页面复杂了就不好处理了。

&emsp;&emsp;随着ajax技术的盛行，SPA应用开始被广泛运用。SPA的引入将整个应用的内容都在一个页面中进行异步交互。这样，原有的dom交互方式开发就显得不好管理，例如某SPA页面上交互和异步加载的内容很多，我们的做法是每一次请求渲染后做事件绑定，异步请求后再做另一部分事件绑定，后面以此类推。当所有异步页面全部调用完成，页面上的绑定将变得十分混乱，各种元素绑定，渲染后的视图内容逻辑不清，又不得不声明各种变量保存每次异步加载时返回的数据，因为页面交互需要对这些数据做操作，最后写完，项目代码就成了一锅粥。

#### 一、前端mvc

&emsp;&emsp;为了更方便的统一管理页面上的事件、数据和视图内容，就有了早期mvc的框架设计。mvc可以认为是一种设计模式，其基本思路是将dom交互的过程分为调用事件、获取数据、管理视图。即将之前所有的事件、数据、视图分别统一管理。用model来存放数据请求和数据操作，视图来存放对视图的操作和改变，controller用来管理各种事件绑定。

&emsp;&emsp;例如，SPA中的每个异步页面可以看成是一个组件，之前的做法是每个组件独立完成自己的数据请求操作、渲染和数据绑定，但是组件多了，每个组件自己去做就比较混乱，逻辑比较混乱。到了mvc里面，所有的组件数据请求、渲染、数据绑定都到一个统一的model、view、controller注册管理。后面的操作我们就不在管你有多少个组件了，你要调用必须要通过统一的model、view、controller来调。通俗来说就像是组件交出了自己控制权到一个统一的地方注册调用，这样就方便了很多，相信大家都已经了解过，这里就省篇幅不举例了。

#### 二、 前端mvp

&emsp;&emsp;mvp可以跟mvp对照起来看，而且我们也很少专门去关注它。和mvc一样，mvc的M就是 Model, V就是View，而P，则代表Presenter，它与Controller有点相似。不同的是，在mvc中V会直接展现M，而在mvp中V会把所有的任务都委托给P。V和P会互相持有reference，因此可以互相调用。

例如我们可以在MVC代码上做一点改变，写成这样：


```
<div controller="Controller.vp" id="text">html</div>
```

```
var Controller = new Controller();
Controller['vp']= new VP({
    $el: $('text'),
    click: fn(e){
        console.log(self.$el.html());
    },
    mouseenter: function(e){
        console.debug(self.$el.html());
    },
    mouseleave: function(e){
        console.info(self.$el.html());
    }
});
```

&emsp;&emsp;几个好处，这样将view和Controller的引用关联了起来，而MVC一般是通过事件监听或观察者的异步方式来实现的，我们可以在任意地方定义注册监听事件都不会有问题，这样监听的事件和触发这个事件的html元素脱离了引用，当应用复杂起来后要维护dom的交互逻辑就比较麻烦了。而mvp提供了一个简单的引用，将元素对应的操作于对应的presenter关联起来。我们要查询元素对应的controller时只要通过Controller.vp就可以直接调用了，其实这个时候就和mvvm的定义方式有点类似了，不是吗？

#### 三、前端mvvm 

&emsp;&emsp;mvvm概念可以认为是一个自动化的presenter，也这个时候进一步弱化了C层，任何操作都通过viewModel来驱动。Controller最终在页面上的行为通过directives的形式体现，通过对directives的识别来注册事件，这样管理起来就更清晰了。看一个mvvm框架定义的例子。


```
<form action="" id="form">
    <label for="text" q-html="label"></label>
    <input type="text" q-value="value" q-model="value" q-mydo="number | getValue">
    <button q-on="click: submit"></button>
</form>
```

```
let viewModel = new VM({
    $el: '#form',
    data:{
        label: '用户名',
        value: '输入初始值',
        number: 0
    },
    method:{
        submit(){
            // doSubmit
        }
    },
    directive:{
        mydo(value){
            console.log(value);
        }
    },

    filter:{
        getValue(){
            reutrn value ++;
        }
    }
})
```

&emsp;&emsp;和MVP的定义比较，有点类似，mvvm设计一个很大的好处是将mvc中controller中的controller注册到相对应的元素中，让我们后期维护时很快定位，免去了查看controller中event列表的工作，而且初始化后自动做数据绑定，能将页面中所有同类操作复用，大大节省了我们自己写代码做绑定的时间。这段代码中初始化时自动帮我们就做了数值填充、数据双向绑定、事件绑定的事情。那么框架怎样帮我做的呢。我们来看下new VM做了哪些事情：这里传入了元素、数据、方法列表、自定义directive列表，首先程序找到这个元素，开始对这个元素的属性节点进行遍历，一旦遍历到属性名称含有q-开头的属性是，认为是mvvm框架自定义的属性，然后会对属性的指进行特殊处理；例如遍历到`q-html="label"`时，将data中的label值赋给这个元素的innerHTML；如果遍历到`q-on="click: submit"`时，将这这个元素上绑定click事件，事件回调函数为submit；也可以自定义`q-mydo`的指令，遍历到该节点属性是，调用directive中的mydo方法，输入参数为data中的getValue方法返回的值，getValue输入参数为number值，这里的getValue被称为过滤器。

&emsp;&emsp;这里要知道的是`q-`开头的属性指令是框架约定的，不同的框架约定的不一样，例如`ng-`、`v-`、`ms-`，这些大家也都见过或用过。这里viewModel创建进行绑定的原理就这么简单，按照这个思路去扩充，就可以自己写一个mvvm框架。当然完整的框架涉及东西多的多，含有丰富的directive、filter、表达式、vm完善的api和甚至一些兼容性处理等。

&emsp;&emsp;总结来说从mvc到mvp，然后到mvvm，前端设计模式仍然是向着易实现、易维护、易扩展的基本方向发展的。但目前前端各类框架也已经成熟并开始版本迭代。但是，这还没有结束，我们依然没有脱离dom编程的基本套路，一次次框架的改进只是提高了我们的开发效率，但是dom元素的效率仍没有得到本质的提升。

#### 四、前端virtual dom

&emsp;&emsp;为了改进dom交互的效率，或者说是尽量减少dom交互的次数，virtual dom的概念当下十分盛行，目前圈内各种大小团队纷纷投入项目使用。因为viewModel的改变最终还是要实时操作dom来刷新view层，而dom对象的操作相对于JavaScript对象的操作仍然是要慢些。原因很简单，dom节点对象的内置属性很多，就创建一个dom对象而言，dom的创建需要处理各种内置属性的初始化，而如果使用JavaScript对象来描述就简单了。

&emsp;&emsp;使用virtual dom，页面的渲染过程不再是数据直接通过前端模板渲染到页面，也不是初始化viewModel进行页面模板填充和事件绑定，而是通过dom衍生描述语法（这为什么称为DOM衍生描述语法，通常我们通过html来描述，但是目前一些框架是通过非标准的html的方式描述的，定义的一套迎合自己框架的方式，其实使用html也是可以的）解析生成virtual dom，页面交互变成了是修改virtual dom，然后将virtual dom的改变反映到htmlView层上。

&emsp;&emsp;例如以下结构:

```
<ul id="ui-list">
  <li class="ui-list=item">1</li>
  <li class="ui-list-item">2</li>
  <li class="ui-list-item">3</li>
</ul>
```

&emsp;&emsp;可以使用如下javascript来表示

```
var element = {
  tagName: 'ul',
  props: {
    id: 'ui-list'
  },
  children: [
    {tagName: 'li', props: {class: 'ui-list-item'}, children: ["1"]},
    {tagName: 'li', props: {class: 'ui-list-item'}, children: ["2"]},
    {tagName: 'li', props: {class: 'ui-list-item'}, children: ["3"]},
  ]
}

```

&emsp;&emsp;如果javascript对象children属性第三个元素要被移除，同时，添加一个class为ui-list-item2的li节点，则首先需要对javascript对象进行修改记录所有的操作，最后将修改的vitual dom变化反映到页面上：

```
<ul id="ui-list">
  <li class="ui-list=item">1</li>
  <li class="ui-list-item">2</li>
  <li class="ui-list-item2"></li>
</ul>
```

&emsp;&emsp;这里的javascript对象就相当于virtual dom，用户的某个交互操作可能导致dom的多个地方，如果没有vitual dom，那可能就要进行多次dom操作，virtual dom则可以将多个用户交互操作反映在virtual dom上，最后做的virtual dom DIFF算法然后再dispatch到页面view层上。相对于mvvm，在页面初始化渲染阶段，也避免了扫面节点，解析directives，要知道这些操作都是dom操作，使用virtual dom显然能将页面渲染速度提高不少。


#### 五、前端 mnv*

&emsp;&emsp;如果说vitual dom减少了dom的交互次数，那么mnv*想要做的一件事情就是完全抛弃使用dom，那样就只能在view层做改进了，使用nativeView来代替目前html的view，而交互逻辑依然可以使用viewModel、virtual Dom或者controller来实现，具体就看实现的方式了。

&emsp;&emsp;要做到NativeView的操作，这里与之前不同之处就是调用时通过衍生HTML语法通过解释器执行nativeView的渲染，这是就需要在native和衍生HTML语法之间添加一层解释器来解析现有的view描述语法了。比如我们看一个渲染Native的例子：


```
// iOS

import React, {
  Component,
} from 'react';
import {
  TabBarIOS, 
  NavigatorIOS 
} from 'react-native';

class App extends Component {
  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item title="React Native" selected={true}>
          <NavigatorIOS initialRoute={{ title: 'React Native' }} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}
```

&emsp;&emsp;这里和vitual dom框架类似的地方都是都使用衍生的html描述语法来表示view层，而不同的是mnv模式是调用的nativeView来实现的衍生html的view展示。其实这里和上节中的实现唯一不同的地方是这里的view是native view。当然这只是一种实现，目前mnv的实现方案已经不止一种了，有人已经实践了通过mvvm的编程方式来将viewModel渲染转化为native view的方案。

####  六、总结

&emsp;&emsp;总结下来，前端框架一次次进化，先从效率的方向上提升，然后再性能上完善，这里只是想提出mnv*的一个概念来描述前端native开发的这个阶段。目前mnv的开发模式开始进入视线，也在快速地形成和建立生态。但尽管如此，我们如果需要选择的技术栈方案，当然还是以最适合我们的作为最高原则。切忌过度设计。