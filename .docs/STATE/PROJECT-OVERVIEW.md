# 项目概览 - 状态基线

## 项目基本信息

**项目名称**: MarkdownExportHelper  
**项目类型**: Chrome 浏览器扩展  
**许可证**: Apache License 2.0  
**开发语言**: 原生 JavaScript  
**目标平台**: Chrome 浏览器  

## 核心功能

### 1. 实时预览
- 实时渲染 Markdown 为 HTML
- 支持 GitHub 风格的 Markdown 语法
- 即时预览编辑效果

### 2. 多格式导出
- **长图导出**: 将 Markdown 内容导出为 PNG 长图
- **PDF 导出**: 生成包含样式的 PDF 文档
- **Word 导出**: 导出为 .docx 格式的 Word 文档（基于 html-docx-js，支持高质量格式还原）
- **HTML 导出**: 导出为独立的 HTML 文件
- **原始 MD 导出**: 保存为 Markdown 源文件

### 3. 用户体验功能
- **双主题模式**: 支持亮色和暗色主题切换
- **历史记录**: 自动保存最近 20 条记录
- **智能加载**: 优先加载最新历史记录，若无历史则尝试读取剪贴板
- **多语言支持**: 支持中文、英文、法语等多种语言

## 技术架构

### 前端架构
- **无框架设计**: 使用原生 JavaScript，不依赖任何前端框架
- **模块化组织**: 按功能模块组织代码结构
- **响应式设计**: 适配不同屏幕尺寸

### 核心依赖库
- **markdown-it**: Markdown 解析和渲染
- **docx**: Word 文档生成功能
- **html2canvas**: HTML 转图片功能
- **jsPDF**: HTML 转 PDF 功能
- **DOMPurify**: 安全处理 HTML 内容
- **github-markdown-css**: GitHub 风格的 Markdown 主题

### 扩展架构
- **Manifest V3**: 使用最新的 Chrome 扩展清单格式
- **Popup 界面**: 主要用户交互界面
- **权限管理**: 最小化权限需求

## 文件结构基线

```
MarkdownExportHelper/
├── css/                    # 样式文件
│   ├── github-markdown-dark.min.css
│   ├── github-markdown-light.min.css
│   └── styles.css
├── images/                 # 图标资源
│   ├── icon_generator.html
│   ├── icon128.png
│   ├── icon16.png
│   └── icon48.png
├── js/                     # 核心 JavaScript
│   ├── popup.js           # 主要逻辑
│   └── translations.js    # 多语言支持
├── lib/                    # 第三方库
│   ├── html2canvas.min.js
│   ├── jspdf.umd.min.js
│   ├── markdown-it.min.js
│   ├── docx.min.js
│   └── purify.min.js
├── manifest.json          # 扩展配置
├── popup.html             # 主界面
├── LICENSE                # Apache License 2.0
└── README.md              # 项目说明
```

## 许可证信息

### 主项目许可证
- **许可证类型**: Apache License 2.0
- **版权声明**: 项目使用 Apache License 2.0 许可证

### 第三方库许可证
- **jsPDF**: MIT 许可证
- **marked.js**: MIT 许可证
- **html2canvas**: MIT 许可证
- **DOMPurify**: Apache License 2.0
- **github-markdown-css**: MIT 许可证

## 开发状态

**当前版本**: 1.0.0  
**维护状态**: 活跃维护  
**最后更新**: 2025-07-04  

---

*文档状态: 基线已建立*  
*维护者: AI 开发伙伴*  
*下次审查: 功能变更时* 