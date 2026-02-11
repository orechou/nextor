import type { WeChatTemplate, WeChatExportOptions } from '../types'

export const businessTheme: WeChatTemplate = {
  getCSS: (options: WeChatExportOptions) => `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.7;
  color: #2c3e50;
  font-size: 15px;
  background: #f0f4f8;
}
.container {
  width: ${options.width || 677}px;
  margin: 16px auto;
  padding: 0;
  background: #fff;
}
.header-bar {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  height: 6px;
}
.content-wrapper {
  padding: 28px 24px 24px;
}
.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1e3a8a;
  text-align: center;
  letter-spacing: 0.5px;
}
h1 {
  font-size: 22px;
  font-weight: 700;
  margin: 28px 0 14px;
  color: #1e3a8a;
  padding-bottom: 8px;
  border-bottom: 2px solid #3b82f6;
}
h2 {
  font-size: 19px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #1e40af;
  display: flex;
  align-items: center;
}
h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: #3b82f6;
  margin-right: 10px;
}
h3 {
  font-size: 17px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: #1e40af;
}
h4, h5, h6 {
  font-size: 15px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #2563eb;
}
p { margin: 10px 0; line-height: 1.7; }
ul, ol { margin: 10px 0; padding-left: 26px; }
li { margin: 5px 0; line-height: 1.6; }
a { color: #2563eb; text-decoration: none; font-weight: 500; }
a:hover { text-decoration: underline; }
strong { font-weight: 700; color: #1e3a8a; }
em { font-style: italic; color: #475569; }
blockquote {
  border-left: 4px solid #3b82f6;
  padding: 10px 16px;
  margin: 14px 0;
  background: #eff6ff;
  color: #334155;
}
code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}
pre {
  background: #0f172a;
  padding: 14px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 14px 0;
  border: 1px solid #1e293b;
}
pre code {
  background: transparent;
  padding: 0;
  border: none;
  color: #e2e8f0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  border: 1px solid #e2e8f0;
}
th, td {
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
  text-align: left;
}
th {
  background: #1e3a8a;
  color: #fff;
  font-weight: 600;
}
tr:nth-child(even) {
  background: #f8fafc;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
  border: 1px solid #e2e8f0;
  padding: 4px;
  background: #fff;
}
hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 24px 0;
}
`,

  getWrapper: (content: string, title: string, options: WeChatExportOptions) => {
    const titleHtml = options.includeTitle ? `<h1 class="title">${title}</h1>` : ''
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <div class="container">
    <div class="header-bar"></div>
    <div class="content-wrapper">
      ${titleHtml}
      ${content}
    </div>
  </div>
</body>
</html>`
  }
}
