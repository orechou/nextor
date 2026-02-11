import type { WeChatTemplate, WeChatExportOptions } from '../types'

export const colorfulTheme: WeChatTemplate = {
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
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #2c3e50;
  text-align: center;
  border-bottom: 3px solid #3498db;
  padding-bottom: 15px;
}
h1 {
  font-size: 22px;
  font-weight: bold;
  margin: 30px 0 15px;
  color: #2c3e50;
  border-left: 5px solid #3498db;
  padding-left: 12px;
}
h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 25px 0 12px;
  color: #34495e;
  border-left: 4px solid #2ecc71;
  padding-left: 10px;
}
h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #34495e;
  border-left: 3px solid #e74c3c;
  padding-left: 8px;
}
h4, h5, h6 {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 8px;
  color: #34495e;
}
p { margin: 10px 0; }
ul, ol { margin: 10px 0; padding-left: 25px; }
li { margin: 5px 0; }
a { color: #3498db; text-decoration: none; font-weight: 500; }
a:hover { text-decoration: underline; color: #2980b9; }
strong { font-weight: bold; color: #e74c3c; }
em { font-style: italic; color: #9b59b6; }
blockquote {
  border-left: 5px solid #f39c12;
  padding: 12px 18px;
  margin: 15px 0;
  background: linear-gradient(to right, #fef5e7, #fff);
  color: #555;
}
code {
  background: linear-gradient(135deg, #ecf0f1, #d5dbdb);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #e74c3c;
}
pre {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  padding: 18px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 15px 0;
  border-left: 5px solid #3498db;
}
pre code {
  background: transparent;
  padding: 0;
  color: #ecf0f1;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}
th, td {
  border: 1px solid #bdc3c7;
  padding: 10px 14px;
  text-align: left;
}
th {
  background: linear-gradient(to bottom, #3498db, #2980b9);
  color: white;
  font-weight: bold;
}
tr:nth-child(even) {
  background: #ecf0f1;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 15px auto;
  border-radius: 5px;
}
hr {
  border: none;
  border-top: 2px solid #3498db;
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
