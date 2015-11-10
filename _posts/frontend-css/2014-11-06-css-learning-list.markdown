---
layout: post
title:  "css学习资源汇总"
date:  2015-11-06
author: ouven
tags: css 资源汇总
categories: frontend-css
cover: "assets/category/type-css.png"
---

## css reset
目前有两种reset，一种是属于修正式的reset，这个以[normalize.css]( http://necolas.github.io/normalize.css/  )为代表；另一种就是我们常用的清零式reset如最简单的`*{margin:0;padding:0;}`，目前各个框架都是先以normalize为基础，然后实现清零。
清零之外，我们会给html或body添加些font属性或背景，也会添加一些基础的类，方便使用，如`clearfix`

[ie bug集合](http://www.w3cplus.com/solution/iebug/iebug.html)
关于如何给各种浏览器打bug，可查询：
[browser hacks](http://browserhacks.com/)
因为里面有很多问题都是ie6/7的，所以大家多少都应该了解过，应该没什么问题，如果问题比较多的话，我再考虑ppt分享下。
http://www.qianduan.net/ie6u002639s-bug-amended-10-tips.html

清除浮动包括清除子元素的浮动和清除上级元素的浮动，其中清除上级元素的浮动，只需设置clear为both（或left，right）就可以了，而清除子元素的浮动则可以用空标签、clearfix或overflow。因清除上级元素的浮动比较简单，而空标签法清除子元素浮动会增加额外标签，所以推荐使用clearfix和overflow。
 
除此之外，`display:inline-block;`也可以清除子元素浮动。
 
[清除浮动解决方案](http://www.w3cplus.com/solution/clearfloat/clearfloat.html)
 
### PostCSS
https://github.com/postcss/postcss
根据caniuse（https://github.com/postcss/postcss ）的数据，自动生存浏览器前缀
grunt-autoprefixer: https://www.npmjs.com/package/grunt-autoprefixer
gulp-autoprefixer: https://www.npmjs.com/package/gulp-autoprefixer
 
### flex应用场景demo见附件
[深入了解flex](http://www.w3cplus.com/blog/666.html )
 
### 
图文混排解决方案](http://www.w3cplus.com/solution/imagetextmix/imagetextmix.html)
 
除上述方法外，还有昨天发的flex方法
 
### css3 学习资源
 
先放个资源集合，以后再整理个单个属性的关键点：
 
- [css3 files](http://css3files.com/)
- [MDN CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [css3 maker](http://www.css3maker.com/)

### 列表类解决方案
http://www.w3cplus.com/solution/itemlist/itemlist.html
同样，这个也可以用flex来解决
 
### 关于css的class命名
 
- BEM方式，这个大家都知道了
- [CSS命名神马的真心难](http://jiongks.name/blog/naming-css-stuff-is-really-hard/)
- [原子类class](http://mrthink.net/css-tips-oopcoding/)
- [base基础类的那些事儿](http://www.cnblogs.com/limingxi/p/3710600.html)
- [分类形式class命名](http://nec.netease.com/standard/css-sort.html)

1、某些移动端的浏览器不支持`:checked ~ .ele`，但是支持`:checked + .ele`

## [border-radius](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)

1、一般来说我们给的圆角弧度都是圆形的，如果需要弧度为椭圆的，则使用`/`分割x轴的半径和y轴的半径如：`border-radius: 18px / 13px`

2、在高级浏览器的父元素设置圆角再加上`overflow:hidden`，则子元素设置的背景是不会溢出的，圆角表现良好。但是在部分低端浏览器（如安卓浏览器，uc浏览器等）则不行，这就还得为子元素也设圆角

3、某些老版本的浏览器img图片不支持border-radius

4、ie9如使用滤镜模拟渐变背景，颜色将会溢出，设置的圆角


## [box-shadow](http://css-tricks.com/snippets/css/css-box-shadow/)

1、内阴影使用关键词`inset`

2、多值的时候第一个值的层级最高

3、单边shadow可以使用spread值来模拟，详见[Use spread to manipulate the box-shadow](http://conceptboard.github.io/box-shadow-spread-examples/)

4、与下面的伪类结合，可以生存超强阴影，详见[box-shadow阴影](http://www.w3cplus.com/solution/css3box/css3box.html)


## [伪元素before和after](http://www.w3cplus.com/solution/css3content/css3content.html)

1、css3中为了区分伪元素和伪类，规定伪元素使用`::`，而伪类则使用`:`，但是css2.1是不分的，一律采用`:`。所以对于before和after伪元素如果只考虑移动端的话最好写成`::before`,`::after`，而如果还要考虑pc的ie8的话，则写成`:before`，`:after`

## 文字特效

1、[text-shadow文字阴影](http://www.w3cplus.com/solution/css3text/css3text.html)

2、[@font-face icon]()

2、[中文@font-face不是梦](http://font-spider.org/)

3、[使用mask属性美化文字](http://viget.com/inspire/easy-textures-with-css-masks?utm_source=html5weekly&utm_medium=email)


## color

1、rgba，根据alpha的值设置透明度
2、opacity设置的透明度是整体的透明度，包括里面所有的子元素，而且子元素不可覆写。除z-index外，设置opacity也会影响元素的层级
3、如需要设置颜色的透明度，可使用rgba，如果是做动画的渐隐则选择opacity

## 单位

1、如果只支持ie8+，建议使用`*{box-sizing:border-box;}`,这个尤其是在移动端，方便百分比的计算

2、单元计算属性`calc()`，目前兼容性不是很好，不建议使用

3、rem相对与跟元素的单位，一般先设置`html{font-size:62.5%}`,相当于10px。 然后某个元素需要14px，只需设置1.4rem。不过默认chrome浏览器是不支持12px以下的字体的，所以如果设置的font-size小于1.2rem，那么就相当于是1.2rem，而且除字体外，其余宽度高度的rem计算则以最小为12px为标准计算，如14rem，就不是140px，而是168px

4、Viewport units (vw, vh, vmin, vmax)，兼容性不太好，在不久的将来将会是一大利器


## [gradient]((https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_gradients))

[online gradient create](http://www.colorzilla.com/gradient-editor/)

## [多背景图片](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_multiple_backgrounds)

1、第一个层级最高，如需要设置背景颜色得在最后一个上面设置

2、background-size设置百分比值的时候，是元素的百分比，而不是背景图片的百分比，而px和em均为背景图片的。

## transform

1、设置transform之后，会影响其子元素的position定位参考

2、transform的skew,rotate,translate,scale设置先后，会影响到其transform-origin的值，如形成正方体有两种办法：第一种先translate到其位置，然后再设置各个旋转；第二种是先在原地旋转好，再设置translate值，代码如下：

    .front  { transform: rotateY(   0deg ) translateZ( 100px ); }
    .back   { transform: rotateX( 180deg ) translateZ( 100px ); }
    .right  { transform: rotateY(  90deg ) translateZ( 100px ); }
    .left   { transform: rotateY( -90deg ) translateZ( 100px ); }
    .top    { transform: rotateX(  90deg ) translateZ( 100px ); }
    .bottom { transform: rotateX( -90deg ) translateZ( 100px ); }

3、关于3d transform，设置perspective值可以形成静态的3d视觉效果，而如果需要动态的3d交互效果，则需要再在外包裹一层设置`transform-style:preserve-3d`

4、可使用`transform:tranlateZ(0)`启动3d加速

5、skew没有3d的，而rotate3d的时候是四个参数（如：`transform:rotate3d(3,1,0,10deg)`），前三个分别为x、y、z倍率，最后一个为角度基数，旋转的角度为响应的倍率乘以角度基数

6、[Advanced CSS3 2D and 3D Transform Techniques](http://www.sitepoint.com/advanced-css3-2d-and-3d-transform-techniques/)

7、[CSS 3D transforms](http://desandro.github.io/3dtransforms/)


## 动画

webkit前缀的浏览器一开始不支持伪元素before和after的动画

关于动画加速，以后将可以使用[will change](https://dev.opera.com/articles/css-will-change-property/)，现在一般开启3d加速

### [transition](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions)

1、以前`background`是不能作为`transition-property`的，如果要运动，可以考虑改变background-position的位置

2、关于步骤动画，可以使用`transition-timing-function`的step函数

3、关于hover动画，定义在选择器中和定义在选择器hover状态时是不同的

4、当元素设置为`display:none;`时，需要先把元素设置为显示状态，然后在回调函数中使用transition动画。直接从none到显示的时候是会忽略transition动画的。如果使用jquery可以使用animate的属性中设置`display:block;`回调函数再添加属性变化的class

    $(ele).animate({'display':'block'},300,function(){$(this).addClass('ele-transition')})

5、[All you need to know about CSS Transitions](http://blog.alexmaccaw.com/css-transitions)

### animation

1、[CSS3动画帧数科学计算法](http://tid.tenpay.com/?p=5983)

2、[Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations)

3、[animatable](http://leaverou.github.io/animatable/)

3、`animation-fill-mode`可以设置动画结束在哪个状态


## [flex](http://www.w3cplus.com/blog/666.html)

因为flex既可以设置横向布局，也可以设置纵向，所以一般不用x，y轴来标识对齐方式，而是用主轴和次轴

1、uc浏览器的等分会根据本身宽度变化，所以不可靠（如导航的等分，如果每个item都是4个文字，而有一个是6个，那么6个宽度会大点）

2、低端浏览器不支持flex子元素设置width

3、设置flex布局后，如果某个直接子元素设置绝对定位，可能会参与flex的布局

4、第一版本不支持子元素单独设置对齐方式

5、flex布局的性能不是很好

6、flex属性目前三个值兼容性不好

## object-fit/object-position

- [Object-fit/Object-position](http://www.w3cplus.com/css3/css3-object-fit-and-object-position-properties.html)（中文）
- [object-fit/object-position](https://docs.webplatform.org/wiki/css/properties/object-fit)

## mask

- [CSS Masking](http://www.html5rocks.com/en/tutorials/masking/adobe/)
- [CSS Masks – How To Use Masking In CSS Now](http://thenittygritty.co/css-masking)
- [mask reference](http://ued.ctrip.com/blog/wp-content/webkitcss/index.html)

## multi-column

这个文本排列使用情况比较少，最简单的就是你得保证能在一屏显示，如果超出一屏，则会影响体验

[Using CSS multi-column layouts](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_multi-column_layouts)

## media queries

[CSS media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries)

windows版本的dash 
https://velocity.silverlakesoftware.com

http://www.cutterman.cn/
http://css3ps.com/Download/


### svg

先通过svg turorial了解下怎么去创建常见的svg图形，然后理解下svg的viewport，再实战于图标，最后制作个svg线性小动画

- [SVG Tutorial](http://tutorials.jenkov.com/svg/rect-element.html)
- [理解SVG的viewport,viewBox,preserveAspectRatio](http://www.zhangxinxu.com/wordpress/2014/08/svg-viewport-viewbox-preserveaspectratio/)
- [SVG `symbol` a Good Choice for Icons](https://css-tricks.com/svg-symbol-good-choice-icons/)
- [使用SVG中的Symbol元素制作Icon](http://isux.tencent.com/16292.html)
- [Using SVG stroke Attributes](http://jonibologna.com/using-svg-stroke-attributes/)
- [How SVG Line Animation Works](https://css-tricks.com/svg-line-animation-works/)

更多参考资料：[A Compendium of SVG Information](https://css-tricks.com/mega-list-svg-information/)






    

    

