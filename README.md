# Markdown Export Helper

A powerful and elegant Chrome extension that allows you to paste Markdown text and export it as a beautiful long image, PDF, or clean HTML file with just one click. It supports theme switching, history tracking, and offers a premium user experience.

---

[中文说明](#markdown-导出助手)

## ✨ Features

- **Instant Preview**: Real-time rendering of Markdown text into a visual HTML structure within the extension.
- **Multiple Export Formats**: 
  - **Long Image (PNG)**: Export the rendered content as a single, high-quality PNG image.
  - **PDF Document**: Generate a PDF file from the rendered content, with proper pagination for longer text.
  - **Styled HTML**: Export a self-contained HTML file with your chosen theme (light or dark).
  - **Raw Markdown**: Save the original Markdown text as a `.md` file.
- **Dual-Theme Mode**: Switch between a clean **Light Mode** and an eye-friendly **Dark Mode**. The exported files will reflect your chosen theme.
- **Automatic History**: Automatically saves the last 20 exported contents. You can view, restore, or clear your history at any time.
- **Smart Loading**: 
  - Loads the latest history record upon opening.
  - If history is empty, it attempts to read and display content from your clipboard.
- **Elegant & Modern UI**: A carefully designed interface with a focus on user experience, featuring a card-style layout and premium aesthetics.
  - **Modern Notifications**: Sleek notification system with animations and different message types
  - **Improved Dark Mode**: Complete dark mode experience with proper code block highlighting
  - **Enhanced Interactions**: Smooth transitions, button animations, and intuitive controls

## 🚀 Installation

### From Chrome Web Store (Recommended)

1. Visit the Chrome Web Store page (link to be added).
2. Click "Add to Chrome".

### Manual Installation (Developer Mode)

1. Download or clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the project folder.

## 🔧 How to Use

1. Click the extension icon in the Chrome toolbar to open the popup panel.
2. The extension will automatically load your latest work. You can also paste new Markdown text into the input area.
3. The preview area will instantly show the rendered result.
4. Use the toggle switch to change between light and dark themes.
5. Click the "History" button to view and restore previous versions.
6. Click your desired export button (`Export as Image`, `Export as PDF`, `Export HTML`, or `Export MD`) to download the file.

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript
- **Markdown Parsing**: [markdown-it](https://github.com/markdown-it/markdown-it)
- **HTML to Image**: [html2canvas](https://github.com/niklasvh/html2canvas)
- **HTML to PDF**: [jsPDF](https://github.com/parallax/jsPDF)
- **Security**: [DOMPurify](https://github.com/cure53/DOMPurify)
- **Styling**: [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) for themes.

## 🆕 What's New (July 2025)

- **Modern UI**: Complete UI overhaul with improved layout and aesthetics
- **Enhanced Notifications**: New notification system with different status types and animations
- **Fixed Dark Mode**: Improved dark mode with proper code block styling
- **Smooth Animations**: Added transition effects and animations throughout the interface
- **Improved History Management**: Enhanced history management with individual record deletion

---

# Markdown 导出助手

一款功能强大、设计优雅的 Chrome 浏览器插件，允许您粘贴 Markdown 文本，并一键导出为精美的长图、PDF 或干净的 HTML 文件。它支持主题切换、历史记录，并提供高级的用户体验。

## ✨ 功能特性

- **实时预览**: 在插件内部实时将 Markdown 文本解析为可视化 HTML 结构。
- **多种导出格式**: 
  - **长图 (PNG)**: 将渲染后的内容导出为一张高质量的 PNG 图片。
  - **PDF 文档**: 将渲染后的内容生成 PDF 文件，并为长文本提供自动分页。
  - **带样式的 HTML**: 导出一个包含您所选主题（亮色或暗色）的独立 HTML 文件。
  - **纯文本 Markdown**: 将原始的 Markdown 文本保存为 `.md` 文件。
- **双主题模式**: 可在清爽的 **亮色模式** 和护眼的 **暗色模式** 之间自由切换。导出的文件也会应用您选择的主题。
- **自动历史记录**: 自动保存最近 20 次导出的内容。您可以随时查看、恢复或清空您的历史记录。
- **智能加载**: 
  - 打开时自动加载最新的历史记录。
  - 如果历史记录为空，则尝试从剪贴板读取并展示内容。
- **优雅与现代化的界面**: 精心设计的用户界面，注重用户体验，采用卡片式布局和高级感的美学设计。
  - **现代通知系统**: 优雅的通知组件，带有动画和不同类型的状态提示
  - **优化的暗黑模式**: 完善的暗黑模式体验，代码块正确适配暗色主题
  - **增强的交互体验**: 平滑过渡、按钮动效和直观的操作控件

## 🚀 安装方法

### 从 Chrome 应用商店安装 (推荐)

1. 访问 Chrome 应用商店页面（链接待补充）。
2. 点击"添加到Chrome"按钮

### 开发者模式安装

1. 下载本项目代码
2. 打开Chrome浏览器，进入扩展程序页面（chrome://extensions/）
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目文件夹

## 🔧 使用指南

1. 点击 Chrome 工具栏中的插件图标，打开弹出面板
2. 插件会自动加载您最近一次的作品，您也可以在输入区粘贴新的 Markdown 文本
3. 预览区会即时展示渲染效果
4. 使用右上角的切换开关来改变亮色/暗色主题
5. 点击"历史记录"按钮来查看和恢复之前的版本
6. 点击您需要的导出按钮（`导出为长图`、`导出为PDF`、`导出HTML` 或 `导出MD`）来下载文件

## 🛠️ 技术栈

- **核心**: 原生 JavaScript
- **Markdown 解析**: [markdown-it](https://github.com/markdown-it/markdown-it)
- **HTML 转图片**: [html2canvas](https://github.com/niklasvh/html2canvas)
- **HTML 转 PDF**: [jsPDF](https://github.com/parallax/jsPDF)
- **安全处理**: [DOMPurify](https://github.com/cure53/DOMPurify)
- **样式**: [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) 用于主题渲染。

## 🆕 最新更新 (2025年7月)

- **现代化界面**: 完全重新设计的用户界面，改进布局和美学
- **增强通知系统**: 全新的通知组件，支持不同状态类型和动画效果
- **修复暗黑模式**: 改进的暗黑模式，修复代码块样式问题
- **平滑动画**: 在整个界面中添加了过渡效果和动画
- **历史记录管理优化**: 增强的历史记录管理，支持单条记录删除

## 注意事项

- 导出大型文档可能需要较长时间，请耐心等待
- 导出图片时，请确保所有图片资源已加载完成
- 部分复杂的Markdown语法可能无法完全支持

## 许可证

MIT 