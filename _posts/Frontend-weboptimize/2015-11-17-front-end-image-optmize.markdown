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
| bpg | 不支持 |不支持| 有损 | 所有 | 由画质决定 | 所有通用场景, 渐进式加载 |

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


- **apng**


- **sharp-p**


- **bpg**



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
[https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization?hl=zh-cn]