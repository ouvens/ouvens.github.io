---
layout: post
title:  "polymer组件化与vm特性"
date:   2015-05-24
author: ouven
categories: frontend-javascript
tags:	polymer vm特性
cover:  "assets/category/type-javascript.png"
---

####  一、Polymer
Polymer是Google在2013年的Google I/O大会上提出了一个新的UI框架。Polymer的实现使用了WebComponent标准，并且Polymer可保证针对包含各种平台的Web Component规范本地实现的浏览器、库和组件的使用效果完全相同。

#### 1.1 Polymer框架：
Polymer框架可以分为三个层次：
- 基础层(platform.js)：是基本构建块。大多数情况下，基础层都是本地浏览器的API。
- 核心层(polymer.js)：实现基础层的辅助器。
- 元素层：建立在核心层之上的UI组件或非UI组件。

#### 1.2 基础层
基础层包括以下技术：
- DOM Mutation Oberservers和Object.observe()：用于观察DOM元素的变更，是纯JavaScript对象。
- 指针事件：处理鼠标和触摸操作，支持所有的平台。
- 阴影DOM：封装元素内的结构和样式，适合自定义元素。
- 自定义元素：可以自定义HTML5的元素。自定义元素的名字必须包含一个破折号，这是一种简单的命名空间标识，以区别于标准元素。
- HTML导入：包自定义元素。这些包可能包含HTML、CSS和JavaScript。
- 模型驱动的视图(MDV)：把数据直接绑定到HTML。
- Web动画：一套统一的Web动画API。
阴影DOM、自定义元素和HTML元素Web Components，是网络组件模型。Web Components是Polymer框架的最重要的基础。
platform.js目前浏览器还没有提供，它仅有31KB大小。

#### 1.3 核心层和元素层，即组件UI和组件逻辑
```html
    <polymer-panels on-select="panelSelectHandler" selected="{{selectedPanelIndex}}"> 
    </polymer-panels>
```
其架构是面向组件的，它由HTML5元素组成，元素甚至可以用户界面，比如动画是元素，它没有UI，而是代替点。同时响应式设计内建了许多Widget，这意味着它们能自适应多种给定的平台，如手机、平板、桌面等。
### 二、Polymer的一个例子


##### 1. 先看下面polymer的一个例子代码
```html
  <script  src="../components/platform/platform.js"></script>
    <!-- 下面用到的几个组件 -->
  <link rel="import" href="../components/core-header-panel/core-header-panel.html">
  <link rel="import" href="../components/core-toolbar/core-toolbar.html">
  <link rel="import" href="../components/paper-tabs/paper-tabs.html">
```
##### 2. Polymer 使用 HTML imports技术来加载组件。
HTML imports提供了依赖管理,确保自定义元素及其所有的依赖项都在使用之前被加载进来。
##### 3. 要增加一个工具条(toolbar), 可以在 body 标签内添加下面的代码:
```html
  <core-header-panel> 
        <core-toolbar> 
        <!-- 添加一些选项卡,以paper-开头的是Material design风格的标签,具有很炫酷的效果 --> 
        <paper-tabs valueattr="name" selected="all" self-end> 
            <paper-tab name="all">所有</paper-tab> 
                <paper-tab name="favorites">收藏</paper-tab> 
                </paper-tabs> 
            </core-toolbar> 
        <!-- 主要的页面内容将会放在这里 -->  
        </core-header-panel>  
  <core-header-panel>
```
元素是一个简单的容器,例如包含一个header和一些内容。默认情况下, header 保持在屏幕的顶部,但也可以设置为随内容滚动。core-toolbar元素作为容器,可以存放 选项卡(tab)的,菜单按钮以及其他控件。
给迪例子较为简单，目前由于以下兼容性Polymer用的还不是很多，但是通过Polymer组件化的思想，也可以给我们一些组件未来化的方向。

### 三、Polymer的vm特性


#### 3.1、数据的双向绑定
Polymer 支持双向的数据绑定。数据绑定通过扩展 HTML 和 DOM API 来支持应用的 UI (DOM) 及其底层数据 (数据模型) 之前的有效分离。更新数据模型会反映在 DOM 上，而 DOM 上的用户输入会立即赋值到数据模型上。
对于 Polymer elements 来说，数据模型始终就是 element 本身。比如想想这个简单的 element：

```html
<polymer-element name="name-tag">
  <template>
    这是一个 <b>{{owner}}</b> 的 name-tag element。
  </template>
  <script>
    Polymer('name-tag', {
      // initialize the element's model
      ready: function() {
        this.owner = 'Rafael';
      }
    });
  </script>
</polymer-element>
```
这里owner属性里的name-tag就相当于mvvm中vuejs的derectives，angular中的controller，如果你更新了owner属性

```javascript
  document.querySelector('name-tag').owner = 'shabi';
```
你就会看到： 这是一个 shabi 的 name-tag element。
#### 3.2 template惰性元素
这点实现原理就比较简单，使用了template包含一段html片段，那这段html片段开始是隐藏的，将会在渲染完成后再插入到页面中，个人分析，这样做的一个主要原因就是防止mvvm中html未初始化时的模板代码到正式生成html页面过程中闪的过程，使用angular或avalon的话一般会遇到这样的问题

```html
<polymer-element name="greeting-tag">
  <!-- 最外面的 template 定义了 element 的 shadow DOM -->
  <template>
    <ul>
      <template repeat="{{s in salutations}}">
        <li>{{s.what}}: <input type="text" value="{{s.who}}"></li>
      </template>
    </ul>
  </template>
  <script>
    Polymer('greeting-tag', {
      ready: function() {
        // 植入 element 的数据模型 (数组 salutations)
        this.salutations = [
          {what: 'Hello', who: 'World'},
          {what: 'GoodBye', who: 'DOM APIs'},
          {what: 'Hello', who: 'Declarative'},
          {what: 'GoodBye', who: 'Imperative'}
        ];
      }
    });
  </script>
</polymer-element>
```
例如这里template里面的内容开始是隐藏的，将会在mv扫面节点完成后插入到dom树里，避免页面闪的发生。其中模板里面的变量使用的类mustache语法，和Avalon极其类似。

#### 3.3 数据绑定与事件处理
这部分下次来讲，这次主要讲polymer，这部分也可以参考我之前qvm的看下mvvm中事件绑定和代理的实现。[qvm gitHub地址](https://github.com/ouvens/qvm)
### 四、前端组件化的发展方向
当然polymer只是前端组件化未来的一种方向，这种思想也即将带来一系列前端新的技术方向出现，例如可能
####1. Web Component规范化定义
基于标准化的组件定义方式，我们便可以像W3C等标准组织一样来定义组件标准，成为html规范的一部分，不用依赖其它组件，成为未来web开发基础规范来实现，支持vm监听功能等。例如polymer这种方案的发展就借鉴了webcomponent和mvvm的融合思想。

#### 2. react生态
react的组件化生态思想和webComponent也及其相似，当然react做了更多的事情，除了web Component，react想做的其实可以称为platform component。

#### 3. angular 2.0 和 EmberJS等现有成熟方案的改进
angular2.0已明确提出将支持Node绑定、模板集成、元素自定义和支持网络组件的无缝集成；ember的发展情况依然，今后也不排除jQuery等框架的进化重生，以全新的面目出现。

#### 4. 开发者的其它小众解决方案
在企业中，针对企业特殊性的业务，企业前端开发者也可以根据webComponent的思想自己实现更加灵活可用的组件拼装解决方案。相比之下，这个方向的探索研究甚至会更加受欢迎，因为只有开发者才关注关注自己的组件怎么管理。例如目前qiqi项目所用的方案就比较符合这个方向。