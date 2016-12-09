---
layout: post
title:  "Koa框架实践与中间件原理剖析"
date:   2015-12-19
author: ouven
tags: koa
categories: frontend-javascript
cover:  "assets/category/type-javascript.png"
---

&emsp;&emsp;[转载]：[http://www.cnblogs.com/Leo_wl/p/4684633.html](http://www.cnblogs.com/Leo_wl/p/4684633.html)。本文写的很深刻易懂，转来收藏。

&emsp;&emsp;Koa是Express原班人马打造的一个更小，基于nodejs平台的下一代web开发框架。Koa的精妙之处就在于其使用generator和promise，实现了一种更为有趣的中间件系统，Koa的中间件是一系列generator函数的对象，执行起来有点类似于栈的结构，依次执行。同时也类似于Python的django框架的中间件系统，以前苏千大神做分享的时候把这种模型称作为洋葱模型。

&emsp;&emsp;当一个请求过来的时候，会依次经过各个中间件进行处理，中间件跳转的信号是yield next，当到某个中间件后，该中间件处理完不执行yield next的时候，然后就会逆序执行前面那些中间件剩下的逻辑。直接上个官网的例子：

```javascript
var koa = require('koa');
var app = koa();

// response-time中间件
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger中间件
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// 响应中间件
app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
```

&emsp;&emsp;上面的执行顺序就是：请求 ==> response-time中间件 ==> logger中间件 ==> 响应中间件 ==> logger中间件 ==> response-time中间件 ==> 响应。

&emsp;&emsp;更详细描述就是：请求进来，先进到response-time中间件，执行 var start = new Date; 然后遇到yield next，则暂停response-time中间件的执行，跳转进logger中间件，同理，最后进入响应中间件，响应中间件中没有yield next代码，则开始逆序执行，也就是再先是回到logger中间件，执行yield next之后的代码，执行完后再回到response-time中间件执行yield next之后的代码。

&emsp;&emsp;至此，整个Koa的中间件执行完毕 ，整个中间件执行过程相当有意思。而Koa的中间件是运行在 co 函数下的，而tj大神的co函数能够把异步变同步，也就说，编写Koa的中间件的时候可以这样写，就拿上面那个demo最后的响应中间件来说可以改成这样：

```javascript
app.use(function*(){
    var text = yield new Promise(function(resolve){
        fs.readFile('./index.html', 'utf-8', function(err, data){
            resolve(data);
        })
    });

    this.body = text;
});
```

&emsp;&emsp;通过Promise可以把获取的文件数据data通过resolve函数，传到最外层的text中，而且，整个异步操作变成了同步操作。再比如使用mongodb做一个数据库查询功能，就可以写成这样，整个数据的查询原来是异步操作，也可以变成了同步，因为mongodb官方驱动的接口提供了返回Promise的功能，在co函数里只用yield的时候能够直接把异步变成同步，再也不用写那恶心的回调嵌套了。

```javascript
var MongoClient = require("mongodb").MongoClient;
app.use(function *(){
    var db = yield MongoClient.connect('mongodb://127.0.0.1:27017/myblog');
    
    var collection = db.collection('document');

    var result = yield collection.find({}).toArray();
    
    db.close()
});
```

&emsp;&emsp;tj的co函数就如同一个魔法，把所有异步都变成了同步，看起来好像很高大上。但是co函数做的事其实并不复杂。整个co函数说白了，就是使用Promise递归调用generator的next方法，并且在后一次调用的时候把前一次返回的数据传入，直到调用完毕。而co函数同时把非Promise对象的function、generator、array等也组装成了Promise对象。所以可以在yield后面不仅仅可以接Promise，还可以接generator对象等。

&emsp;&emsp;自己实现了一个简单的co函数，传入一个generator，获取generator的函数对象，然后定义一个next方法用于递归，在next方法里执行generator.next()并且传入data，执行完generator.next()会获取到`{value:XX, done: true | false}`的对象，如果done为true，说明generator已经迭代完毕，退出。否则，假设当前执行到yield new Promise()，也就是返回的result.value就是Promise对象的，直接执行Promise的then方法，并且在then方法的onFulfilled回调（也就是Promise中的异步执行完毕后，调用resolve的时候会触发该回调函数）中执行next方法进行递归，并且将onFulfilled中传入的数据传入next方法，也就可以在下一次generator.next()中把数据传进去。

```javascript

// co简易实现
function co(generator){
    var gen = generator();

    var next = function(data){
        var result = gen.next(data);

        if(result.done) return;

        if (result.value instanceof Promise) {
            result.value.then(function (d) {
                next(d);
            }, function (err) {
                next(err);
            })
        }else {
            next();
        }
    };

    next();
}

```

&emsp;&emsp;写个demo测试一下：

```javascript
// test
co(function*(){
    var text1 = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("I am text1");
        }, 1000);
    });

    console.log(text1);

    var text2 = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("I am text2");
        }, 1000);
    });

    console.log(text2);
});
```

&emsp;&emsp;既然了解了co函数的原理，再来说说koa的中间件是怎么实现的。整个实现原理就是把所有generator放到一个数组里保存，然后对所有generator进行相应的链式调用。

&emsp;&emsp;起初是自己按照自己的想法实现了一次，大概原理如下：

&emsp;&emsp;用个数组，在每次执行use方法的时候把generator传入gens数组保存，然后在执行的时候，先定义一个generator的执行索引index、跳转标记ne（也就是yield next里的next）、还有一个是用于保存generator函数对象的数组gs，。然后获取当前中间件generator，并且获取到该generator的函数对象，将函数对象放入gs数组中保存，再执行generator.next()。

&emsp;&emsp;接着根据返回的value，做不同处理，如果是Promise，则跟上面的co函数一样，在其onFulfilled的回调中执行下一次generator.next()，如果是ne，也就是当前执行到了yield next，说明要跳转到下一个中间件，此时对index++，然后从gens数组里获取下一个中间件重复上一个中间件的操作。

&emsp;&emsp;当执行到的中间件里没有yield next时，并且当该generator已经执行完毕，也就是返回的done为true的时候，再逆序执行，从此前用于保存generator的函数对象gs数组获取到上一个generator函数对象，然后执行该generator的next方法。直到全部执行完毕。

&emsp;&emsp;整个过程就像，先是入栈，然后出栈的操作。

```javascript
var gens = [];

function use(generetor){
    gens.push(generetor);
}

function trigger(){
    var index = 0;
    var ne = {};
    var gs = [],
        g;

    next();

    function next(){
        //获取当前中间件，传入next标记，即当yield next时处理下一个中间件
        var gen = gens[index](ne);

        //保存实例化的中间件
        gs.push(gen);

        co(gen)
    }

    function co(gen, data){
        if(!gen) return;

        var result = gen.next(data);

        // 当当前的generator中间件执行完毕，将执行索引减一，获取上一级的中间件并且执行
        if(result.done){
            index--;

            if(g = gs[index]){
                co(g);
            }

            return;
        }

        // 如果执行到Promise，则当Promise执行完毕再进行递归
        if(result.value instanceof Promise){
            result.value.then(function(data){
                co(gen, data);
            })
        }else if(result.value === ne){
            // 当遇到yield next时，执行下一个中间件
            index++;

            next();
        }else {
            co(gen);
        }
    }
}
```

&emsp;&emsp;然后再写个demo测试一下：

```javascript
// test

use(function*(next){
    var d = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("step1")
        }, 1000)
    });

    console.log(d);

    yield next;

    console.log("step2");
});

use(function*(next){
    console.log("step3");

    yield next;

    var d = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("step4")
        }, 1000)
    });

    console.log(d);
});

use(function*(){
    var d = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("step5")
        }, 1000)
    });

    console.log(d);

    console.log("step6");
});

trigger();
```

&emsp;&emsp;上面的只是我自己的觉得的实现原理，但是其实koa自己的实现更精简，在看了koa的源码后，也大概实现了一下，其实就是把上面的那个co函数进行适当改造一下，然后用个while循环，把所有generator链式绑定起来，再放到co函数里进行yield即可。下面贴出源码：

```javascript
var gens = [];

function use(generetor){
    gens.push(generetor);
}

// 实现co函数
function co(flow, isGenerator){
    var gen;

    if (isGenerator) {
        gen = flow;
    } else {
        gen = flow();
    }

    return new Promise(function(resolve){
        var next = function(data){
            var result = gen.next(data);
            var value = result.value;

            // 如果调用完毕，调用resolve
            if(result.done){
                resolve(value);
                return;
            }

            // 如果为yield后面接的为generator，传入co进行递归，并且将promise返回
            if (typeof value.next === "function" && typeof value.throw === "function") {
                value = co(value, true);
            }

            if(value.then){
                // 当promise执行完毕，调用next处理下一个yield
                value.then(function(data){
                    next(data);
                })
            }
        };

        next();
    });

}

function trigger(){
    var prev = null;
    var m = gens.length;
    co(function*(){
        while(m--){
            // 形成链式generator
            prev = gens[m].call(null, prev);
        }

        // 执行最外层generator方法
        yield prev;
    })
}
```

&emsp;&emsp;执行结果也是无问题，运行demo和运行结果跟上一个一样，就不贴出来了。