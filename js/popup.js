document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const markdownInput = document.getElementById('markdown-input');
  const previewContainer = document.getElementById('preview-container');
  const pasteButton = document.getElementById('paste-button');
  const clearButton = document.getElementById('clear-button');
  const exportImageButton = document.getElementById('export-image');
  const exportPdfButton = document.getElementById('export-pdf');
  const exportHtmlButton = document.getElementById('export-html');
  const exportMdButton = document.getElementById('export-md');
  const loadingElement = document.getElementById('loading');
  const messageElement = document.getElementById('message');
  const themeToggle = document.getElementById('theme-toggle');
  const themeStyle = document.getElementById('theme-style');
  const bodyEl = document.body;
  // History Elements
  const historyBtn = document.getElementById('history-btn');
  const historyModal = document.getElementById('history-modal');
  const closeHistoryModalBtn = document.getElementById('close-history-modal');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  // 强制隐藏loading，防止初始显示
  loadingElement.classList.add('hidden');

  // 初始化marked配置
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    highlight: function(code, lang) {
      return code;
    }
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
    showMessage('已清空内容', 'success');
  });

  // 导出为长图
  exportImageButton.addEventListener('click', () => handleExport(exportAsImage));

  // 导出为PDF
  exportPdfButton.addEventListener('click', () => handleExport(exportAsPdf));

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
  });
  closeHistoryModalBtn.addEventListener('click', () => historyModal.classList.add('hidden'));
  clearHistoryBtn.addEventListener('click', handleClearHistory);

  // 初始化，尝试从剪贴板读取内容
  async function init() {
    loadingElement.classList.add('hidden');
    
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    // Check for cleared state first
    const isCleared = localStorage.getItem('isCleared');
    if (isCleared === 'true') {
      markdownInput.value = '';
      renderMarkdown();
      return; // Stop further execution to keep the editor empty
    }

    // Load history and decide initial content
    const history = await loadHistory();
    if (history.length > 0) {
      markdownInput.value = history[0].content;
      renderMarkdown();
      showMessage('已加载最新历史记录', 'success');
    } else {
      // If no history, try to paste from clipboard
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
    const html = DOMPurify.sanitize(marked.parse(markdown || ' ')); // Ensure not empty for parsing
    previewContainer.innerHTML = html;
  }

  // 从剪贴板读取内容并渲染
  async function pasteAndRenderFromClipboard(isSilent = false) {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        markdownInput.value = text;
        renderMarkdown();
        if (!isSilent) showMessage('已从剪贴板粘贴内容', 'success');
      } else if (!isSilent) {
        showMessage('剪贴板为空', 'error');
      }
    } catch (error) {
      if (!isSilent) showMessage('无法读取剪贴板内容', 'error');
      console.error('剪贴板读取失败:', error);
    }
  }

  // 导出为长图
  async function exportAsImage() {
    if (!markdownInput.value.trim()) {
      showMessage('请先输入Markdown内容', 'error');
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
        tempContainer.style.backgroundColor = '#0d1117'; // GitHub暗色模式背景色
        tempContainer.style.color = '#c9d1d9';
      } else {
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.color = '#24292f';
      }
      
      tempContainer.innerHTML = previewContainer.innerHTML;
      
      // 添加主题样式
      const themeStyle = document.createElement('style');
      themeStyle.textContent = isDark ? 
        await fetch(chrome.runtime.getURL('css/github-markdown-dark.min.css')).then(res => res.text()) :
        await fetch(chrome.runtime.getURL('css/github-markdown-light.min.css')).then(res => res.text());
      
      tempContainer.appendChild(themeStyle);
      document.body.appendChild(tempContainer);

      // 使用html2canvas生成图片
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // 提高清晰度
        useCORS: true,
        logging: false,
        allowTaint: false,
        backgroundColor: isDark ? '#0d1117' : 'white'
      });

      document.body.removeChild(tempContainer);

      // 将canvas转为图片并下载
      const imageData = canvas.toDataURL('image/png');
      const timestamp = new Date().getTime();
      downloadFile(imageData, `markdown_${timestamp}.png`);

      showMessage('长图导出成功！', 'success');
    } catch (error) {
      showMessage('导出长图失败，请重试', 'error');
      console.error('导出长图错误:', error);
    } finally {
      showLoading(false);
    }
  }

  // 导出为PDF
  async function exportAsPdf() {
    if (!markdownInput.value.trim()) {
      showMessage('请先输入Markdown内容', 'error');
      return;
    }

    showLoading(true);

    try {
      // 创建临时容器
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
        tempContainer.style.backgroundColor = '#0d1117'; // GitHub暗色模式背景色
        tempContainer.style.color = '#c9d1d9';
      } else {
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.color = '#24292f';
      }
      
      tempContainer.innerHTML = previewContainer.innerHTML;
      
      // 添加主题样式
      const themeStyle = document.createElement('style');
      themeStyle.textContent = isDark ? 
        await fetch(chrome.runtime.getURL('css/github-markdown-dark.min.css')).then(res => res.text()) :
        await fetch(chrome.runtime.getURL('css/github-markdown-light.min.css')).then(res => res.text());
      
      tempContainer.appendChild(themeStyle);
      document.body.appendChild(tempContainer);

      // 使用html2canvas生成图片
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: false,
        backgroundColor: isDark ? '#0d1117' : 'white'
      });

      document.body.removeChild(tempContainer);

      // 创建PDF文档
      const imgWidth = 210; // A4宽度，单位mm
      const pageHeight = 297; // A4高度，单位mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      let firstPage = true;

      // 处理分页
      while (heightLeft > 0) {
        if (!firstPage) {
          pdf.addPage();
        } else {
          firstPage = false;
        }

        pdf.addImage(
          canvas.toDataURL('image/png'), 
          'PNG', 
          0, 
          position, 
          imgWidth, 
          imgHeight
        );
        
        heightLeft -= pageHeight;
        position -= pageHeight;
      }

      // 下载PDF
      const timestamp = new Date().getTime();
      pdf.save(`markdown_${timestamp}.pdf`);

      showMessage('PDF导出成功！', 'success');
    } catch (error) {
      showMessage('导出PDF失败，请重试', 'error');
      console.error('导出PDF错误:', error);
    } finally {
      showLoading(false);
    }
  }

  // 导出为MD
  function exportAsMd() {
    const content = markdownInput.value;
    if (!content.trim()) {
      showMessage('内容为空，无需导出', 'error');
      return;
    }
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const timestamp = new Date().getTime();
    downloadFile(URL.createObjectURL(blob), `markdown_${timestamp}.md`, true);
  }

  // 导出为HTML
  async function exportAsHtml() {
    const previewContent = previewContainer.innerHTML;
    if (!previewContent.trim()) {
      showMessage('内容为空，无法导出HTML', 'error');
      return;
    }

    showLoading(true);
    try {
      const title = markdownInput.value.split('\n')[0].replace(/#/g, '').trim() || 'Markdown Export';
      const isDark = themeToggle.checked;
      const themeCssUrl = isDark ? 'github-markdown-dark.min.css' : 'github-markdown-light.min.css';
      const themeCss = await fetch(chrome.runtime.getURL(`css/${themeCssUrl}`)).then(res => res.text());

      const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 2rem 4rem;
    }
    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
    }
    ${themeCss}
  </style>
</head>
<body class="${isDark ? 'dark-mode' : ''}">
  <article class="markdown-body">
    ${previewContent}
  </article>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const timestamp = new Date().getTime();
      downloadFile(URL.createObjectURL(blob), `markdown_${timestamp}.html`, true);
      showMessage('HTML导出成功！', 'success');
    } catch (error) {
      showMessage('导出HTML失败', 'error');
      console.error('导出HTML错误:', error);
    } finally {
      showLoading(false);
    }
  }

  // 下载文件
  function downloadFile(data, fileName, shouldRevoke = false) {
    const link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    link.click();
    if (shouldRevoke) {
      URL.revokeObjectURL(data);
    }
  }

  // 显示/隐藏加载动画
  function showLoading(show) {
    loadingElement.classList.toggle('hidden', !show);
  }

  // 显示消息
  function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = 'message';
    messageElement.classList.add(type);
    messageElement.classList.remove('hidden');

    // 3秒后自动隐藏
    setTimeout(() => {
      messageElement.classList.add('hidden');
    }, 3000);
  }

  // --- History Management ---
  const MAX_HISTORY_LENGTH = 20;

  async function loadHistory() {
      const data = await chrome.storage.local.get('history');
      const history = data.history || [];
      renderHistoryUI(history);
      return history; // Return history for init function
  }
  
  function renderHistoryUI(history) {
      historyList.innerHTML = '';
      if(history.length === 0) {
          historyList.innerHTML = '<p style="text-align:center; color:#868e96;">暂无历史记录</p>';
          return;
      }
      history.forEach((entry, index) => {
          const item = document.createElement('div');
          item.className = 'history-item';
          item.dataset.index = index;
          item.innerHTML = `
              <span class="item-name">${entry.content.substring(0, 50).replace(/</g, "&lt;")}...</span>
              <span class="item-date">${new Date(entry.timestamp).toLocaleString()}</span>
          `;
          historyList.appendChild(item);
      });
      
      historyList.querySelectorAll('.history-item').forEach(item => {
          item.addEventListener('click', (e) => {
              handleRestoreHistory(parseInt(e.currentTarget.dataset.index));
          });
      });
  }

  async function handleRestoreHistory(index) {
      const data = await chrome.storage.local.get('history');
      const history = data.history || [];
      if(history[index]) {
          markdownInput.value = history[index].content;
          renderMarkdown();
          historyModal.classList.add('hidden');
          showMessage('已从历史记录恢复', 'success');
      }
  }
  
  async function handleClearHistory() {
      if(confirm('您确定要清空所有历史记录吗？此操作无法撤销。')) {
          await chrome.storage.local.set({ history: [] });
          renderHistoryUI([]);
          showMessage('历史记录已清空', 'success');
      }
  }

  // --- Export Handling ---
  async function handleExport(exportFunc) {
      if (!markdownInput.value.trim()) {
          showMessage('内容为空，无法导出', 'error');
          return;
      }
      // Any export action clears the 'cleared' state
      localStorage.removeItem('isCleared');
      await saveToHistory(); // Save before exporting
      await exportFunc();
  }

  // --- History Management ---
  async function saveToHistory() {
    const content = markdownInput.value.trim();
    if (!content) return;
    
    let data = await chrome.storage.local.get('history');
    let history = data.history || [];
    
    // Avoid saving duplicates
    if(history.length > 0 && history[0].content === content) return;

    history.unshift({ content, timestamp: Date.now() });
    if (history.length > MAX_HISTORY_LENGTH) {
      history.pop();
    }
    await chrome.storage.local.set({ history });
  }

  // 页面加载后执行初始化
  init();
}); 