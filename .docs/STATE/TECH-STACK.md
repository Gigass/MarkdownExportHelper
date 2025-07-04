# 技术栈 - 状态基线

## 核心技术栈

### 开发语言
- **JavaScript**: 原生 JavaScript (ES6+)
- **HTML5**: 语义化 HTML 结构
- **CSS3**: 现代 CSS 特性，包括 Flexbox 和 Grid

### 浏览器扩展技术
- **Chrome Extension API**: 使用 Manifest V3
- **Popup 架构**: 基于 popup.html 的用户界面
- **本地存储**: Chrome Storage API 用于历史记录

## 核心依赖库

### Markdown 处理
- **marked.js** (v4.0.0+)
  - **用途**: Markdown 解析和渲染
  - **许可证**: MIT
  - **功能**: 将 Markdown 文本转换为 HTML
  - **集成方式**: 通过 `<script>` 标签引入

### 文档转换
- **html2canvas** (v1.4.0+)
  - **用途**: HTML 转图片功能
  - **许可证**: MIT
  - **功能**: 将 HTML 元素渲染为 Canvas，支持长图生成
  - **集成方式**: 通过 `<script>` 标签引入

- **jsPDF** (v2.5.0+)
  - **用途**: HTML 转 PDF 功能
  - **许可证**: MIT
  - **功能**: 生成包含样式的 PDF 文档
  - **集成方式**: 通过 `<script>` 标签引入

### 安全处理
- **DOMPurify** (v3.0.0+)
  - **用途**: HTML 内容安全处理
  - **许可证**: Apache License 2.0
  - **功能**: 清理和净化 HTML 内容，防止 XSS 攻击
  - **集成方式**: 通过 `<script>` 标签引入

### 样式主题
- **github-markdown-css** (v5.0.0+)
  - **用途**: GitHub 风格的 Markdown 主题
  - **许可证**: MIT
  - **功能**: 提供亮色和暗色两种主题样式
  - **集成方式**: 通过 CSS 文件引入

## 文件依赖关系

### 核心文件依赖
```
popup.html
├── css/
│   ├── github-markdown-light.min.css  # 亮色主题
│   ├── github-markdown-dark.min.css   # 暗色主题
│   └── styles.css                     # 自定义样式
├── js/
│   ├── popup.js                       # 主要逻辑
│   └── translations.js                # 多语言支持
└── lib/
    ├── marked.min.js                  # Markdown 解析
    ├── html2canvas.min.js             # HTML 转图片
    ├── jspdf.umd.min.js               # HTML 转 PDF
    └── purify.min.js                  # 安全处理
```

### 加载顺序
1. **基础样式**: github-markdown-css 主题文件
2. **自定义样式**: styles.css
3. **核心库**: marked.js, DOMPurify
4. **转换库**: html2canvas, jsPDF
5. **应用逻辑**: translations.js, popup.js

## 浏览器兼容性

### 最低要求
- **Chrome**: 版本 88+ (支持 Manifest V3)
- **JavaScript**: ES6+ 支持
- **CSS**: Flexbox 和 Grid 支持

### 推荐配置
- **Chrome**: 版本 100+
- **内存**: 至少 512MB 可用内存
- **存储**: 至少 100MB 可用空间

## 性能考虑

### 优化策略
- **库文件压缩**: 所有第三方库使用 minified 版本
- **按需加载**: 转换功能按需初始化
- **内存管理**: 及时清理大型对象引用
- **缓存策略**: 历史记录使用本地存储

### 资源使用
- **初始加载**: ~500KB (压缩后)
- **运行时内存**: ~50-100MB (取决于内容大小)
- **存储空间**: ~1-10MB (历史记录)

## 安全考虑

### XSS 防护
- 使用 DOMPurify 清理所有用户输入
- 限制 HTML 标签和属性白名单
- 避免使用 `innerHTML` 直接插入内容

### 权限最小化
- 仅请求必要的 Chrome 扩展权限
- 不访问敏感的用户数据
- 本地处理，不上传用户内容

---

*文档状态: 基线已建立*  
*维护者: AI 开发伙伴*  
*下次审查: 依赖库更新时* 