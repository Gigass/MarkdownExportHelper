# 文件结构 - 状态基线

## 基本信息

**创建日期**: 2024-12-19  
**最后更新**: 2024-12-19  
**维护者**: AI 开发伙伴  

## 项目根目录结构

```
MarkdownExportHelper/
├── .docs/                    # 共享大脑 - 项目文档系统
│   ├── README-DOCS.md       # 文档系统说明
│   ├── STATE/               # 事实基线
│   │   ├── PROJECT-OVERVIEW.md
│   │   ├── TECH-STACK.md
│   │   ├── FILE-STRUCTURE.md
│   │   └── LICENSE-INFO.md
│   ├── PROCESS/             # 过程流水
│   │   ├── TEMPLATES/       # 文档模板
│   │   │   └── task-status-template.md
│   │   └── PROPOSALS/       # 功能提案
│   ├── RULES/               # 开发规则
│   │   ├── LR-001.md        # 许可证一致性规则
│   │   ├── LR-002.md        # 代码质量规则
│   │   └── LR-003.md        # 文档维护规则
│   └── TEMP/                # 临时状态
├── css/                     # 样式文件
│   ├── github-markdown-dark.min.css   # 暗色主题
│   ├── github-markdown-light.min.css  # 亮色主题
│   └── styles.css           # 自定义样式
├── images/                  # 图标资源
│   ├── icon_generator.html  # 图标生成器
│   ├── icon128.png          # 128x128 图标
│   ├── icon16.png           # 16x16 图标
│   └── icon48.png           # 48x48 图标
├── js/                      # 核心 JavaScript
│   ├── popup.js             # 主要逻辑
│   └── translations.js      # 多语言支持
├── lib/                     # 第三方库
│   ├── html2canvas.min.js   # HTML 转图片
│   ├── jspdf.umd.min.js     # HTML 转 PDF
│   ├── marked.min.js        # Markdown 解析
│   └── purify.min.js        # 安全处理
├── manifest.json            # Chrome 扩展配置
├── popup.html               # 主界面
├── LICENSE                  # Apache License 2.0
└── README.md                # 项目说明
```

## 文件职责说明

### .docs/ - 共享大脑系统
**目的**: 项目的"共享大脑"，包含所有项目知识、规则和状态

#### STATE/ - 事实基线
- **PROJECT-OVERVIEW.md**: 项目整体架构和功能描述
- **TECH-STACK.md**: 技术栈和依赖库说明
- **FILE-STRUCTURE.md**: 文件结构基线（本文件）
- **LICENSE-INFO.md**: 许可证信息基线

#### PROCESS/ - 过程流水
- **TEMPLATES/**: 存放各种文档模板
- **PROPOSALS/**: 存放功能提案和架构变更建议

#### RULES/ - 开发规则
- **LR-001.md**: 许可证一致性规则
- **LR-002.md**: 代码质量规则
- **LR-003.md**: 文档维护规则

#### TEMP/ - 临时状态
- 存放任务执行过程中的临时状态文件

### css/ - 样式文件
**目的**: 存放所有样式相关的文件

- **github-markdown-dark.min.css**: GitHub 风格的暗色主题
- **github-markdown-light.min.css**: GitHub 风格的亮色主题
- **styles.css**: 项目自定义样式

### images/ - 图标资源
**目的**: 存放扩展的图标和图标生成工具

- **icon_generator.html**: 用于生成不同尺寸图标的工具
- **icon128.png**: 128x128 像素的扩展图标
- **icon16.png**: 16x16 像素的扩展图标
- **icon48.png**: 48x48 像素的扩展图标

### js/ - 核心 JavaScript
**目的**: 存放项目的核心 JavaScript 代码

- **popup.js**: 扩展的主要逻辑，包含所有核心功能
- **translations.js**: 多语言支持，包含中文、英文、法语等翻译

### lib/ - 第三方库
**目的**: 存放项目依赖的第三方 JavaScript 库

- **html2canvas.min.js**: 用于将 HTML 元素转换为图片
- **jspdf.umd.min.js**: 用于生成 PDF 文档
- **marked.min.js**: 用于解析和渲染 Markdown
- **purify.min.js**: 用于安全处理 HTML 内容

### 根目录文件
**目的**: 项目的配置和说明文件

- **manifest.json**: Chrome 扩展的配置文件，定义扩展的基本信息和权限
- **popup.html**: 扩展的主界面 HTML 文件
- **LICENSE**: Apache License 2.0 许可证文件
- **README.md**: 项目的说明文档

## 文件依赖关系

### 加载依赖
```
popup.html
├── css/
│   ├── github-markdown-light.min.css  # 基础主题样式
│   ├── github-markdown-dark.min.css   # 主题切换样式
│   └── styles.css                     # 自定义样式覆盖
├── js/
│   ├── translations.js                # 语言支持（优先加载）
│   └── popup.js                       # 主要逻辑（最后加载）
└── lib/
    ├── marked.min.js                  # Markdown 解析
    ├── purify.min.js                  # 安全处理
    ├── html2canvas.min.js             # 图片转换
    └── jspdf.umd.min.js               # PDF 生成
```

### 功能依赖
- **popup.js** 依赖所有 lib/ 下的库文件
- **translations.js** 被 popup.js 引用
- **styles.css** 覆盖主题样式
- **manifest.json** 定义扩展的基本信息

## 文件命名规范

### 目录命名
- 使用小写字母和连字符
- 避免使用空格和特殊字符
- 使用有意义的描述性名称

### 文件命名
- **JavaScript**: 使用 camelCase 或 kebab-case
- **CSS**: 使用 kebab-case
- **HTML**: 使用 kebab-case
- **图片**: 使用描述性名称 + 尺寸
- **文档**: 使用 Pascal-Case 或 kebab-case

## 维护要求

### 新增文件
- 新文件必须符合命名规范
- 必须更新本文件结构文档
- 必须说明文件的用途和依赖关系

### 删除文件
- 删除前必须确认无其他文件依赖
- 必须更新本文件结构文档
- 必须清理相关的引用

### 重命名文件
- 必须同时更新所有相关引用
- 必须更新本文件结构文档
- 必须保持向后兼容性

## 版本控制

### Git 忽略规则
- `.DS_Store`: macOS 系统文件
- `node_modules/`: 如果未来使用 npm
- `.env`: 环境变量文件
- `*.log`: 日志文件

### 提交规范
- 文件结构变更必须更新本文档
- 提交信息必须清晰描述变更内容
- 重大变更需要创建提案文档

---

*文档状态: 基线已建立*  
*维护者: AI 开发伙伴*  
*下次审查: 文件结构变更时* 