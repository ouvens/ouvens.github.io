---
layout: post
title:  "【原译】使用MobX怎样管理JavaScript应用状态"
date:   2016-10-12
author: ouven
tags:   react mobx
categories: article-translation
cover:  "assets/category/type-javascript.png"
---

&emsp;&emsp;【译者注】：这是mobxjs的一名作者写的mobx使用解析，读完觉得挺有意思。

&emsp;&emsp;如果你曾经用jQuery写过复杂的应用，你可能就会遇到管理不同页面部分UI内容同步的问题。常常，数据修改后需要体现在多个地方，随着项目的复杂化，你可能很难去管理。为了解决这个问题，我们常常需要使用事件来让页面的多个部分知道数据改变了。

&emsp;&emsp;所以，现在你是怎样管理这个状态的问题的呢？我确定你是通过订阅的方式来做的。这是对的，我敢肯定，如果你没有使用订阅的方式，那你实现起来太辛苦了，除非你使用了MobX。

#### 什么是状态？

&emsp;&emsp;这里是一个person对象，比如某个人，他有firstName，lastName和age，另外fullName()方法将显示他的全名。

```javascript
var person = {
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 37,
    fullName: function () {
        this.firstName + ' ' + this.lastName;
    }
};
```

&emsp;&emsp;那么当这个人的信息修改时，是怎样体现到你输出内容上的呢？你在什么时候触发这些通知呢？在MobX之前，你可以使用setter来触发jQuery事件或者js信号。这些方案很好，但是使用它们不够清晰。我想在person对象的任何部分改变时就去自动触发。

&emsp;&emsp;这里是一段修改firstName信息的代码，如果我修改age，那么这是会触发修改通知的，因为我们将数据订阅绑定在person的整个对象上了。

```javascript
person.events = {};

person.setData = function (data) {
    $.extend(person, data);
    $(person.events).trigger('changed');
};

$(person.events).on('changed', function () {
    console.log('first name: ' + person.firstName);
});

person.setData({age: 38});
```

&emsp;&emsp;我们怎样解决这个问题呢？很简单，为person对象的每个属性设置一个setter来触发每一个事件。等等，但是这样如果age和firstName同时改变了该怎么办。所以你得设置一个延时来保证两个属性都改变完成时才触发。这似乎行得通并且我就是这么干的。

#### 通过MobX来解决

&emsp;&emsp;[MobX](https://github.com/mobxjs/mobx)是一个简单、高效的前端状态管理脚本库。
&emsp;&emsp;根据文档，Just do something to the state and MobX will make sure your app respects the changes。

```
var person = mobx.observable({
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 37,
    fullName: function () {
    this.firstName + ' ' + this.lastName;
    }
});
```

&emsp;&emsp;注意下区别，mobx.observable是我做的唯一区别，我们再来看下console.log输出的内容。

```javascript
mobx.autorun(function () {
    console.log('first name: ' + person.firstName);
});

person.age = 38; // 不打印内容
person.lastName = 'RUBY!'; // 仍然不打印内容
person.firstName = 'Matthew!'; // 打印内容
```

&emsp;&emsp;通过使用autorun， MobX只会检测使用到的内容。如果你觉得不够清楚，来看下下面的：

```javascript
mobx.autorun(function () {
    console.log('Full name: ' + person.fullName);
});

person.age = 38; // 不打印内容
person.lastName = 'RUBY!'; // 打印内容
person.firstName = 'Matthew!'; // 打印内容
```

&emsp;&emsp;相信你已经理解了。

#### MobX核心概念

- observer

```javascript

var log = function(data) {
    $('#output').append('<pre>' +data+ '</pre>');
}

var person = mobx.observable({
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 34
});

log(person.firstName);

person.firstName = 'Mike';
log(person.firstName);

person.firstName = 'Lissy';
log(person.firstName);

```

&emsp;&emsp;MobX可观察的对象都是普通的对象。这个例子中我们没有观察任何内容，这里例子也向你展示了怎样将MobX使用到你的项目中。只需要使用mobx.observable()或 mobx.extendObservable()就可以了。

- autorun

```javascript

var person = mobx.observable({
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 0
});

mobx.autorun(function () {
    log(person.firstName + ' ' + person.age);
});

// this will print Matt NN 10 times
_.times(10, function () {
    person.age = _.random(40);
});

// this will print nothing
_.times(10, function () {
    person.lastName = _.random(40);
});

```

&emsp;&emsp;当变量值改变时，你肯定想做一些事情，所以使用autorun()，将会在任何一个观察的内容改变时触发回调。注意下上面的例子中age改变时autorun()为什么不会触发。

- computed

```javascript

var person = mobx.observable({
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 0,
    get fullName () {
        return this.firstName + ' ' + this.lastName;
    }
});
log(person.fullName);

person.firstName = 'Mike';
log(person.fullName);

person.firstName = 'Lissy';
log(person.fullName);

```

&emsp;&emsp;注意下fullName()方法没有使用参数和get的用法，MobX会自动创建一个计算的值。这是我最喜欢MobX的一个原因。注意下person.fullName有什么不同的地方？这是一个函数，但是你没有调用就获取到了结果！通常，你使用的是person.fullName()，而不是person.fullName。这里就是你遇到的第一个getter函数。

&emsp;&emsp;不仅如此，MobX还会监听你计算值得依赖的变量，并且只在它们修改的时候运行触发更新。如果没有修改，将会直接返回之前缓存中的值。看下面一个例子。

```javascript

var person = mobx.observable({
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 0,
    get fullName () {
        // Note how this computed value is cached.
        // We only hit this function 3 times.
        log('-- hit fullName --');
        return this.firstName + ' ' + this.lastName;
    }
});

mobx.autorun(function () {
    log(person.fullName + ' ' + person.age);
});

// this will print Matt Ruby NN 10 times
_.times(10, function () {
    person.age = _.random(40);
});

person.firstName = 'Mike';
person.firstName = 'Lissy';

```

&emsp;&emsp;这里我们使用了person.fullName很多次，但是函数只有在firstName和lastName修改时才会运行。这就是MobX可以提供你应用速度的一种方式。还有其它的特性，可以看文档：[https://mobxjs.github.io/mobx/refguide/api.html](https://mobxjs.github.io/mobx/refguide/api.html)

#### 使用MobX进行项目实践

&emsp;&emsp;让我们直接看例子：

```html
<h1>Test</h1>
<script>
var person = {
    events: {},
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 37,
    fullName: function() {
        return this.firstName + ' ' + this.lastName;
    },
    setPersonData: function(personData) {
        $.extend(this, personData);
        $(this.events).trigger('changed', personData);
    }
};
var renderCount = 0;
$(person.events).on('changed', function() {
    renderCount += 1;
    $('h1').text(person.fullName() + ' render count: '+ renderCount);
});

// this will trigger every time
_.times(10, function() {
    person.setPersonData({age: _.random(20)});
});
</script>

```

&emsp;&emsp;注意下这里name被重复渲染了10次，尽管我们没有修改firstName或lastName，你可使用多个事件来优化这里，在渲染之前做判断。但是太复杂了。下面是MobX的例子；

```html
<h1>Test</h1>

<script>
var person = mobx.observable({
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 37,
    get fullName () {
        return this.firstName + ' ' + this.lastName;
    }
});
var renderCount = 0;
mobx.autorun(function() {
    renderCount++;
    $('h1').text(person.fullName + ' render count: ' + renderCount);
});

// this will trigger the render one time
_.times(10, function() {
    person.setPersonData({
        age: _.random(20)
    });
});
</script>

```

&emsp;&emsp;注意下这里为什么没有事件、触发器或on绑定。使用MobX，你会使用修改后的最新值。而且它只被渲染一次，这是因为我们没有修改内容时autorun只是一直在监听。

```javascript
// observable person
var person = mobx.observable({
    firstName: 'Matt',
    lastName: 'Ruby',
    age: 37
});

// reduce the person to simple html
var printObject = function(objectToPrint) {
    return _.reduce(objectToPrint, function(result, value, key) {
        result += key + ': ' + value + '<br/>';
        return result;
      }, '');
};

// print out the person anytime there's a change
mobx.autorun(function(){
    $('#person').html(printObject(person));
});

// watch all the input for changes and update the person
// object accordingly.
$('input').on('keyup', function(event) {
    person[event.target.name] = $(this).val();
});
```

&emsp;&emsp;这里我们能编辑person的所有信息来观察输出的内容情况，现在这个例子中有个小小的问题，这里input的值和person的值不同步，我们改下：

```javascript
mobx.autorun(function(){
    $('#person').html(printObject(person));
     // update the input values
    _.forIn(person, function(value, key) {
        $('input[name="'+key+'"]').val(value);
    });
});

```

&emsp;&emsp;或许你会说，你这里有重新渲染了啊。是的，你这看到的就是为什么很多人选择使用React的原因。React允许你将输出内容拆分小的组件进行个别的渲染。这里有个完整的例子：[a jQuery example that I’ve optimized](http://codepen.io/SitePoint/pen/EgwkwB?editors=1010)

&emsp;&emsp;MobX可能在实际项目中使用吗？不一定，如果我需要这种细粒度的操作使用React就可以了。当我在实际项目中使用MobX和jQuery时，我使用autorun()就可以解决很多问题了。[the same example built with React and MobX](http://codepen.io/SitePoint/pen/NRadwy?editors=1010)

#### 更多相关资料

[MobX blogs, tutorials and videos](https://mobxjs.github.io/mobx/faq/blogs.html)

[Egghead.io course: Manage Complex State in React Apps with MobX](https://egghead.io/courses/manage-complex-state-in-react-apps-with-mobx)

[Practical React with MobX](https://www.youtube.com/watch?v=XGwuM_u7UeQ)

[Simple MobX Examples](https://github.com/mattruby/mobx-examples)

[MobX API reference](https://mobxjs.github.io/mobx/refguide/api.html)


原文作者：Matt Ruby
原文地址：https://www.sitepoint.com/manage-javascript-application-state-mobx/
译文作者：ouven