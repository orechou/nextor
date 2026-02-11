import type { WeChatTemplate, WeChatExportOptions } from '../types'

export const elegantTheme: WeChatTemplate = {
  getCSS: (options: WeChatExportOptions) => `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Georgia', 'Times New Roman', 'Songti SC', 'SimSun', serif;
  line-height: 2;
  color: #2c3e50;
  font-size: 16px;
  background: #fafafa;
}
.container {
  width: ${options.width || 677}px;
  margin: 0 auto;
  padding: 30px;
  background: white;
}
.title {
  font-size: 28px;
  font-weight: normal;
  margin-bottom: 30px;
  color: #1a1a1a;
  text-align: center;
  font-family: 'Georgia', 'Times New Roman', serif;
  letter-spacing: 2px;
}
h1 {
  font-size: 22px;
  font-weight: normal;
  margin: 35px 0 18px;
  color: #1a1a1a;
  text-align: center;
  position: relative;
}
h1:after {
  content: '';
  display: block;
  width: 60px;
  height: 2px;
  background: #d4af37;
  margin: 10px auto 0;
}
h2 {
  font-size: 20px;
  font-weight: normal;
  margin: 30px 0 15px;
  color: #2c3e50;
  text-align: center;
  position: relative;
}
h2:before {
  content: '◆';
  color: #d4af37;
  margin-right: 8px;
  font-size: 14px;
}
h2:after {
  content: '◆';
  color: #d4af37;
  margin-left: 8px;
  font-size: 14px;
}
h3 {
  font-size: 18px;
  font-weight: normal;
  margin: 25px 0 12px;
  color: #34495e;
  padding-left: 15px;
  border-left: 2px solid #d4af37;
}
h4, h5, h6 {
  font-size: 16px;
  font-weight: normal;
  margin: 20px 0 10px;
  color: #34495e;
}
p { margin: 12px 0; text-align: justify; }
ul, ol { margin: 12px 0; padding-left: 30px; }
li { margin: 8px 0; }
a { color: #8b4513; text-decoration: none; border-bottom: 1px dotted #8b4513; }
a:hover { border-bottom-style: solid; }
strong { font-weight: bold; color: #8b0000; }
em { font-style: italic; color: #556b2f; }
blockquote {
  border: none;
  padding: 20px 25px;
  margin: 20px 0;
  background: linear-gradient(to right, #f8f4e8, #fffaf0);
  color: #4a4a4a;
  position: relative;
  font-style: italic;
}
blockquote:before {
  content: '"';
  font-size: 40px;
  color: #d4af37;
  position: absolute;
  top: 5px;
  left: 10px;
  opacity: 0.3;
}
code {
  background: #f5f0e6;
  padding: 3px 8px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  border: 1px solid #e8dcc8;
}
pre {
  background: #f5f0e6;
  padding: 20px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #e8dcc8;
}
pre code {
  background: transparent;
  padding: 0;
  border: none;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}
th, td {
  border: 1px solid #d4c8a8;
  padding: 10px 14px;
  text-align: left;
}
th {
  background: #f8f4e8;
  font-weight: bold;
  color: #2c3e50;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
}
hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #d4af37, transparent);
  margin: 30px 0;
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
