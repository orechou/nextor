import type { WeChatTemplate, WeChatExportOptions } from '../types'

export const techTheme: WeChatTemplate = {
  getCSS: (options: WeChatExportOptions) => `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'SF Mono', 'Consolas', monospace;
  line-height: 1.6;
  color: #24292f;
  font-size: 15px;
  background: #f6f8fa;
}
.container {
  width: ${options.width || 677}px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  margin-top: 16px;
}
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #24292f;
  text-align: left;
  padding-bottom: 12px;
  border-bottom: 1px solid #d0d7de;
}
h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 28px 0 12px;
  color: #24292f;
  padding-bottom: 8px;
  border-bottom: 1px solid #d8dee4;
}
h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 10px;
  color: #24292f;
  display: inline-block;
  border-bottom: 2px solid #0969da;
  padding-bottom: 2px;
}
h3 {
  font-size: 17px;
  font-weight: 600;
  margin: 20px 0 8px;
  color: #24292f;
}
h4, h5, h6 {
  font-size: 15px;
  font-weight: 600;
  margin: 16px 0 6px;
  color: #57606a;
}
p { margin: 8px 0; line-height: 1.6; }
ul, ol { margin: 8px 0; padding-left: 24px; }
li { margin: 4px 0; line-height: 1.5; }
a { color: #0969da; text-decoration: none; }
a:hover { text-decoration: underline; }
strong { font-weight: 700; color: #24292f; }
em { font-style: italic; color: #57606a; }
blockquote {
  border-left: 4px solid #0969da;
  padding: 8px 16px;
  margin: 12px 0;
  background: #f6f8fa;
  color: #57606a;
  border-radius: 0 4px 4px 0;
}
code {
  background: rgba(175,184,193,0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #24292f;
}
pre {
  background: #24292f;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
}
pre code {
  background: transparent;
  padding: 0;
  color: #c9d1d9;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  border: 1px solid #d0d7de;
}
th, td {
  border: 1px solid #d0d7de;
  padding: 8px 12px;
  text-align: left;
}
th {
  background: #f6f8fa;
  font-weight: 600;
  color: #24292f;
}
tr:nth-child(even) {
  background: #f6f8fa;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 12px auto;
  border-radius: 6px;
  border: 1px solid #d0d7de;
}
hr {
  border: none;
  border-top: 1px solid #d0d7de;
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
