import type { WeChatTemplate, WeChatExportOptions } from '../types'

export const modernTheme: WeChatTemplate = {
  getCSS: (options: WeChatExportOptions) => `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.8;
  color: #2c3e50;
  font-size: 16px;
  background: #f8f9fa;
}
.container {
  width: ${options.width || 677}px;
  margin: 20px auto;
  padding: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}
.content-wrapper {
  padding: 24px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1a1a1a;
  text-align: center;
  padding-bottom: 16px;
  border-bottom: 2px solid #e8e8e8;
}
h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 32px 0 16px;
  color: #1a1a1a;
  display: inline-block;
  padding-bottom: 8px;
  border-bottom: 3px solid #3498db;
}
h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 28px 0 14px;
  color: #2c3e50;
  padding-left: 12px;
  border-left: 4px solid #3498db;
}
h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px;
  color: #34495e;
}
h4, h5, h6 {
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 10px;
  color: #5a6c7d;
}
p { margin: 12px 0; line-height: 1.8; }
ul, ol { margin: 12px 0; padding-left: 28px; }
li { margin: 6px 0; line-height: 1.7; }
a { color: #3498db; text-decoration: none; border-bottom: 1px dashed #3498db; }
a:hover { border-bottom-style: solid; }
strong { font-weight: 700; color: #1a1a1a; }
em { font-style: italic; color: #555; }
blockquote {
  border-left: 4px solid #3498db;
  padding: 12px 18px;
  margin: 16px 0;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%);
  color: #4a5568;
  border-radius: 0 8px 8px 0;
}
code {
  background: #f1f3f5;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #e74c3c;
}
pre {
  background: #282c34;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
pre code {
  background: transparent;
  padding: 0;
  color: #abb2bf;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
th, td {
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  text-align: left;
}
th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
}
tr:nth-child(even) {
  background: #f8f9fa;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
hr {
  border: none;
  border-top: 2px dashed #e8e8e8;
  margin: 28px 0;
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
    <div class="content-wrapper">
      ${titleHtml}
      ${content}
    </div>
  </div>
</body>
</html>`
  }
}
