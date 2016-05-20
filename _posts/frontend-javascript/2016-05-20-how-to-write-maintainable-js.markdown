---
layout: post
title:  "【原译】解开面条代码: 怎样书写可维护JavaScript"
date: 2016-05-20
author: ouven
tags: javascript
categories: article-translation
cover: "assets/category/type-javascript.png"
---

&emsp;&emsp;**[译者注]**：这篇文章结合作者自己的经历确实写的很到位，大部分内容感同身受。同时作者很有条理的告诉我们应该怎样去思考解决问题。推荐给大家~

&emsp;&emsp;几乎每个开发者都有接手过维护遗留项目的经历，或者说是一个旧的项目想继续维护起来。通常第一反应是抛开它们代码规范基础，按自己的意思去写。这样代码会很乱，不可理解，并且别人可能要花费好几天去读懂代码。但是，如果结合正确的规划、分析、和一个好的工作流，那就有可能把一个面条式的代码仓库整理成一个整洁、有组织并易扩展的一份项目代码。

&emsp;&emsp;我曾经不得不接手并整理很多的项目。但还没有很多开始就很乱的。但实际上，最近就遇到了一个这样的情况。虽然我已经学会了关于JavaScript代码组织的很多知识，最重要的是，在前一个项目开发维护中几乎疯掉。在这篇文章中我想分享下一些我的步骤和我的经验。

### 一、分析项目

&emsp;&emsp;最开始的一步是看一下到底怎么回事。如果是个网站，点击网站所有的功能：打开对话框、发送表单等等。做这些的同时，打开开发者工具，看下是否报错或输出日志。如果是个nodejs项目，打开命令行接口过一下api，最好的情况是项目有一个入口(例如main.js，index.js，app.js)，通过入口能将所有的模块初始化；或者最坏的情况下，也要找到每个业务逻辑的位置。

&emsp;&emsp;找出使用的工具。jquery?React?Express?列出需要了解一些一切重要的东西。如果所在项目使用angular2写的，而你还没有使用过，直接去看文档先有个基本的了解。总之需要找下最好的开始方案。

**在更高的层次上看项目**

&emsp;&emsp;要知道技术是一个好的开始，但是为了有一个真实的感觉和理解，是时候研究下单元测试了。单元测试是用来测试功能和代码的方法是否按预期调用的一种方式。相比阅读代码和运行代码，单元测试能更深入的帮你了解代码。如果在你的项目中还没有单元测试，别急，我们接着往下看。

### 二、创建一个基准

&emsp;&emsp;这些都是关于代码一致性的内容。现在你已经了解了项目中使用的所有工具集，你知道了代码的结构和逻辑功能的位置，是时候建立一个基准了。我建议添加一个`editorconfig`文件来保证代码在不同的编辑器、ide或不同的开发者之间的编写风格一致。

**正确的缩进**

&emsp;&emsp;这是一个饱受争议的问题(跟战争一样)，代码中使用空格还是tab，其实这不重要。如果之前代码用的空格，那么使用空格，如果使用tab，继续使用。如果代码中都使用到了，那么是时候决定使用哪个了。讨论的观点是好的，但是一个好的项目目的是必须保证所有的开发者能在一起和谐的工作。

&emsp;&emsp;为什么这很重要。因为每个人都有使用自己编辑器或使用ide的方式。举例来说，我是code folding的追捧者。没有这些特性，我几乎在一个文件里面迷失。如果缩进不是一样的，那么代码会看起来很乱。所以，们每次我打开一个文件，在我开始工作之前必须修复缩进的问题。这很浪费时间。

```
// While this is valid JavaScript, the block can't
// be properly folded due to its mixed indentation.
function foo(data) {
	let property = String(data);

	if (property === 'bar') {
		property = doSomething(property);
	}
	//... more logic.
}

// Correct indentation makes the code block foldable,
// enabling a better experience and clean codebase.
function foo(data) {
	let property = String(data);
	if (property === 'bar') {
		property = doSomething(property);
	}
	//... more logic.
}
```

**命名**

&emsp;&emsp;保证项目里面使用到的命名规则是合理的。通常JavaScript里面一般使用驼峰式命名方式，但是我看到了很多混合式的命名方式。举例来说，jquery项目常常含有jquery变量和其他变量的混合命名。

```
const $element = $('.element');

function _privateMethod() {
	const self = $(this);
	const _internalElement = $('.internal-element');
	let $data = element.data('foo');
	//... more logic.
}

// This is much easier and faster to understand.
const $element = $('.element');

function _privateMethod() {
	const $this = $(this);
	const $internalElement = $('.internal-element');
	let elementData = $element.data('foo');
	//... more logic.
}
```

**尽可能使用lint**

&emsp;&emsp;前面一点就会使我们的代码变得好看些，能够帮助我们快速地浏览代码，这里我们通常还要推荐使用保证代码整洁性的最佳实践方案。`ESlint JSlint`,`JSHint`是现在最流行的JavaScript格式工具。个人来说，之前使用JSLint比较多，现在开始觉得ESlint很不错，主要是它的一些自定义规则和最早支持ES2015语法很好用。

&emsp;&emsp;如果你使用lint时，编辑器报了一堆错误，那么修复它们，在此之前什么也不要做。

**更新依赖**

&emsp;&emsp;更新依赖需要非常小心谨慎，如果你更换或更新了依赖很容易引发更多的错误，所以一些项目可能在某个版本(例如 v1.12.5)下面正常工作，然而通配符匹配到另个版本(例如 v1.22.x)就出问题了。这种情况下，你需要快速升级，版本号一般是这样的：`MAJOR.MINOR.PATCH`。如果你还对语义化版本不熟悉，建议先读下Tim Oxley的这篇文章--[Semver: A Primer](https://nodesource.com/blog/semver-a-primer/)。

&emsp;&emsp;升级依赖没有通用的处理规则。每个项目不同，必须区分对待。项目中升级补丁版本号一般都不是问题，也可以建立副本使用。只有当依赖中主版本号内容发生冲突错误时，那就应该看下具体是什么发生了变化。可能api完全改变了，那样你就要大面积重写你项目中的代码。如果那觉得这样代价太高，那么我建议不要升级这个主版本号。

&emsp;&emsp;如果你使用npm来管理依赖(而且基本没什么其他好的方案了)，你可以使用 `npm outdated` 命令在你的CLI里来检查哪些依赖版本是比较旧的。让我举个我项目里面一个叫fontBook的例子，所以我这个项目里面经常更新：

![](http://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/04/1459594112npm-outdated.png)

&emsp;&emsp;如你所见，我这里做了很多更新。但我一般不是马上所有的做更新，而是一次更新一个。可以说，这样花费了很多时间，然而这是唯一保证不出问题的方法(如果项目没有任何测试用例的话)。

### 三、让我们干点事情

&emsp;&emsp;这里我主要要表达的是整理项目并不一定意味着移除或重写大部分的代码。当然，有时候这时唯一的解决方案，但是这不是你一开始就应该考虑的问题。JavaScript代码很可能成为一个奇怪的代码，后面去做一些调整通常是不可能的。我们通常需要根据特定的场景来给出一个改造方案。

**建立测试用例**

&emsp;&emsp;使用测试用例可以保证你的代码能进行正确的运行而不会出现意外的错误。JavaScript单元测试直接可以写出很多文章，所有我这里没办法介绍太多。广泛使用的框架有karma、jasmine、macha和ava等。如果你也想测试你的用户界面，推荐使用Nightwatch.js和Dalekjs这类浏览器自动测试工具。

&emsp;&emsp;单元测试和浏览器自动化测试的区别是，前者测试JavaScript本身代码。它保证了所有的模块和通用逻辑能预期运行。浏览器自动化，另一方面来说是测试界面，也就是项目的用户界面，保证页面上的元素在预期正确的位置。

&emsp;&emsp;在重构任何事情之前先建立好测试用例。这样项目的稳定性会提升，或许你甚至压根也考虑过项目稳定性的东西。一个很大的好处是，一旦出了一些自己没有意识到的错误时，你不用太着急。Rebecca Murphey写过一篇非常不错的文章可以看下[writing unit tests for existing JavaScript](https://rmurphey.com/blog/2014/07/13/unit-tests)。

**架构**

&emsp;&emsp;JavaScript架构是另一个大的主题。重构和整理框架决定于你在这方面有多少经验。我们在软件开发中有很多的设计模式。但是并不是所有的都能适应稳定性的需求。不幸的是，这篇文章中我不能给出所有的场景，但至少还是可以给一些通用性的建议。

&emsp;&emsp;首先，你要知道你的项目中使用到了那种设计模式。了解下这种模式，并保证它在整个项目是一致的。稳定性一个关键的地方是和设计模式紧密结合的，而不是混合的方法技术。当然，在你的项目里可以使用不同的设计模式来达到不同的目的(例如使用单例来建立数据结构或者短命名的工具函数，或者在模块中使用观察者模式)，但是绝对不要一个模块使用一种设计模式，另一个模块使用另一个模式。

&emsp;&emsp;如果在你的项目中个确实没有使用到什么架构(可能什么东西都是一个巨大的huge.js)，那么是时候改变它了。但不要马上做所有的改变，而是一点一点的来。同样，这里没有通用的方法，每个项目的设置也是不一样的。项目目录结构根据项目的规模和复杂度不同也不一样。通常，对于最基本的层级，结构一般分为分为第三方内容、模块内容、数据和一个初始化所有模块和逻辑的入口(例如index.js、main.js)。这样我们就需要模块化了。

**所有的东西都模块化？**

&emsp;&emsp;模块化至今也不是大规模可扩展JavaScript项目的解决方案。它需要开发者必须去熟悉另一层api。尽管这样可能会带来很多的困难，但它的原则是把你的功能划分成小的模块。这样，在团队协作过程中解决问题就变的更简单了。每个模块应该有个一个明确的目标功能点。一个模块应该是不知道你外面代码逻辑是什么样的，并且能在不同的地方和场景下复用。

&emsp;&emsp;那么怎样将大量关联逻辑的代码拆分成模块呢？一起看下。

```
fetch('https://api.somewebsite.io/post/61454e0126ebb8a2e85d', {
		method: 'GET'
	})
	.then(response => {
		if (response.status === 200) {
			return response.json();
		}
	})
	.then(json => {
		if (json) {
			Object.keys(json).forEach(key => {
				const item = json[key];
				const count = item.content.trim().replace(/\s+/gi, '').length;
				const el = `
          <div class="foo-${item.className}">
            <p>Total characters: ${count}</p>
          </div>
        `;
				const wrapper = document.querySelector('.info-element');

				wrapper.innerHTML = el;
			});
		}
	})
	.catch(error => console.error(error));
```

&emsp;&emsp;这里基本没有模块化。所有的东西都是紧密结合的，并且相互依赖。想象一下在更大、更复杂的函数里，如果出了问题你要来debug。可能api不响应、json里面字段改变了或者其他的。这简直疯掉。

```
// In the previous example we had a function that counted
// the characters of a string. Let's turn that into a module.
function countCharacters(text) {
	const removeWhitespace = /\s+/gi;
	return text.trim().replace(removeWhitespace, '').length;
}

// The part where we had a string with some markup in it,
// is also a proper module now. We use the DOM API to create
// the HTML, instead of inserting it with a string.
function createWrapperElement(cssClass, content) {
	const className = cssClass || 'default';
	const wrapperElement = document.createElement('div');
	const textElement = document.createElement('p');
	const textNode = document.createTextNode(`Total characters: ${content}`);

	wrapperElement.classList.add(className);
	textElement.appendChild(textNode);
	wrapperElement.appendChild(textElement);

	return wrapperElement;
}

// The anonymous function from the .forEach() method,
// should also be its own module.
function appendCharacterCount(config) {
	const wordCount = countCharacters(config.content);
	const wrapperElement = createWrapperElement(config.className, wordCount);
	const infoElement = document.querySelector('.info-element');

	infoElement.appendChild(wrapperElement);
}
```

&ems;&emsp;很好，我们现在有三个模块了，我们来看下调用的情况：

```
fetch('https://api.somewebsite.io/post/61454e0126ebb8a2e85d', {
		method: 'GET'
	})
	.then(response => {
		if (response.status === 200) {
			return response.json();
		}
	})
	.then(json => {
		if (json) {
			Object.keys(json).forEach(key => appendCharacterCount(json[key]))
		}
	})
	.catch(error => console.error(error));
```

&emsp;&emsp;我们将 `.then()` 里面的方法提取了出来，这里我想我已经向大家演示了模块化的意思了。

**如果不用模块化会怎么样**

&emsp;&emsp;正如我所说的，将你的项目代码分成很小的模块增加了另一层api。如果你不想这样，又想保证代码在团队协作中的整洁性，那绝对就是使用更大的函数。但是你仍然可以将你的代码拆分成多个简单的部分，而且每一部分都是可测试的。

**给代码添加文档注释**

&emsp;&emsp;文档是一个很重的讨论话题。一部分编程社区主张为任何东西书写文档，而另一部分人认为自带必要注释的代码就够了。就像生活中很多事情一样，我想两者之间一个好的平衡是最好的实践。这里推荐使用 JSDoc来管理你的文档。

&emsp;&emsp;JSDoc是一个JavaScript的api文档生成器。通常可以在ide插件里面使用。例如

```
function properties(name, obj = {}) {
	if (!name) return;
	const arr = [];

	Object.keys(obj).forEach(key => {
		if (arr.indexOf(obj[key][name]) <= -1) {
			arr.push(obj[key][name]);
		}
	});

	return arr;
}
```

&emsp;&emsp;这个函数接受两个参数后迭代一个对象，然后返回一个数组。这段代码不是很复杂，但是对于没有接触过这段代码的人还是需要一点时间来弄明白发生了什么事情。另外，函数做了什么事情不是很明确，所以文档可以这样写。

```
/**
 * Iterates over an object, pushes all properties matching 'name' into
 * a new array, but only once per occurance.
 * @param  {String}  propertyName - Name of the property you want
 * @param  {Object}  obj          - The object you want to iterate over
 * @return {Array}
 */
function getArrayOfProperties(propertyName, obj = {}) {
	if (!propertyName) return;
	const properties = [];
	Object.keys(obj).forEach(child => {
		if (properties.indexOf(obj[child][propertyName]) <= -1) {
			properties.push(obj[child][propertyName]);
		}
	});
	return properties;
}
```

&emsp;&emsp;我没有接触太多代码本身。只是通过重命名了函数并且添加了一个简短的描述性注释块，这样就提升了代码的可读性。

**拥有一个有组织的提交工作流**

&emsp;&emsp;重构本身是件巨大的工作。为了常常回滚你的更改(实际上你尝尝写错了但是后来才知道)，我建议提交你的每一次修改。重写一个方法吗？`git commit` (或者 `svn commit`，如果你用的是svn)。重命名一个名字，文件名或者一些图片？`git svn`。你可能已经懂了，我强烈建议一些人使用，它确实能帮你做整理和组织化代码。

&emsp;&emsp;在一个新分支上重构，不要在主干上直接修改。你可能需要快速修改主干并提交bug fix到正式环境，但是你又不想你的重构代码没有测试或完成就上线。所以建议在另一个分支上开始。

&emsp;&emsp;假如你需要快速了解git的工作原理。这里有一个[介绍](https://guides.github.com/introduction/flow/)。

### 四、怎样不会疯掉

&emsp;&emsp;为了不被之前的开发者逼疯，除了这些的技术整理步骤之外，还有重要的一步是我很少看到的(就是负面情绪)。当然，着并不是说的每个人，但是我知道有些人经历过。它确实花费我很多时间来冷静下来。我曾经几乎被我前面的开发者逼疯掉了，完全不明白他的代码、解决方案以及为什么一切都是这么乱套。

&emsp;&emsp;最后，这些负面情绪没有改变什么。没有帮我重构代码，反而浪费了我的时间，让我的代码出错。这会让你越来越郁闷。因为你可能花掉几个小时去重构一个功能，并且没有人会感谢你重写了一个已经存在的模块。这不值得。做重要的事情，然后分析处境。你可能经常需要重构一些模块里面很小的部分。

&emsp;&emsp;另外，你的代码总有你这样写的原因。可能之前的程序员可能并没有时间去思考怎样正确的那样做，或者因为其他原因。我们自己也是。

### 五、总结一下

&emsp;&emsp;让我们再来梳理一下，为下一个项目整理一个目录。

**1、分析项目**

- 不考虑你是开发者，把自己当成一个用户看下你的项目是什么东西
- 浏览下代码看下用了哪些工具
- 看些文档找下好的工具实践
- 过下单元测试，从更高的角度上看下项目

**2、建立基准**

- 使用 `.editorconfig` 来保证不同编辑器之间的代码规范
- 确定好缩进方式。tab或空格都无所谓
- 保证命名规范
- 如果还没使用，那么推荐使用格式工具，例如`ESlint, JSlint`，或 `JSHint` 等
- 更新依赖，但是要理性的去慢慢升级

**3、整理**

- 使用 Karma、Jasmine或Nightwatch.js来建立单元测试或浏览器自动化测试
- 保证架构和设计模式一致性
- 不要混用设计模式，尽可能结合已有的设计模式
- 决定你是否想将项目分离成模块。每个模块只做明确的一个功能的并且和外面的代码解耦
- 如果不想做模块化，专注于分离成多个可测试的小型代码块
- 为你的代码建立文档和合适的命名方式
- 使用JSDoc来自动生成注释
- 提交每一个代码变更。如果出错方便回滚

**4、不要疯掉**

- 不要抱怨前面的程序员。负面情绪不能帮你重构，只会浪费你的时间
- 每行代码都有它存在的原因。记住我们写的代码也是

&emsp;&emsp;真心希望这篇文章能帮助你，或者大家觉得有什么没提到的地方或好的建议也可以告诉我。


---

原文作者：Moritz Kröger

原译：ouven

原文地址： [https://www.sitepoint.com/write-maintainable-javascript/](https://www.sitepoint.com/write-maintainable-javascript/)

