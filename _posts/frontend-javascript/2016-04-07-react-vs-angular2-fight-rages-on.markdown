---
layout: post
title:  "React vs Angular 2: 战争继续"
date: 2016-04-07
author: ouven
tags: React  Angular 2
categories: article-translation
cover: "assets/category/type-javascript.png"
---


## React vs Angular 2: 战争继续

【原译】：https://tech.evojam.com/2016/03/31/react-vs-angular2-the-fight-rages-on/

&emsp;&emsp;google的Angular和Facebook的React是现在最流行（但不是只有两个）的浏览器端应用开发工具，它们都是很优秀的解决方案。然而angular 2仍然在beta版中，Google的一部分工程师已经对它进行测试了。使用react开发的应用也很多，像instagram，netlfix，paypal等。

&emsp;残忍的战争就要到来了。

### 第一滴血

已经有一篇”血腥“的文章《[Angular 2 versus React](https://medium.freecodecamp.com/angular-2-versus-react-there-will-be-blood-66595faafd51#.c71slhy9c)》（作者：Cory House）来比较angular2与react，它体现了两者很多方面的亮点，第一次对决已经结束，但是大战才刚刚开始。（译者注：老外写个文章真的一定要这么夸张吗？哈哈~）

### 认清你的对手

>作为开发者，选择angular还是react就像购买现成的电脑还是用现成的零件来组装电脑一样。

Cory House告诉我们：

| angular 2| React |
|--------|------|
| 压缩后764K| 压缩后151k |
| 独立的完整解决方案 | 简单的视图库 |
| 很多angular特定的语法 | javascript语法 |
| 很好的一致性（和typescript） | 基本语法有点混淆 |
| 使用html和js | jsx语法 |
| 综合成熟稳定的框架 | 发展迅速的开源库 |
| 手动debug，缺少完全的支持 | jsx-很好的开发体验 |
| 对web components友好 | 有可能支持web componnets |
| 静态执行 | jsx-动态执行 |

我想补充的是react有很多优秀的浏览器开发插件，然而并没有看到angular 2的。

### 竞技场

&emsp;&emsp;为了比较这些前端的技术，我做了一些TODO应用。为了使问题更加简单，我在两个应用中只使用了Redux core（受[angular 2-introduction to Redux](https://medium.com/google-developer-experts/angular-2-introduction-to-redux-1cf18af27e6e#.ls2fsirdp)启发）。两个都是使用typescript开发的，所以比较起来比较清晰些。你可以对比下代码：

– Redux Core: https://github.com/evojam/redux-todo-lib
– Angular2 App: https://github.com/evojam/angular2-redux-sample-app
– React App: https://github.com/evojam/react-redux-sample-app

### 对抗

&emsp;&emsp;两者的核心都是一个component或是一个view单元。两个都将你的app形成一个组件树。它们都鼓励将数据通过顶层传递给组件树。根到叶子的数据流思路使我们开发的应用"更灵活"，所以现在开始。


### 第一轮：功能组件

&emsp;&emsp;在这个树形结构的基础应用中，每个顶层树是一个组件，每个组件的特点：

- 从父节点接受数据（称之为输入）
- 返回一个组件的子树（视图view）

&emsp;&emsp;在angular2和React中，输入都是通过子节点属性（不是html属性）从一个元素传递到它的子树，两种解决方案中，视图view都可以理解为xml树。

### TodoList组件

&emsp;&emsp;一个可复用、可选择、简单的todo list需要做到两点--todos数组（我做的数组）和过滤的方式（要展示的数组）。所以我们的组件输入可以是这样的：

```
interface ITodoListProps {
    todos: ITodo[];
    filter: FilterType;
}
```

&emsp;&emsp;而组件在任何地方都可以这样使用：

-- React

```
<TodoList todoList={todos} filter={filterType}/>
```

--Angular 2

```
<ul [todoList]="todos" [filter]="filterType"></ul>

```

下面是React组件的定义：

```
// src/components/todo-list.tsx

import { Todo } from './todo';

export function TodoList(props: ITodoListProps): JSX.Element {
    return (
        <ul className="todo-list">
            {todosFilter(props.todoList, props.filter)
                .map(todo => (
                    <Todo todo={todo} key={todo.id}/>
                ))}
        </ul>
    );
}
```

下面是Angulart2组件定义的版本：

```
// src/components/todo-list.ts

import { Todo } from './todo';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [Todo],
    host: {'class':'todo-list'},
    pipes: [TodosFilter],
    selector: '[todoList]',
    templateUrl: '/src/components/todo-list.html'
})
export class TodoList implements ITodoListProps {
    @Input() todoList: ITodo[];
    @Input() filter: FilterType;
}
```

```
// src/components/todo-list.html

<template ngFor #todo [ngForOf]="todoList | todosFilter:filter">
    <li [todo]="todo"></li>
</template>
```

&emsp;&emsp;毫无疑问，React版本是没有状态，更纯正，更简单，它使用data并返回dom，很好。

&emsp;&emsp;这里可以运行但是不能正确编译，我不知道它是不是typescript支持性的原因或者React编码输入的错误（如果知道错误请给issue）。无论怎样，它失败了，我不得不在React组件基础上切换成一个class。React保存了状态--就是组件成员的属性--但是属性仍然可以被当做immutable的数据输入：

```
// src/components/todo-list.tsx

import { Todo } from './todo';

export class TodoList extends Component<ITodoListProps, {}> {
    render(): JSX.Element {
        return (
            <ul className="todo-list">
                {todosFilter(this.props.todoList, this.props.filter)
                    .map(todo => <Todo todo={todo} key={todo.id} />)}
            </ul>
        );
    }
}
```

&emsp;&emsp;angular2 版本需要多得多的配置，对于这个简单的应用要干的事情太多了。这是因为angular没有将js和html混合在一起（directives，host，pipes，selector，templateUrl）和更多复杂的数据修改检测机制（数据监听）。

- selector是一种将组件js定义和模板元素绑定起来的方法--而在React它不需要因为js组件就是jsx组件元素。
- pipes和directives用于通知组件哪些其它的组件、directives和pipes（内置html filter）将要在模板中使用，而React中的js组件是直接在jsx模板中使用的。React不提供任何无模板的directive（对我来说这是个问题，我后面会提到）或者内联的pipes（因为我们可以使用纯js功能）。
- templateUrl是大家都明白的，对吧？它被因为是线下引用的，但是我确实觉得从组件文件中分离出更大的模板是比较合理的做法。缺少实时编译的模板检查确实是angular的劣势。
- 而host的出现是因为模板渲染中过程不大一样

&emsp;&emsp;React的组件功能（或是渲染方法）返回整个顶层模板包含的组件树。

```
return (
    <ul className="todo-list">
        { todoList.map( todo => <Todo todo={todo}/> ) }
    </ul>
);
```

&emsp;&emsp;在angular中，组件是与组件的根元素绑定的（通过上面提到的选择器selector），这个组件的根元素就被称为host，所以在angular模板中，我们只放入根元素的内容：

```
// src/components/todo-list.html

<li [todo]="todo" *ngFor="#todo of todoList"></li>
```

&emsp;&emsp;如果我们想添加一下东西（例如css的class，属性值）给host元素，我们称之为host定义，例如 `{'class':'todo-list'}` 会添加 `todo-list`类到`<ul [todoList]=… ></ul>`元素中。我们也可以通过typescript的装饰器功能绑定动态值和监听器给host元素。

### Todo 组件

&emsp;&emsp;所以我们现在开始绑定一些事件处理器。angular todo组件就像这样：

```
// src/components/todo.ts

interface ITodoProps {
    todo: ITodo;
}

@Component({
    host: {'class': 'todo'},
    selector: '[todo]',
    templateUrl: '/src/components/todo.html'
})
export class Todo implements ITodoProps {
    constructor(private todoActions: TodoActions) {}

    @Input() todo: ITodo;

    @HostBinding('class.done')
    private get isCompleted() {
        return this.todo.completed;
    }
}
```

```
// src/components/todo.html

<button (click)="todoActions.toggleTodo(todo.id)" class="toggle">
    {{ todo.text }}
</button>
<button (click)="todoActions.removeTodo(todo.id)" class="remove ion">
    Remove
</button>
```

&emsp;&emsp;我们把`ITodo`实例当做一个输入值。输出为带有两个按钮的host元素。我们也绑定了静态`todo`和条件的`"done"`css类到host元素中。按钮点击触发组件的`todoActions`成员相应的方法。没什么亮点，只有`(click)=...`或许会引起我们的注意。我们也可以”加点糖“并使用`<button on-click=… >`来代替`bind-anything=…`或`[anything]=…`。

&emsp;&emsp;而React版本：

```
interface ITodoProps {
    todo: ITodo;
    key: string;
}

export class Todo extends Component<ITodoProps, {}> {
    private getToggleAction(todo: ITodo) {
        return () => {
            todoActions.toggleTodo(todo.id);
        }
    }

    private removeTodo(todo: ITodo) {
        todoActions.removeTodo(this.props.todo.id);
    }

    public render(): JSX.Element {
        return (
        <li className={'todo' + (this.props.todo.completed ? ' done' : '')}>
            <button 
                onClick={this.getToggleAction(this.props.todo)} 
                className="toggle">
                {this.props.todo.text}
            </button>
            <button 
                onClick={this.removeTodo.bind(this)} 
                className="remove ion">
                Remove
            </button>
        </li>
        );
    }
}
```

&emsp;&emsp;我们把`ITodo`实例当做一个输入值。输出为带有两个按钮的一个元素。XML树返回的根元素也绑定了静态`todo`和条件的`"done"`css类。目前为止都基本相似。但是我们看到这里两个React令人失望的特点：

- 在`onClick`处理中this的上下文丢失了--我们必须做下修改（绑定或添加）
- class属性必须和整个元素一起保存--没有css类管理机制

&emsp;&emsp;我也不喜欢`className`和`htmlFor`属性，但是他们必须要使用，因为class和For都是js的保留字，就像我们必须将html和js混合在一起一样。


### 组合：React

**Todo**

```
<li className={…}>
    <button onClick={…} className="toggle">{…}</button>
    <button onClick={…} className="remove ion">Remove</button>
</li>
```

**TodoList**

```
<ul className="todo-list">
    { todoList.map( todo => <Todo todo={todo}/> ) }
</ul>
```
 
对于对象更深的结构：

```
<TodoList todoList={this.props.todoList.todos} filter={this.props.filter}/>
```
 
 输出为：

```
<ul class="todo-list" data-reactid=".0.1.1…">
    <li class="todo" data-reactid=".0.1.1…">
        <button class="toggle" data-reactid=".0.1.1…">
            Toggle
        </button>
        <button class="remove ion" data-reactid=".0.1.1…">
            Remove
        </button>
    </li>
    …
</ul>
```

### 组合：Angular2

**Todo**

```
@Component({ host: {'class': 'todo'}, selector: '[todo]', … })
export class Todo … {
    …
    @HostBinding('class.done')
    private get isCompleted() { … }
}
```

```
<button (click)="…" class="toggle">{{ … }}</button>
<button (click)="…" class="remove ion"></button>
```

**TodoList**

```
@Component({ host: {'class':'todo-list'}, selector: '[todoList]', … })
export class TodoList … { … }
```

```
<template ngFor #todo [ngForOf]="todoList | todosFilter:filter">
    <li [todo]="todo"></li>
</template>
```

对于对象更深的结构：

```
<ul [todoList]="todoList.todos" [filter]="filter"></ul>
```

输出为：

```
<ul class="todo-list"><!--template bindings={}-->
    <li class="todo">
        <button class="toggle">asd fasd f</button>
        <button class="remove ion">Remove</button>
    </li>
    …
</ul>
```

### 第一轮结果

&emsp;&emsp;React在开发轻量级单一组件场景下具有绝对优势。如果你的应用可以用数据视图简单描述清楚的话React似乎是最佳的解决方案。而且无疑是我们见过的最灵活的视图渲染框架。但是事件处理逻辑越多，UI渲染越复杂，angular2就越具有优势。事实上，angular2的组件配置和绑定声明复杂度和组件的复杂性成反比。此外，它还有灵活的使用方式（从数据到视图的绑定）。可能某一天Reactangular或者Angulareact框架能让我们高效的在一个应用中使用两种实现方式。但现在我们必须要选择。

&emsp;&emsp;灵活与否，都应该以减轻开发者的痛苦来作为考量。代码的可读性也是一方面，但目前html在这里是很重要的判断。

### 第二轮：视图美学

&emsp;&emsp;让我们来准备一个新的组件来处理更复杂的结构--列表结构。

**angular2**

```
<li *ngFor="#todoList of lists trackBy _byId"
    [class.active]="isCurrent(todoList)"
    class="todo-lists-list-item">
    <header [todo-list-header]="todoList"></header>
    <ul *ngIf="!isCurrent(todoList)" class="todo-list">
        <li *ngFor="#todo of todoList.todos"
            class="todo-preview"
            [class.done]="todo.completed">
            {{ todo.text }}
        </li>
    </ul>
    <editable-list *ngIf="isCurrent(todoList)" [todoList]="todoList">
    </editable-list>
</li>
```

**React**

```
<ul className="todo-lists-list">
    {this.props.lists.map(list => (
    <li key={list.id}
        className={this.listClassName(list)}>
        <TodoListHeader todoList={list}/>
        {list.id !== this.props.currentId ? (
        <ul className="todo-list">
            {list.todos.map(todo => (
                <li key={todo.id}
                    className={this.todoClassName(todo)}>
                    {todo.text}
                </li>
            ))}
        </ul>
        ) : (
        <EditableList todoList={list} filter={this.props.filter}/>
        )}
    </li>
    ))}
</ul>
```

### 第二轮结果

&emsp;&emsp;有什么好说的吗？选择你喜欢的就好了~

&emsp;&emsp;ok，我认为`<li *ngFor="#item in list trackBy fn">…<li><li *ngFor="#item in list trackBy fn">…<li>`相比`{list.map((item, index) => (<li key={index}>…</li>))}`更具有可读性，在某些地方，将js和xml混合起来就比较混乱。当然，只是个人观点。


### 第三轮：数据修改监听

&emsp;&emsp;我们在此声明一件重要的事情--Dom修改（在修改被检测到以后）在两种框架中处理方式是类似的。它们只修改确实需要改变的部分。我们来看下如果发生数据变化，处理的方式有什么不同；

**React**

&emsp;&emsp;React的基本处理方式很简单。如果组件的`state`或者`props`发生改变，就会调用修改处理函数：

- `state`在`setState()`被调用时触发
- `props`在父组件重新渲染时发生变化

&emsp;&emsp;当然也可以通过调用`forceUpdate()`来触发改变，修改监听器只在子树发生改变的地方触发。简单便捷，唯一不好的地方是我们必须在顶层元素里手动调用`setState()`方法。

&emsp;&emsp;你可能会注意到例子里面的`key={todo.id}`，这里是来列表元素检测改变的机制必须的，如果一个`key`上面的值修改了--html相对应的元素就会重新渲染。有点啰嗦，但是有必要。另外在项目中使用严格模式编程是，你必须在你的列表组件中额外定义一个`key:string`。

**Angular**

&emsp;&emsp;angular 团队决定使用稍微不同的方式。他们包含了`zone.js`到浏览器异步回调中（例如：setTimeout，setInterval，事件处理和xhr请求事件）。当他们当中任意一个被调用，就会运行修改检测。你可参考下[great in-depth explanation](http://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html)，更有趣的是，你可以在你任意一个组件树上选择使用的检测策略。

&emsp;&emsp;在样例中，我使用了`onPush`策略，所以所有的组件修改检测只在他们`@input()`属性发生变化时才会触发。所以angular里的修改检测可以在任何合适的时候触发，而react只在一个时候触发。当然angular还有更多的触发策略：`CheckOnce, Checked, CheckAlways, Detached, OnPush, Default`。跟多信息可以参考：[ChangeDetectionStrategy docs](https://angular.io/docs/ts/latest/api/core/ChangeDetectionStrategy-enum.html)。

&emsp;&emsp;就像React的`key={…}`一样，angular有自己的方式来处理列表的变化--`NgFor.ngForTrackBy`。在代码里就是`<li *ngFor="#todoList of lists trackBy _byId" …>…</li>`。这里传递的`_byId`是`list => list.id`的一个函数。所以很像React--我们必须给列表里的每个元素创建唯一的标识来辨别当修改触发是是不是发生在同一个元素上面。可能稍微比React优雅一点，但是你必须学习更多框架里面特定的语法。

### 第三轮结论

&emsp;&emsp;两种解决方案都提供了一个相对健全的途径，然而React的默认修改检测无疑更优一些。另一方面，angular这种在底层的检测相当于一个浏览器开发玩家使用的因为它把检测插入到浏览器一些异步调用层，所以广播检测的职责对开发者来说不可控。当然每种方案都有他们不尽人意的地方。React的组件检测如果数据不是来自属性的话必须通过手动调用触发，如果使用了其它存储方式会直接触发（Flux 框架）。如果你想让angular变得灵活些，你必须在每个单一的组件定义他们的数据检测触发策略。

&emsp;&emsp;不过两种方式都很好。angular使用简洁的配置工具实现了更多的扩展性，这点React就没做到。


### 第四轮：扩展html

&emsp;&emsp;做什么？就是像html添加一些功能，让它在更多的元素中被复用。

***Angular***

```
@Directive({selector: '[inp-alerter]'})
export class InpAlerter {

    @Input('inp-alerter') inpAlerter: string; 

    @HostBinding() placeholder = 'Write something here';

    @HostListener('keyup.enter', ['$event.target.value'])
    onInput(val: string): void { … }

}
```

&emsp;&emsp;上面的例子展示了我们怎样从一个输入属性中获取值、绑定一些其他值给元素属性或给元素添加监听事件。而且它可以用`inp-alerter`属性应用到其它任意一个html元素中。而且这只是我们能做的很小的一部分，实际上`@Directive`定义的类可以作为绝大多数功能用于`@components`，但是没有模板。简单强大。


**React**

&emsp;&emsp;有一种可能是使用React mixins的方式来实现相同的功能，但是有点过度设计的倾向而且容易出错。无论怎样，开发者必须为应用中使用的每个元素功能创建一个组件。

### K.O.

&emsp;&emsp;最后一轮决出了胜负，React被战胜了。

&emsp;&emsp;感谢上帝，这只是个比喻。

&emsp;&emsp;总之，这是一个angular 1.x统治的世界，而且也正准备走向html扩展元素web components的世界。angular 2赢的了这一轮。但是我确定React不会就此放弃。



### 落幕

&emsp;&emsp;显然，React和Angular 2有很多共同点，他们在处理应用框架和数据上使用了相似的原理。另一方面，每个功能的实现都使用了不同的方式（好吧，组件调用的生命周期还是完全一致的）。这些不同点并不意味着应用开发时的难度，每种方案都提供了足够完善的工具来开发一个大型、严谨、灵活的应用核心。

&emsp;&emsp;当然React更小并且只涵盖view/component的操作--这是我这里要对比的。缺少向html的扩展机制无疑是React唯一不足的地方。
 
&emsp;&emsp;Angular2则更加稳定、可扩展和更加完善。但是它仍然在beta阶段--并且相对对手具有优势因为无论相比angular1还是React的经历来看它具有更加优秀的合并思想。

译者：ouven
原文作者：JAKUB STROJEWSKI

参考文章：


[Comparison of Angular 2 and React](http://www.ociweb.com/resources/publications/sett/comparison-of-angular-2-and-react/)
[State Management in Angular 2 and React](https://www.linkedin.com/pulse/state-management-angular-2-react-michel-herszak)
[Choosing between React vs. Angular 2](http://react-etc.net/entry/choosing-between-react-vs-angular-2)
