---
layout: post
title:  "前端自动化测试解决方案探析"
date:   2016-11-22
author: ouven
tags:   test 测试 前端自动化测试
categories: frontend-javascript
cover:  "assets/category/type-weboptimize.png"
---


&emsp;&emsp;前端测试一直是前端项目开发过程中机器重要的一个环节，高效的测试方法可以减少我们进行代码自测的时间，提高我们的开发效率，如果你的代码涉及的测试用例较多，而且项目需要长期维护，这时就可以考虑使用一下自动化测试了。

#### 一、前端自动化测试

&emsp;&emsp;前端自动化测试一般是指是在预设条件下运行前端页面或逻辑模块，评估运行结果。预设条件应包括正常条件和异常条件，以达到自动运行测试过程、减少或避免人工干预测试的目的。在前端自动化测试中，我们通常是通过不同的工具来解决不同场景下不同的问题的。就测试类型来看，主要分为BDD(Bebavior Driven Developement，行为驱动测试)和TDD(Testing Driven Developement，测试驱动开发)。BDD可以让项目成员（甚至是不懂编程的）使用自然描述语言来描述系统功能和业务逻辑，从而根据这些描述步骤进行系统自动化的测试；TDD则要求在编写某个功能的代码之前先编写测试代码，然后只编写使测试通过的功能代码，通过测试来推动整个开发的进行。这有助于编写简洁可用和高质量的代码，并加速实际开发过程

&emsp;&emsp;BDD和TDD均有各自的适用场景，BDD一般更偏向于系统功能和业务逻辑的自动化测试设计，而TDD在快速开发并测试功能模块的过程中则更加高效，以快速完成开发为目的。下面我们看下BDD和TDD具体的特点：

BDD的特点：
- 从业务逻辑的角度定义具体的输入与预期输出，以及可衡量的目标；
- 尽可能覆盖所有的测试用例情况；
- 描述一系列可执行的行为，根据业务的分析来定义预期输出。例如，expect, should, assert；
- 设定关键的测试通过节点输出提示，便于测试人员理解；
- 最大程度的交付出符合用户期望的产品，避免输出不一致带来的问题。

TDD的特点：
- 需求分析，快速编写对应的输入输出测试脚本；
- 实现代码让测试为成功；
- 重构，然后重复测试，最终让程序符合所有要求。

#### 二、单元测试解决方案

&emsp;&emsp;就前端而言，单元测试的实现工具比较多。主要有mocha，jasmine和qunit。我们先来看看使用mocha是怎样实现单元测试的。

- mocha

&emsp;&emsp;mocha的特点是简单可扩展、支持浏览器和Node、支持同步和异步、支持连续用例测试。测试集，以函数describe(string, function)封装；测试用例，以it(string, function)函数封装，它包含2个参数；断言，以assert语句表示，返回true或false。另外，mocha在完成异步测试用例时通过done()来标记。

```
$ npm install mocha
$ mkdir test
$ $EDITOR test/test.js # or open with your favorite editor
```

&emsp;&emsp;测试用例：

```javascript
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
```

&emsp;&emsp;输出为：

```
$ ./node_modules/mocha/bin/mocha

  Array
    #indexOf()
      ✓ should return -1 when the value is not present


  1 passing (9ms)
```

&emsp;&emsp;同时，mocha支持异步和Promise。

```javascript
describe('#find()', function() {
    it('respond with matching records', function(done) {
        db.find({type: 'User'}, function(err, res) {
            if (err) return done(err);
            res.should.have.length(3);
            done();
            });
        });
    });
});
```

[http://mochajs.org/](http://mochajs.org/)

- jasmine。

&emsp;&emsp;jasmine是一个BTT的框架，不依赖其它框架。测试集以函数describe(string, function)封装；测试用例，以it(string, function)函数封装，它也包含2个参数；断言，以expect语句表示，返回true或false；断言的比较操作时，将Expectation传入的实际值和Matcher传入的期望值比较，另外任何Matcher都能通过在expect调用Matcher前加上not来实现一个否定的断言（expect(a).not().toBe(false);）

```javascript
describe("A suite is just a function", function() {
    var a;
    it("and so is a spec", function() {
        a = true;

        expect(a).toBe(true);
        expect(a).not().toBe(false);
    });
});
```

&emsp;&emsp;jasmine也支持异步测试用例。

```javascript
describe("long asynchronous specs", function() {
    beforeEach(function(done) {
    done();
}, 1000);

it("takes a long time", function(done) {
    setTimeout(function() {
        done();
    }, 9000);
}, 10000);

afterEach(function(done) {
    done();
    }, 1000);
});
```

[https://jasmine.github.io/2.5/introduction](https://jasmine.github.io/2.5/introduction)

- qunit

&emsp;&emsp;qunit是一个可基于jquery的简单测试框架，主要运行在浏览器端。它通过QUnit.test定义一个测试集，一个测试集中通过回调函数里面多个断言判断来实现多个测试用例，使用起来非常简单。

```html

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>QUnit Example</title>
    <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-2.0.1.css">
</head>
<body>
    <div id="qunit"></div>
    <div id="qunit-fixture"></div>
    <script src="https://code.jquery.com/qunit/qunit-2.0.1.js"></script>
    <script>
    QUnit.test( "hello test", function( assert ) {
        assert.ok( 1 == "1", "Passed!" );
        assert.equal( null, false, "null, false; equal fails" );
    });
    </script>
</body>
</html>

```

&emsp;&emsp;qunit也支持异步测试用例，异步完成时通过done()来结束。

```javascript
QUnit.test( "assert.async() test", function( assert ) {
    var done = assert.async();
    var input = $( "#test-input" ).focus();
    setTimeout(function() {
        assert.equal( document.activeElement, input[0], "Input was focused" );
        done();
    });
});
```

[http://api.qunitjs.com/async/](http://api.qunitjs.com/async/)


&emsp;&emsp;小结一下，单元测试工具的主要组成部分其实是类似的，主要包括测试集、测试用例、断言和断言比较等。它可以用来快速测试单元模块的主要功能，有助于辅助我们快速开发。

#### 三、集成化测试解决方案

&emsp;&emsp;除了模块单元的测试驱动开发，在系统功能测试阶段，我们希望自动化完成业务功能正确性的检测，此时我们就要考虑集成测试方案了。目前前端集成化测试自动化工具也有比较多。例如CasperJS、Nighmare、Nightwatch、Dalekjs，我们来逐个看下。

- casperJS。

&emsp;&emsp;casperJS基于PhantomJS或SlimerJS(PhantomJS或SlimerJS都是用于web测试的自动化无界面浏览器)，可以模拟完成页面内系统级的自动化操作行为测试。

```javascript

var casper = require('casper').create();
casper.start('http://casperjs.org/');

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
});

casper.thenOpen('http://phantomjs.org', function() {
    this.echo('Second Page: ' + this.getTitle());
});

casper.run();
```

&emsp;&emsp;输出内容为：

```
$ casperjs sample.js
First Page: CasperJS - a navigation scripting & testing utility for PhantomJS and SlimerJS written in Javascript
Second Page: PhantomJS | PhantomJS
```

&emsp;&emsp;页面内的操作结合casper的操作就可以这样来实现。

```javascript

var casper = require('casper').create();
var links;

function getLinks() {
// Scrape the links from top-right nav of the website
    var links = document.querySelectorAll('ul.navigation li a');
    return Array.prototype.map.call(links, function (e) {
        return e.getAttribute('href')
    });
}

// Opens casperjs homepage
casper.start('http://casperjs.org/');

casper.then(function () {
    links = this.evaluate(getLinks);
});

casper.run(function () {
    for(var i in links) {
        console.log(links[i]);
    }
    casper.done();
});

```

[http://casperjs.org/](http://casperjs.org/)


- Nightmare。

&emsp;&emsp;类似的，nightmare也是一个模拟还原浏览器上业务操作的强大工具，而且更易于使用。同时可以使用chrome的插件daydreem自动录制生成用户行为操作的事件序列，更加方便我们进行实际的测试。

```javascript
yield Nightmare()
    .goto('http://yahoo.com')
    .type('input[title="Search"]', 'github nightmare')
    .click('.searchsubmit');

```

&emsp;&emsp;Nightmare也支持异步操作，并支持多种断言库，这里结合chai.js就可以这样来使用。

```javascript
var Nightmare = require('nightmare');
var expect = require('chai').expect; // jshint ignore:line

describe('test yahoo search results', function() {
    it('should find the nightmare github link first', function(done) {
    var nightmare = Nightmare()
    nightmare
      .goto('http://yahoo.com')
      .type('form[action*="/search"] [name=p]', 'github nightmare')
      .click('form[action*="/search"] [type=submit]')
      .wait('#main')
      .evaluate(function () {
        return document.querySelector('#main .searchCenterMiddle li a').href
      })
      .end()
      .then(function(link) {
        expect(link).to.equal('https://github.com/segmentio/nightmare');
        done();
      })
  });
});
```

[http://www.nightmarejs.org/](http://www.nightmarejs.org/)

- Nightwatch。

&emsp;&emsp;Nightwatch则可以使用node书写端对端的测试用例，并在Selenium server服务端运行测试，同样支持同步和异步。

```javascript
this.demoTestGoogle = function (browser) {
  browser
    .url('http://www.google.com')
    .waitForElementVisible('body', 1000)
    .setValue('input[type=text]', 'nightwatch')
    .waitForElementVisible('button[name=btnG]', 1000)
    .click('button[name=btnG]')
    .pause(1000)
    .assert.containsText('#main', 'The Night Watch')
    .end();
};
```
[http://nightwatchjs.org/](http://nightwatchjs.org/)

- Dalekjs

&emsp;&emsp;DalekJS是一个跨浏览器平台的前端集成测试框架，可以自动配置启动本地的浏览器，也可以模拟填写提交表单、点击、截屏、运行单元测试等丰富的操作。


```javascript

module.exports = {
    'Amazon does its thing': function (test) {
      test
        .open('http://www.amazon.com/')
        .type('#twotabsearchtextbox', 'Blues Brothers VHS')
        .click('.nav-submit-input')
        .waitForElement('#result_0')
        .assert.text('#result_0 .newaps a span').is('The Blues Brothers')
        .done();
    }
};

```

```javascript
test.open('http://adomain.com')
    .click('#aquestion')
    .answer('Rose')
    .assert.text('#aquestion').is('Rose', 'Awesome she was!')
    .done();
```

[http://dalekjs.com/](http://dalekjs.com/)

&emsp;&emsp;小结一下，和单元测试相同的是，集成测试和单元测试类似，一般也会对测试预期输出进行断言和判断，不同的是，集成测试的输入设计和功能流程中涉及到浏览器本身的行为模拟，用以代替测试人员手动操作的过程，从而能够提高测试效率。

#### 四、总结与注意事项

&emsp;&emsp;通过对单元测试工具和集成测试工具的概述介绍，我们基本了解了单元测试和集成测试的核心部分和特点，尽管目前主流的测试工具各不相同，但是基本的流程原理确实相同的。

&emsp;&emsp;当然，还有一些仍需要我们注意的问题。自动化测试不可避免地要求我们去编写测试用例，会花去一定的事件，我们在实际的项目开发过程中，决定要不要使用自动化的测试方案应该根据具体的场景来决定，如果业务规模并不复杂，而且系统功能流程清晰，则不建议使用测试用例，因为这样得不偿失；但如果业务达到一定规模，需要在原有较大项目继续维护开发的情况下，编写测试用例有利于我们较快暴露和定位问题，并极有助于后期的维护。

参考资料：

[http://joshldavis.com/2013/05/27/difference-between-tdd-and-bdd/](http://joshldavis.com/2013/05/27/difference-between-tdd-and-bdd/)

[https://pythonhosted.org/behave/philosophy.html](https://pythonhosted.org/behave/philosophy.html)

[http://wiki.c2.com/?TestDrivenDevelopment](http://wiki.c2.com/?TestDrivenDevelopment)