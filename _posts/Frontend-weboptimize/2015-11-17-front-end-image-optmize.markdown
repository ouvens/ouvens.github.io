---
layout: post
title:  "前端优化--前端图片优化"
date:   2015-11-17
author: ouven
tags: 前端优化 图片优化
categories: frontend-weboptimize
cover:  "assets/category/type-javascript.png"
---


### 前端图片优化

60%的网站流量来自图片，图片优化可以大幅影响网站流量。

#### 一、现有web图片格式
| 图片格式 | 支持透明 | 动画支持 | 压缩方式 | 浏览器支持 | 相对原图大小 | 适应场景 |
|----|----|-----|----|-----|-----|-----|
| baseline-jpeg | 不支持 |不支持| 有损 | 所有 | 由画质决定 | 所有通用场景 |
| progressive-jpeg | 不支持 |不支持| 有损 | 所有 | 由画质决定 | 所有通用场景, 渐进式加载 |
| gif | 支持 |支持| 无损 | 所有 | 由帧数和每帧图片大小决定 | 简单颜色，动画 |
| png | 支持 |不支持| 无损 | 所有 | 由png色值位数决定 | 需要透明时 |
| webp | 支持 | 不支持| 有损 | Chrome、Opera | 由压缩率决定 | 复杂颜色及形状，浏览器平台可预知 |
| apng | 支持 |支持| 无损 | Firefox、Safari、iOS Safari | 由每帧图片决定 | 需要半透明效果的动画 |
| svg | 支持 |支持| 无损 | 所有(IE8以上) | 由内容和特效复杂度决定 | 简单图形，需要良好的放缩体验，需要动态控制图片特效 |
| sharp-p | 不支持 |不支持| 有损 | 所有 | 由画质决定 | 所有通用场景, 渐进式加载 |
| bpg | 支持 | 支持| 有损 | 不支持，需要js解码 | 由画质决定 | jpeg上需要极限优化的场景 |

#### 几种文件格式的特点
- **baseline-jpeg**
    这种类型的JPEG文件存储方式是按从上到下的扫描方式，把每一行顺序的保存在JPEG文件中。打开这个文件显示它的内容时，数据将按照存储时的顺序从上到下一行一行的被显示出来，直到所有的数据都被读完，就完成了整张图片的显示。如果文件较大或者网络下载速度较慢，那么就会看到图片被一行行加载的效果，这种格式的JPEG没有什么优点，因此，一般都推荐使用Progressive JPEG
    
- **preogressive-jpeg**
    和Baseline一遍扫描不同，Progressive JPEG文件包含多次扫描，这些扫描顺寻的存储在JPEG文件中。打开文件过程中，会先显示整个图片的模糊轮廓，随着扫描次数的增加，图片变得越来越清晰。这种格式的主要优点是在网络较慢的情况下，可以看到图片的轮廓知道正在加载的图片大概是什么。
    __这两种jpeg格式文件的效果对比如下：
    
    ![](http://7tszky.com1.z0.glb.clouddn.com/Fo8q3huYFyQma_rsSvo28dUyd7mN)

- **gif**
    GIF(Graphics Interchange Format)的原义是“图像互换格式”，GIF文件的数据，是一种基于LZW算法(串表压缩算法)连续色调的无损压缩格式。是目前web网页中十分常用的一种动画文件格式。

- **png**
    png文件分为png8(8位透明png)、png24(256色png)、png32(多阶透明png)，png的有点在于使用位图实现web上的透明图片，以实现比较好的体验。
    ![](http://7tszky.com1.z0.glb.clouddn.com/FnRWuq6-ElyEqZIw0MrUiXaSL3e7)

- **webp**

    目前移动端Android4.0以上、PC端chorme 10+（14 ~ 16 有渲染bug）、opera 11+ 、safri均支持webp格式图片。
    WEBP与JPG相比较，编码速度慢10倍，解码速度慢1.5倍，而绝大部分的网络应用中，图片都是静态文件，所以对于用户使用只需要关心解码速度即可。但实际上，webp虽然会增加额外的解码时间，但是由于减少了文件体积，缩短了加载的时间，实际上文件的渲染速度反而变快了。
    
    [图片加载测试样例](http://www.webpagetest.org/video/view.php?id=130125_7b15e676f5fa0b736f247ff0ed36517e64d9c9ea)


    webp上目前可行的应用场景：
    - 1.客户端软件，内嵌了基于Chromium的webview，这类浏览器中应用的网页是可以完全使用webp格式，提升加载渲染速度，不考虑兼容。
    - 2.用node-webkit开发的程序，用webp可以减少文件包的体积。
    - 3.移动应用 或 网页游戏 ,界面需要大量图片,可以嵌入webp的解码包,能够节省用户流量，提升访问速度
- **apng**

    简单来讲apng格式图片使用多个单张png连接起来的动画图片格式，支持全透明通道动画。相比于gif动画，没有毛刺，质量更高，但目前支持的浏览器并不完全。可以去can i use查看其兼容性。


- **sharp-p**


- **bpg**

    http://bellard.org/bpg/
    [图片画质比较](http://xooyoozoo.github.io/yolo-octo-bugfixes/#avenches&bpg=s&bpg=s)
    
    BPG (Better Portable Graphics) 是一个新的图片格式。用来代替jpeg和webp的方案。这种格式主要有以下特点
    优势：
    - 高压缩比。在画质相同的情况下比jpeg小的多
    - 使用一个很小的js解码器就可以被浏览器支持
    - 基于高清视频压缩标准 (HEVC) 一个子集开发 
    - 支持和jpeg相同的色值，并且在有损压缩的通知支持透明，
    - 单通道支持8到14位色值区域
    - 支持有损压缩
    - 可以添加更多的元数据编码
    - 支持动画
    - 相近画质前提下比webp更小

    性能：
    - 根据mozilla的研究，bpg使用的HEVC编码比原生的HEVC性能更好，因为BPG的头部比HEVC的头部更小
    - 支持4:2:2和4:2:0的色值设置
    - BPG可以用于硬件上支持HEVC编解码器

    这种图片格式目前还没有被浏览器支持，需要js解码，但其优势非常明显
    
#### 二、前端的图片优化方案
1. 使用base64编码代替图片
    
2. 合并图片sprite

3. 使用css、svg或iconfont代替图片

4. 压缩图片 

5. 响应式图片

6. 选择图片尺寸

7. canvas动画

#### 三、图片压缩
压缩图片方式

#### 四、图片格式

#### 五、小结
[google image rearch 连接](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization?hl=zh-cn)