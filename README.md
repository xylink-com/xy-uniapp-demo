# xy-uniapp-demo

小程序 SDK Uni App UI 框架测试 Demo

## 准备
1. 安装依赖

```bash
$ yarn
```
2. 将@xylink/xy-mp-sdk复制到src/wxcomponents, 具体可参考uni-app官网[小程序自定义组件支持](https://zh.uniapp.dcloud.io/tutorial/miniprogram-subject.html#)

```bash
$ yarn copy
```
3. 将src/wxcomponents/@xylink/xy-mp-sdk 转换为 ES 模块, 在vite.config.js中配置

```bash

import commonjs from '@rollup/plugin-commonjs';

const extensions = ['.js'];

export default defineConfig({
  plugins: [
    uni(),
    // 将CommonJS转换为ES模块
    commonjs({
      extensions,
    }),
  ]
});

```
4. 在pages.json中配置usingComponents，建议将其配置在globalStyle中

```bash

"usingComponents": {
    "xylink-room": "/wxcomponents/@xylink/xy-mp-sdk/package/component/index"
 }

```

## 开发

```bash
$ yarn dev
```

启动后，会在更目录生成 `dist/dev/mp-weixin` 目录，使用微信开发工具打开即可；

## 构建

```bash
$ yarn build
```

## 文档

查看[API 文档](https://openapi.xylink.com/common/meeting/api/description?platform=miniprogram)介绍；

## 运行

在开始之前，请确认您已经完成相应的[准备工作](https://openapi.xylink.com/common/meeting/doc/ready_work?platform=miniprogram)。

查看[快速跑通 Demo](https://openapi.xylink.com/common/meeting/doc/run_demo?platform=miniprogram) 介绍；
