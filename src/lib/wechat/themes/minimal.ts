import type { WeChatTemplate, WeChatExportOptions } from '../types'

export const minimalTheme: WeChatTemplate = {
  getCSS: (options: WeChatExportOptions) => `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.8;
  color: #333;
  font-size: 16px;
  background: #fff;
}
.container {
  width: ${options.width || 677}px;
  margin: 0 auto;
  padding: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}
h1 {
  font-size: 22px;
  font-weight: bold;
  margin: 30px 0 15px;
  color: #333;
}
h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 25px 0 12px;
  color: #333;
}
h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #333;
}
h4, h5, h6 {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 8px;
  color: #333;
}
p { margin: 10px 0; }
ul, ol { margin: 10px 0; padding-left: 25px; }
li { margin: 5px 0; }
a { color: #576b95; text-decoration: none; }
a:hover { text-decoration: underline; }
strong { font-weight: bold; }
em { font-style: italic; }
blockquote {
  border-left: 4px solid #d1d1d1;
  padding: 10px 15px;
  margin: 15px 0;
  background: #f9f9f9;
  color: #666;
}
code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}
pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 15px 0;
}
pre code {
  background: transparent;
  padding: 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}
th, td {
  border: 1px solid #e0e0e0;
  padding: 8px 12px;
  text-align: left;
}
th {
  background: #f5f5f5;
  font-weight: bold;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 15px auto;
}
hr {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 20px 0;
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
    ${titleHtml}
    ${content}
  </div>
</body>
</html>`
  }
}
