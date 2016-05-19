---
layout: post
title:  "【原译】解开面条代码: 怎样书写可维护JavaScript"
date: 2016-05-19
author: ouven
tags: 可维护代码
categories: article-translation
cover: "assets/category/type-javascript.png"
---

### 【原译】怎样书写可维护JavaScript

&emsp;&emsp;几乎每个开发者都有接手维护遗留项目的经历，或者说是一个就的项目想继续做起来。通常第一反应是它们抛开代码规范基础，开始乱写。这样代码会很乱，不可理解，并且别人可能要花费好几天去读懂代码。但是，如果结合正确的规划、分析、和一个好的工作流，那就有可能把一个面条式的代码仓库整理成一个整洁、有组织并易扩展的一份项目代码。

&emsp;&emsp;我曾经不得不接手并整理很多的项目。但还没有很多开始就很乱的。实际上，最近就遇到了一个这样的情况。我已经学会了关于JavaScript代码组织的知识，最重要的是，在前一个项目开发中几乎疯掉。在这篇文章中我想分享下我的步骤和我的经验。

### 分析项目

&emsp;&emsp;最开始的一步是看一下到底怎么回事。如果是个网站，点击网站所有的功能：打开对话框、发送表单等等。做这些的同时，打开开发者工具，看下是否报错或输出日志。如果是个nodejs项目，打开命令行接口过一下api，最好的情况是项目有一个入口(例如main.js，index.js，app.js)，通过入口能将所有的模块初始化；或者最坏的情况，找到整个业务逻辑的位置。

&emsp;&emsp;


原文作者：Moritz Kröger

原译：ouven

原文地址： https://www.sitepoint.com/write-maintainable-javascript/

