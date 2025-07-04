document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const markdownInput = document.getElementById('markdown-input');
  const previewContainer = document.getElementById('preview-container');
  const pasteButton = document.getElementById('paste-button');
  const clearButton = document.getElementById('clear-button');
  const exportImageButton = document.getElementById('export-image');
  const exportPdfButton = document.getElementById('export-pdf');
  const exportWordButton = document.getElementById('export-word');
  const exportHtmlButton = document.getElementById('export-html');
  const exportMdButton = document.getElementById('export-md');
  const loadingElement = document.getElementById('loading');
  const notificationContainer = document.getElementById('notification-container');
  const themeToggle = document.getElementById('theme-toggle');
  const themeStyle = document.getElementById('theme-style');
  const bodyEl = document.body;
  const languageSelect = document.getElementById('language-select');
  // History Elements
  const historyBtn = document.getElementById('history-btn');
  const historyModal = document.getElementById('history-modal');
  const closeHistoryModalBtn = document.getElementById('close-history-modal');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  // 强制隐藏loading，防止初始显示
  loadingElement.classList.add('hidden');

  // 初始化语言
  let currentLang = localStorage.getItem('language') || 'zh';
  languageSelect.value = currentLang;

  // 更新UI文本
  function updateUIText() {
    document.querySelector('h1').textContent = translations[currentLang].title;
    document.querySelector('.input-header h2').textContent = translations[currentLang].input;
    document.querySelector('.preview-section h2').textContent = translations[currentLang].preview;
    
    // 更新操作按钮文本
    document.querySelector('#paste-button .action-text').textContent = translations[currentLang].paste;
    document.querySelector('#clear-button .action-text').textContent = translations[currentLang].clear;
    document.querySelector('#history-btn .action-text').textContent = translations[currentLang].history;
    
    exportImageButton.textContent = translations[currentLang].exportImage;
    exportPdfButton.textContent = translations[currentLang].exportPdf;
    exportWordButton.textContent = translations[currentLang].exportWord;
    exportHtmlButton.textContent = translations[currentLang].exportHtml;
    exportMdButton.textContent = translations[currentLang].exportMd;
    document.querySelector('#loading p').textContent = translations[currentLang].loading;
    document.querySelector('.modal-header h2').textContent = translations[currentLang].history;
    clearHistoryBtn.textContent = translations[currentLang].clearHistory;
  }

  // 语言切换事件
  languageSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('language', currentLang);
    updateUIText();
  });

  // 初始化markdown-it配置
  const md = window.markdownit({
    breaks: true,
    html: true,
    linkify: true,
    typographer: true
  });

  // 实时预览功能
  markdownInput.addEventListener('input', renderMarkdown);

  // 从剪贴板粘贴
  pasteButton.addEventListener('click', () => pasteAndRenderFromClipboard(false));

  // 清空按钮
  clearButton.addEventListener('click', () => {
    markdownInput.value = '';
    renderMarkdown();
    localStorage.setItem('isCleared', 'true'); // Set the cleared state
    showNotification('内容已清空', 'success');
  });

  // 导出为长图
  exportImageButton.addEventListener('click', () => handleExport(exportAsImage));

  // 导出为PDF
  exportPdfButton.addEventListener('click', () => handleExport(exportAsPdf));

  // 导出为Word
  exportWordButton.addEventListener('click', () => handleExport(exportAsWord));

  // 导出为HTML
  exportHtmlButton.addEventListener('click', () => handleExport(exportAsHtml));

  // 导出为MD
  exportMdButton.addEventListener('click', () => handleExport(exportAsMd));

  // 主题切换
  themeToggle.addEventListener('change', () => {
    const isDark = themeToggle.checked;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme(isDark);
  });

  // History UI
  historyBtn.addEventListener('click', () => {
    loadHistory(); // Always reload history when opening the modal
    historyModal.classList.remove('hidden');
    setTimeout(() => historyModal.classList.add('visible'), 10);
  });
  
  closeHistoryModalBtn.addEventListener('click', () => {
    historyModal.classList.remove('visible');
    setTimeout(() => historyModal.classList.add('hidden'), 300);
  });
  
  clearHistoryBtn.addEventListener('click', handleClearHistory);

  // 初始化
  async function init() {
    loadingElement.classList.add('hidden');
    
    // 更新UI文本
    updateUIText();
    
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    // Check for cleared state first
    const isCleared = localStorage.getItem('isCleared');
    if (isCleared === 'true') {
      markdownInput.value = '';
      renderMarkdown();
      return;
    }

    // Load history and decide initial content
    const history = await loadHistory();
    if (history.length > 0) {
      markdownInput.value = history[0].content;
      renderMarkdown();
      showNotification('已加载上次内容', 'info');
    } else {
      pasteAndRenderFromClipboard(true);
    }
  }

  // 应用主题
  function applyTheme(isDark) {
    if (isDark) {
      themeStyle.href = 'css/github-markdown-dark.min.css';
      bodyEl.classList.add('dark-mode');
      themeToggle.checked = true;
    } else {
      themeStyle.href = 'css/github-markdown-light.min.css';
      bodyEl.classList.remove('dark-mode');
      themeToggle.checked = false;
    }
  }

  // 渲染Markdown为HTML
  function renderMarkdown() {
    const markdown = markdownInput.value;
    const html = DOMPurify.sanitize(md.render(markdown || ' ')); // Ensure not empty for parsing
    previewContainer.innerHTML = html;
  }

  // 从剪贴板读取内容并渲染
  async function pasteAndRenderFromClipboard(isSilent = false) {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        markdownInput.value = text;
        renderMarkdown();
        if (!isSilent) showNotification('已从剪贴板粘贴内容', 'success');
      } else if (!isSilent) {
        showNotification('剪贴板为空', 'warning');
      }
    } catch (error) {
      if (!isSilent) showNotification('无法读取剪贴板', 'error');
      console.error('剪贴板读取失败:', error);
    }
  }
  
  // 显示通知
  function showNotification(message, type = 'info', duration = 2000) {
    // 定义通知图标
    const icons = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    };
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.textContent = icons[type];
    
    const messageEl = document.createElement('span');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => {
      notification.classList.add('closing');
      setTimeout(() => notification.remove(), 300);
    });
    
    notificationContent.appendChild(icon);
    notificationContent.appendChild(messageEl);
    notification.appendChild(notificationContent);
    notification.appendChild(closeBtn);
    
    notificationContainer.appendChild(notification);
    
    // 自动消失
    setTimeout(() => {
      notification.classList.add('closing');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  // 显示/隐藏加载状态
  function showLoading(show) {
    if (show) {
      loadingElement.classList.remove('hidden');
    } else {
      loadingElement.classList.add('hidden');
    }
  }

  // 处理历史记录
  async function loadHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('markdownHistory')) || [];
      renderHistoryUI(history);
      return history;
    } catch (error) {
      console.error('加载历史记录失败:', error);
      return [];
    }
  }
  
  // 渲染历史记录UI
  function renderHistoryUI(history) {
    historyList.innerHTML = '';
    if (history.length === 0) {
      historyList.innerHTML = `<p class="empty-history">没有历史记录</p>`;
      return;
    }

    history.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'history-item';
      
      const itemName = document.createElement('span');
      itemName.className = 'item-name';
      // 优先使用item.title，兼容旧数据
      itemName.textContent = item.title || `记录 ${new Date(item.date).toLocaleString()}`;
      
      const itemDate = document.createElement('span');
      itemDate.className = 'item-date';
      itemDate.textContent = new Date(item.date).toLocaleString();
      
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      
      const restoreBtn = document.createElement('button');
      restoreBtn.textContent = translations[currentLang].restore || '恢复';
      restoreBtn.addEventListener('click', () => handleRestoreHistory(index));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = translations[currentLang].delete || '删除';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => handleDeleteHistory(index));
      
      actions.appendChild(restoreBtn);
      actions.appendChild(deleteBtn);
      
      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemDate);
      itemDiv.appendChild(actions);
      
      historyList.appendChild(itemDiv);
    });
  }
  
  // 处理恢复历史记录
  async function handleRestoreHistory(index) {
    try {
      const history = JSON.parse(localStorage.getItem('markdownHistory')) || [];
      if (history[index]) {
        markdownInput.value = history[index].content;
        renderMarkdown();
        historyModal.classList.remove('visible');
        setTimeout(() => historyModal.classList.add('hidden'), 300);
        showNotification('已恢复历史内容', 'success');
      }
    } catch (error) {
      console.error('恢复历史记录失败:', error);
      showNotification('恢复历史记录失败', 'error');
    }
  }
  
  // 处理删除历史记录
  async function handleDeleteHistory(index) {
    try {
      const history = JSON.parse(localStorage.getItem('markdownHistory')) || [];
      history.splice(index, 1);
      localStorage.setItem('markdownHistory', JSON.stringify(history));
      renderHistoryUI(history);
      showNotification('已删除历史记录', 'success');
    } catch (error) {
      console.error('删除历史记录失败:', error);
      showNotification('删除历史记录失败', 'error');
    }
  }
  
  // 处理清空历史记录
  async function handleClearHistory() {
    try {
      localStorage.removeItem('markdownHistory');
      renderHistoryUI([]);
      showNotification('已清空所有历史记录', 'success');
    } catch (error) {
      console.error('清空历史记录失败:', error);
      showNotification('清空历史记录失败', 'error');
    }
  }
  
  // 处理导出
  async function handleExport(exportFunc) {
    try {
      // 保存当前内容到历史记录
      await saveToHistory();
      
      // 执行导出
      await exportFunc();
    } catch (error) {
      console.error('导出失败:', error);
      showNotification('导出失败: ' + error.message, 'error');
      showLoading(false);
    }
  }
  
  // 保存到历史记录
  async function saveToHistory() {
    const content = markdownInput.value.trim();
    if (!content) return;

    try {
      const history = JSON.parse(localStorage.getItem('markdownHistory')) || [];
      const now = new Date();
      
      // 检查是否存在完全相同的记录
      const isDuplicate = history.some(item => item.content.trim() === content);
      if (isDuplicate) return;

      // 生成标题：取第一个非空行，并截断
      const firstLine = content.split('\n').find(line => line.trim() !== '');
      let title = firstLine ? firstLine.trim() : '无标题';
      if (title.length > 40) {
        title = title.substring(0, 40) + '...';
      }

      const newEntry = {
        title: title,
        content: content,
        date: now.toISOString(),
      };
      
      history.unshift(newEntry);
      
      // 限制最大记录数
      if (history.length > 10) {
        history.pop();
      }
      
      // 保存
      localStorage.setItem('markdownHistory', JSON.stringify(history));
      localStorage.removeItem('isCleared'); // Clear the cleared state
    } catch (error) {
      console.error('保存历史失败:', error);
    }
  }

  // 导出为长图
  async function exportAsImage() {
    if (!markdownInput.value.trim()) {
      showNotification('没有内容可导出', 'warning');
      return;
    }

    showLoading(true);

    try {
      // 创建一个临时容器，用于生成图片
      const tempContainer = document.createElement('div');
      tempContainer.className = 'preview-container-export markdown-body';
      
      // 获取当前主题状态
      const isDark = themeToggle.checked;
      
      // 设置容器样式
      tempContainer.style.width = '800px';
      tempContainer.style.padding = '40px';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      
      // 根据主题设置背景色和文本色
      if (isDark) {
        tempContainer.style.backgroundColor = '#0d1117';
        tempContainer.style.color = '#c9d1d9';
      } else {
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.color = '#24292f';
      }
      
      // 填充内容
      tempContainer.innerHTML = DOMPurify.sanitize(md.render(markdownInput.value));
      document.body.appendChild(tempContainer);
      
      // 使用html2canvas生成图片
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // 提高分辨率
        useCORS: true, // 允许跨域
        allowTaint: true, // 允许污染
        backgroundColor: isDark ? '#0d1117' : 'white'
      });
      
      // 移除临时容器
      document.body.removeChild(tempContainer);
      
      // 将Canvas转为图片
      const imgData = canvas.toDataURL('image/png');
      
      // 下载图片
      downloadFile(imgData, 'markdown_export.png');
      showNotification('图片已导出', 'success');
    } catch (error) {
      console.error('导出图片失败:', error);
      showNotification('导出图片失败', 'error');
    } finally {
      showLoading(false);
    }
  }

  // 导出为PDF
  async function exportAsPdf() {
    if (!markdownInput.value.trim()) {
      showNotification('没有内容可导出', 'warning');
      return;
    }

    showLoading(true);

    try {
      // 创建一个临时容器，用于生成PDF
      const tempContainer = document.createElement('div');
      tempContainer.className = 'preview-container-export markdown-body';
      
      // 获取当前主题状态
      const isDark = themeToggle.checked;
      
      // 设置容器样式
      tempContainer.style.width = '210mm'; // A4宽度
      tempContainer.style.padding = '20mm'; // 页面边距
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      
      // 根据主题设置背景色和文本色
      if (isDark) {
        tempContainer.style.backgroundColor = '#0d1117';
        tempContainer.style.color = '#c9d1d9';
      } else {
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.color = '#24292f';
      }
      
      // 填充内容
      tempContainer.innerHTML = DOMPurify.sanitize(md.render(markdownInput.value));
      document.body.appendChild(tempContainer);
      
      // 使用html2canvas生成图片
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // 提高分辨率
        useCORS: true, // 允许跨域
        allowTaint: true, // 允许污染
        backgroundColor: isDark ? '#0d1117' : 'white'
      });
      
      // 移除临时容器
      document.body.removeChild(tempContainer);
      
      // 计算PDF的宽度和高度
      const imgWidth = 210; // mm
      const pageHeight = 297; // mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      
      // 创建PDF文档
      const pdf = new window.jspdf.jsPDF('p', 'mm');
      let position = 0;
      
      // 将Canvas添加到PDF，如果内容超过一页则创建多页
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // 下载PDF文件
      pdf.save('markdown_export.pdf');
      showNotification('PDF已导出', 'success');
    } catch (error) {
      console.error('导出PDF失败:', error);
      showNotification('导出PDF失败', 'error');
    } finally {
      showLoading(false);
    }
  }

  // 导出为Word
  async function exportAsWord() {
    if (!markdownInput.value.trim()) {
      showNotification('没有内容可导出', 'warning');
      return;
    }

    showLoading(true);

    try {
      // 创建一个临时容器，用于生成Word文档
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = DOMPurify.sanitize(md.render(markdownInput.value));
      
      // 使用mammoth.js将HTML转换为Word文档
      const html = tempContainer.innerHTML;
      
      // 使用html-docx-js将HTML转换为Word文档
      const converted = window.htmlDocx.asBlob(html);
      
      // 下载Word文件
      downloadFile(converted, 'markdown_export.docx', true);
      showNotification('Word文档已导出', 'success');
    } catch (error) {
      console.error('导出Word失败:', error);
      showNotification('导出Word失败', 'error');
    } finally {
      showLoading(false);
    }
  }

  // 导出为Markdown文件
  function exportAsMd() {
    if (!markdownInput.value.trim()) {
      showNotification('没有内容可导出', 'warning');
      return;
    }

    try {
      // 创建一个Blob对象
      const blob = new Blob([markdownInput.value], { type: 'text/markdown' });
      
      // 下载文件
      downloadFile(blob, 'markdown_export.md', true);
      showNotification('Markdown文件已导出', 'success');
    } catch (error) {
      console.error('导出Markdown失败:', error);
      showNotification('导出Markdown失败', 'error');
    }
  }

  // 导出为HTML文件
  async function exportAsHtml() {
    if (!markdownInput.value.trim()) {
      showNotification('没有内容可导出', 'warning');
      return;
    }

    showLoading(true);

    try {
      // 获取当前主题的样式表内容
      const isDark = themeToggle.checked;
      const styleUrl = isDark ? 'css/github-markdown-dark.min.css' : 'css/github-markdown-light.min.css';
      
      const styleResponse = await fetch(styleUrl);
      const styleContent = await styleResponse.text();
      
      // 创建完整的HTML文档
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown Export</title>
        <style>
          body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
            background-color: ${isDark ? '#0d1117' : 'white'};
          }
          @media (max-width: 767px) {
            body {
              padding: 15px;
            }
          }
          ${styleContent}
        </style>
      </head>
      <body>
        <article class="markdown-body">
          ${DOMPurify.sanitize(md.render(markdownInput.value))}
        </article>
      </body>
      </html>
      `;
      
      // 创建一个Blob对象
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // 下载文件
      downloadFile(blob, 'markdown_export.html', true);
      showNotification('HTML文件已导出', 'success');
    } catch (error) {
      console.error('导出HTML失败:', error);
      showNotification('导出HTML失败', 'error');
    } finally {
      showLoading(false);
    }
  }

  // 下载文件的通用函数
  function downloadFile(data, fileName, shouldRevoke = false) {
    const link = document.createElement('a');
    link.href = typeof data === 'string' ? data : URL.createObjectURL(data);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (shouldRevoke && typeof data !== 'string') {
      URL.revokeObjectURL(link.href);
    }
  }

  // 初始化应用
  init();
}); 