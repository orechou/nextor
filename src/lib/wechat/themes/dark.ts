import type { WeChatTemplate, WeChatExportOptions } from '../types'

export const darkTheme: WeChatTemplate = {
  getCSS: (options: WeChatExportOptions) => `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.8;
  color: #e0e0e0;
  font-size: 16px;
  background: #1a1a1a;
}
.container {
  width: ${options.width || 677}px;
  margin: 0 auto;
  padding: 20px;
  background: #1a1a1a;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #4a9eff;
  text-align: center;
}
h1 {
  font-size: 22px;
  font-weight: bold;
  margin: 30px 0 15px;
  color: #4a9eff;
}
h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 25px 0 12px;
  color: #7ec8e3;
}
h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #a0d2db;
}
h4, h5, h6 {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 8px;
  color: #c5e8f0;
}
p { margin: 10px 0; }
ul, ol { margin: 10px 0; padding-left: 25px; }
li { margin: 5px 0; }
a { color: #4a9eff; text-decoration: none; }
a:hover { text-decoration: underline; color: #7ec8e3; }
strong { font-weight: bold; color: #ffd700; }
em { font-style: italic; color: #ff6b9d; }
blockquote {
  border-left: 4px solid #4a9eff;
  padding: 10px 15px;
  margin: 15px 0;
  background: #2d2d2d;
  color: #b0b0b0;
}
code {
  background: #2d2d2d;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #7ec8e3;
}
pre {
  background: #2d2d2d;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 15px 0;
  border: 1px solid #3d3d3d;
}
pre code {
  background: transparent;
  padding: 0;
  color: #e0e0e0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}
th, td {
  border: 1px solid #3d3d3d;
  padding: 8px 12px;
  text-align: left;
}
th {
  background: #2d2d2d;
  font-weight: bold;
  color: #4a9eff;
}
tr:nth-child(even) {
  background: #242424;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 15px auto;
}
hr {
  border: none;
  border-top: 1px solid #3d3d3d;
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
