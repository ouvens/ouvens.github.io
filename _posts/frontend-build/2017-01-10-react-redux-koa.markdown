---
layout: post
title:  "react+redux+koa技术栈实现小结"
date:   2017-01-10
author: ouven
tags:   react redux fis3 koa
categories: frontend-build
cover:  "assets/category/type-javascript.png"
---

&emsp;&emsp;虽然别人整理的入门知识资料已经挺多的了，但不一定适合自己，还是重新整理下，理一理React的开发生态。

#### 一、React 安装使用

&emsp;&emsp;使用react，只需要引入react.min.js（React 的核心库）和react-dom.min.js（提供与 DOM 相关的功能）即可。

```html
<script src="../js/lib/react.min.js"></script>
<script src="../js/lib/react-dom.min.js"></script>

<div id="example"></div>
<script type="text/babel">
  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('example')
  );
  // 这段代码将一个h1标题，插入id="example"节点中
</script>
```

> 通常为了使用JSX语法，我们需要在文件打包时使用插件将含有JSX语法的文件解析成普通的JavaScript语法，例如fis3-parser-react；如果使用到了ES6的写法，也需要将其转为ES5的格式，例如使用fis3-parser-babel。（现在前端已经不用ES6了，babel太慢影响效率，ES6在Node上使用）

#### 二、React JSX

&emsp;&emsp;React使用JSX来替代常规的 JavaScript，以为JSX执行时进行了优化，含有错误检测而且方便我们书写模板。

```javascript
var arr = [
    <h1>W3Cschool教程</h1>,
    <h2>从W3Cschool开始！</h2>,
];
var mystyle = {
    fontSize: 100,
    color: '#FF0000'
};
ReactDOM.render(
  <div style={myStyle}>{arr}</div>,
  document.getElementById('example')
);
```

> JSX语法代码实际上是JavaScript代码，所以html中的部分标签属性在JSX中不能直接使用，例如html class属性在JSX中需要使用className表示，for属性需要使用htmlFor代替，style属性标签中内容需要写成JSON格式。同时，JSX使用单个{}来包含变量模板，一次返回的JSX render内容必须放在单独一个标签内，返回统计的多个标签是不允许的，例如下面这样是不对的:

```javascript
// 不正确
render: function(){
    return (<div>{this.props.name}</div>
        <div>{this.props.site}</div>
    );
}
```

#### 三、React组件

&emsp;&emsp;实现了输出网站名字和网址的组件，另外if和for循环的输出大家也可以注意下:

```javascript
var Name = require('Name');
var Link = require('LINK');
var list = ['list-item-1', 'list-item-2', 'list-item-3'];

var WebSite = React.createClass({
  getDefaultProps: function() {
    return {
      name: '极限前端',
      site: "http://www.jixianqianduan.com"
    };
  },
  render: function() {
    var hasList = list.length > 0;
    if(hasList){
        return (
          <div>
            <Name name={this.props.name} />
            <Link site={this.props.site} />
            <ul>
            {
                this.props.list.map(function(item, index){
                    return <li key={index}>item</li>;
                });
            }
            </ul>
          </div>
        )
    }else{
        return <div>没有数据</div>;
    }
  }
});

React.render(
  <WebSite name="极限前端" site="http://www.jixianqianduan.com" />,
  document.getElementById('example')
);

// 文件Name.js
var Name = React.createClass({
  render: function() {
    return (
      <h1>{this.props.name}</h1>
    );
  }
});

module.exports = Name;

// 文件Link.js
var Link = React.createClass({
  render: function() {
    return (
      <a href={this.props.site}>
        {this.props.site}
      </a>
    );
  }
});

module.exports = Link;
```

> 最新版的React组件名称只允许使用大些字母开头的变量命名，例如x-button、my-button等命名方式都是不正确的。另外注意上面if模板和for循环输出模板的用法，循环输出时React要求列表项便签需要加上key的属性。

#### 四、React状态state和属性props

&emsp;&emsp;下面展示的一个典型实例中创建了 LikeButton 组件，getInitialState 方法用于定义初始状态，也就是一个对象，这个对象可以通过 this.state 属性读取。当用户点击组件，导致状态变化，this.setState 方法就修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件。

```javascript
var LikeButton = React.createClass({
  getInitialState: function() {
    return {liked: 0};
  },
  handleClick: function(event) {
    this.setState({liked: this.state.liked + 1});
  },
  render: function() {
    var text = this.state.liked ? this.state.liked : '不喜欢';
    return (
      <p onClick={this.handleClick}>
        你<b>{text}</b>我。点我切换状态。
      </p>
    );
  }
});

React.render(
  <LikeButton />,
  document.getElementById('example')
);
```

&emsp;&emsp;上面的例子也可以这样来做：

```javascript
var Name = require('Name');
var Link = require('LINK');
var list = ['list-item-1', 'list-item-2', 'list-item-3'];

var WebSite = React.createClass({
  getDefaultProps: function() {
    return {
      name: '极限前端',
      site: "http://www.jixianqianduan.com"
    };
  },
  
  // 属性类型检测
  propTypes: {
    name: React.PropTypes.string.isRequired,
    site: React.PropTypes.string.isRequired
  },
  
  getInitialState: function() {
    return {
      name: '极限前端',
      site: "http://www.jixianqianduan.com"
    };
  },
  
  render: function() {
    var hasList = list.length > 0;
    if(hasList){
        return (
          <div>
            <Name name={this.state.name} />
            <Link site={this.state.site} />
            <ul>
            {
                this.props.list.map(function(item, index){
                    return <li key={index}>item</li>;
                });
            }
            </ul>
          </div>
        )
    }else{
        return <div>没有数据</div>;
    }
  }
});

React.render(
  <WebSite name="极限前端" site="http://www.jixianqianduan.com" />,
  document.getElementById('example')
);
```

> state 和 props 主要的区别在于 props 是不可变的，而 state 可以根据与用户交互来改变。这就是为什么有些容器组件需要定义 state 来更新和修改数据。 而子组件只能通过 state 来传递数据。

&emsp;&emsp;组件的state和props常见有下面的管理方法：

```
设置状态：setState, 不能在组件内部通过this.state修改状态，因为该状态会在调用setState()后被替换，setState()并不会立即改变this.state，而是创建一个即将处理的state。setState()并不一定是同步的，为了提升性能React会批量执行state和DOM渲染。
setState()总是会触发一次组件重绘，除非在shouldComponentUpdate()中实现了一些条件渲染逻辑。

替换状态：replaceState，replaceState()方法与setState()类似，但是方法只会保留nextState中状态，原state不在nextState中的状态都会被删除。

设置属性setProps，props相当于组件的数据流，它总是会从父组件向下传递至所有的子组件中。当和一个外部的JavaScript应用集成时，我们可能会需要向组件传递数据或通知React.render()组件需要重新渲染，可以使用setProps()。

替换属性replaceProps，replaceProps()方法与setProps类似，但它会删除原有

强制更新：forceUpdate，forceUpdate()方法会使组件调用自身的render()方法重新渲染组件，组件的子组件也会调用自己的render()。但是，组件重新渲染时，依然会读取this.props和this.state，如果状态没有改变，那么React只会更新DOM。

获取DOM节点：findDOMNode，如果组件已经挂载到DOM中，该方法返回对应的本地浏览器 DOM 元素。

判断组件挂载状态：isMounted，isMounted()方法用于判断组件是否已挂载到DOM中。可以使用该方法保证了setState()和forceUpdate()在异步场景下的调用不会出错。
```

#### 五、组件生命周期

- 初始化阶段：

&emsp;&emsp;getDefaultProps:获取实例的默认属性(即使没有生成实例，组件的第一个实例被初始化CreateClass的时候调用，只调用一次,)
&emsp;&emsp;getInitialState:获取每个实例的初始化状态（每个实例自己维护）
&emsp;&emsp;componentWillMount：组件即将被装载、渲染到页面上（render之前最好一次修改状态的机会）
&emsp;&emsp;render:组件在这里生成虚拟的DOM节点（只能访问this.props和this.state；只有一个顶层组件，也就是说render返回值值职能是一个组件；不允许修改状态和DOM输出）
&emsp;&emsp;componentDidMount:组件真正在被装载之后，可以修改DOM

- 运行中状态： 

&emsp;&emsp;componentWillReceiveProps:组件将要接收到属性的时候调用（赶在父组件修改真正发生之前,可以修改属性和状态）
&emsp;&emsp;shouldComponentUpdate:组件接受到新属性或者新状态的时候（可以返回false，接收数据后不更新，阻止render调用，后面的函数不会被继续执行了）
&emsp;&emsp;componentWillUpdate:不能修改属性和状态
&emsp;&emsp;render:只能访问this.props和this.state；只有一个顶层组件，也就是说render返回值只能是一个组件；不允许修改状态和DOM输出
&emsp;&emsp;componentDidUpdate:可以修改DOM

- 销毁阶段：
&emsp;&emsp;componentWillUnmount:开发者需要来销毁（组件真正删除之前调用，比如计时器和事件监听器）

![](http://7tszky.com1.z0.glb.clouddn.com/FhABffZwXfgMzo3nUNi2M6dgYxlD)

> React的网络请求通常是将请求的url放在组件props中传入，然后在componentDidMount时发送ajax请求。

```javascript
var UserGist = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      lastGistUrl: ''
    };
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      var lastGist = result[0];
      this.setState({
        username: lastGist.owner.login,
        lastGistUrl: lastGist.html_url
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return (
      <div>
        {this.state.username} 用户最新的 Gist 共享地址：
        <a href={this.state.lastGistUrl}>{this.state.lastGistUrl}</a>
      </div>
    );
  }
});

ReactDOM.render(
  <UserGist source="https://api.github.com/users/ouven/gists" />,
  mountNode
);
```

#### 六、refs

&emsp;&emsp;如果绑定一个 ref 属性到render内容的返回值上，组件或其它组件就可以这样来引用这个内容关联的DOM元素。

```javascript
<input ref="myInput" />

var input = this.refs.myInput;
var inputValue = input.value;
var inputRect = input.getBoundingClientRect();
```

> 我们也可以使用getDOMNode()方法获取当前真实DOM元素，但是findDOMNode()不能用在无状态组件上。此外也可以使用bind的方法来实现当前事件的处理。

```javascript
componentDidMound() {
  const el = findDOMNode(this);
}
// do something ...
onClick = {this.handleClick.bind(this, value1, value2)}

// do something 
handleClick(value1, value2, ..., event) {
    // 事件处理函数
}
```

#### 七、服务端渲染(SSR)

&emsp;&emsp;React服务端渲染需要用到react-dom/server模块，以koa(koa使用教程省略)为例，我们渲染一个服务端返回的页面就可以这样写：

```javascript
/**
 * react前后端同构页面
 * @param {[type]} req           [description]
 * @param {[type]} res           [description]
 * @yield {[type]} [description]
 */
const reactController = function*(req, res) {

    let ctx = this;
    let helloProps = {
        type: 'hello',
        data: {
            name: 'hello-name-init',
            address: 'hello-address-init',
            age: '26',
            job: 'hello-job-init'
        }
    };

    let contentProps = {
        type: 'content',
        data: {
            name: 'content-name-init',
            address: 'content-address-init',
            age: '26',
            job: 'content-job-init'
        }
    }

    let reactHello = reactComponent.renderPath(ctx, 'react/react-hello/main.jsx', helloProps);
    let reactContent = reactComponent.renderPath(ctx, 'react/react-content/main.jsx', contentProps);

    ctx.body = yield render(ctx, 'pages/react', {
        reactHello,
        reactContent,
        storeData: {
            helloProps,
            contentProps
        }
    });
};
```

&emsp;&emsp;这里用到了一个统一react的render处理模块:

```javascript

'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');

/**
 * 根据开发或正式环境读取不同目录先的jsx组件
 * @param  {[type]} ctx        [当前运行环境，用于判断使用开发环境路径还是线上环境路径]
 * @param  {[type]} componentPath [接受组件路径名]
 * @param  {[type]} props      [组件接受的数据]
 * @return {[type]}            [description]
 */
const renderPath = function(ctx, componentPath, props) {
    let componentFactory,
        jsxPath;
    // 如果是本地则使用dev环境目录，否则使用page的构建目录
    if (ctx.hostname === '127.0.0.1' || ctx.hostname === 'localhost') {
        jsxPath = '../dev/component/';
    } else {
        jsxPath = '../pages/component/';
    }
    componentFactory = React.createFactory(require(jsxPath + componentPath));

    /**
     * renderToStaticMarkup不会避免前端重渲染
     * renderToString会避免前端重渲染
     */
    return ReactDOMServer.renderToString(componentFactory(props));
};

module.exports = {
    renderPath: renderPath
}
```

> 这里这样做还不够，我们还需要将renderToString的字符串内容填充到真正的页面模板中，这里以swig模板为例，同时后端渲染的初始数据状态也要通过storeData变量带到前端页面上，保证初始的页面组件状态和后端直出是一样的。


```html
<div id="testHello">
    <div>{{ reactHello | safe }}</div>
</div>
<div id="test">
    <div>{{ reactContent | safe }}</div>
</div>
<script>
var storeData = {{ storeData | json| raw }};
</script>
```

#### 八、Redux与组件通信

&emsp;&emsp;React组件间的通信分为几种，父组件向子组件通信、子组件向父组件通信、同级组件间通信。第一种通常是将父组件的state传给子组件props来实现，父组件state变化，子组件的状态就直接变化；子组件向父组件通信是将父组件的方法通过props传入的子组件中，然后再子组件中调用来通知父组件；同级组件通信则是创建一个共同父组件，先发起子组件向父组件通信，然后再让父组件向另一子组件发起通信。
&emsp;&emsp;另一种通用的机制就是Redux，Redux可以创建一个全局的store，统一保存管理不同组件的状态，然后通过subscribe订阅事件，当dispatch调用时可以修改组件状态触发订阅事件重新渲染视图。

```javascript
var reactContent = require('react-content');
var reactHello = require('react-hello');
var store = Redux.createStore(reducer);

function reducer(state={}, action) {
    if(action.type){
        state[action.type] = action.data;
    }
    return state;
};

// do somthing...
for(var key in storeData){
    store.dispatch(storeData[key]);
}
// do somthing...
reactContent.init(store);
reactHello.init(store);
```

&emsp;&emsp;此时如果react-content组件重要控制react-hello组件状态的变化，reactHello中就可以这样监听

```javascript
componentDidMount: function() {

    var store = this.props.store;
    function handleChange() {
        self.setState({ data: store.getState()['hello'] });
    }

    // 订阅store变化，如果有dispatch，handleChange里面的状态设置就会执行
    let unsubscribe = store.subscribe(handleChange);
    // unsubscribe(); 取消订阅
}
```

&emsp;&emsp;reactContent中控制reactHello变化的动作中则需要这样写。

```javascript
// 触发reactHello组件变化
_triggerHello: function(){

    // 修改hello组件的store
    var hello = this.props.store.getState()['hello'];
    hello.name = 'ouvenzhang';

    // dispatch后会触发reactHello中的handleChange
    this.props.store.dispatch({
        type: 'hello',
        data: hello
    });
}
```

> 其实我们可以在SSR时也使用Redux管理，可以增强组件的一部分复用性，但目前还没有用到，其实redux是用来管理组件状态变化的，更推荐在前端使用，服务端使用感觉有点不大必要，服务端只用来做首次内容的渲染。

#### 九、事件

&emsp;&emsp;React自定义了一些事件，可以方便我们的开发使用。

stopPropagation() 和 preventDefault()，React标准化了事件对象，因此在不同的浏览器中都会有相同的属性。事件处理器也可以在事件冒泡阶段触发。要在捕获阶段触发某个事件处理器，在事件名字后面追加Capture字符串；例如，使用onClickCapture而不是onClick来在捕获阶段处理点击事件

- 系统事件

onCopy onCut onPaste

- 键盘事件

onKeyDown onKeyPress onKeyUp

- 表单事件

onFocus onBlur onChange onInput onSubmit

- 鼠标事件

onClick onDoubleClick onDrag onDragEnd onDragEnter onDragExitonDragLeave
onDragOver onDragStart onDrop onMouseDown onMouseEnteronMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp

- 触摸事件

onTouchCancel onTouchEnd onTouchMove onTouchStart

- 窗口和滚轮事件

onScroll onWheel

#### 十、小结
&emsp;&emsp;总得来说react生态的还是很健全的，解决的了实际开发中组件和组件状态管理的问题，前后端同构的模式也解决了React库本身较大前端加载缓慢的弊端，但是如果实际项目中没有Node服务层，个人建议还是不要直接使用React，React库文件比较大，还需要其它的依赖，会大大延后页面渲染时机，这是例如使用Vue会显得更轻量级。

工程化项目代码样例：https://github.com/ouvens/fis3-koa-node （内含react的页面，可直接用来开发大型项目）