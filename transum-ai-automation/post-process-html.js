const fs = require('fs');
const path = require('path');

// Path to the generated HTML report
const reportPath = path.resolve('./reports/test-report.html');

// Read the HTML file
fs.readFile(reportPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading HTML report file:', err);
    return;
  }

  // Add custom styling
  const styleTag = `
  <style>
    .clean-console {
      padding: 15px;
      background-color: #f8f8f8;
      border-radius: 5px;
      border: 1px solid #e0e0e0;
      font-family: monospace;
      margin-bottom: 20px;
    }
    .section-header {
      font-weight: bold;
      font-size: 1.1em;
      background-color: #f0f0f0;
      padding: 5px 10px;
      margin: 10px 0 5px 0;
      border-radius: 3px;
      border-left: 4px solid #007bff;
    }
    .stat-item {
      padding: 3px 10px;
      margin: 2px 0;
      display: block;
    }
    .file-stats {
      margin-top: 15px;
    }
    .origin-hidden {
      display: none !important;
    }
  </style>`;

  // First insert the style tag
  let modifiedHtml = data.replace('</head>', `${styleTag}</head>`);

  // Function to process stack traces and console log sections
  const processConsoleLogs = () => {
    // Clean the console logs by hiding stack traces and formatting the output
    const consoleRegex = /<div class="suite-consolelog">([\s\S]*?)<\/div><\/div>/g;
    
    return modifiedHtml.replace(consoleRegex, (match, content) => {
      // Extract header and log items
      const headerMatch = content.match(/<div class="suite-consolelog-header">([\s\S]*?)<\/div>/);
      const header = headerMatch ? headerMatch[1] : 'Console Log';
      
      // Extract all console items
      const itemRegex = /<div class="suite-consolelog-item">([\s\S]*?)<\/div>/g;
      let itemMatches;
      const cleanedItems = [];
      const sections = {};
      let currentSection = null;
      
      while ((itemMatches = itemRegex.exec(content)) !== null) {
        const itemContent = itemMatches[1];
        
        // Extract origin (stack trace) and message
        const originMatch = itemContent.match(/<pre class="suite-consolelog-item-origin">([\s\S]*?)<\/pre>/);
        const messageMatch = itemContent.match(/<pre class="suite-consolelog-item-message">([\s\S]*?)<\/pre>/);
        
        if (messageMatch) {
          const message = messageMatch[1].trim();
          
          // Skip empty messages
          if (!message) continue;
          
          // Identify section headers (end with colon or are file stats)
          if (message.endsWith(':') || 
              message.startsWith('Processed files breakdown') || 
              message.startsWith('Metadata Counts') ||
              message.startsWith('Summary') ||
              message.includes('Type:')) {
            currentSection = message;
            sections[currentSection] = [];
          } 
          // Process individual stat items
          else if (
            message.match(/^[\s-]*[A-Za-z0-9]+:/) || // Lines like "- Valid: 10"
            message.match(/^Found \d+/) ||           // Lines like "Found 11 files"
            message.includes('Total') ||
            message.includes('Percentage') ||
            currentSection !== null
          ) {
            if (currentSection) {
              sections[currentSection].push(message);
            } else {
              cleanedItems.push({ type: 'stat', content: message });
            }
          } else {
            cleanedItems.push({ type: 'message', content: message });
          }
        }
      }
      
      // Build the cleaned console output
      let cleanedContent = `<div class="suite-consolelog"><div class="suite-consolelog-header">${header}</div><div class="clean-console">`;
      
      // Add individual items first
      cleanedItems.forEach(item => {
        if (item.type === 'stat') {
          cleanedContent += `<div class="stat-item">${item.content}</div>`;
        } else {
          cleanedContent += `<div>${item.content}</div>`;
        }
      });
      
      // Now add sections with their items
      Object.keys(sections).forEach(section => {
        cleanedContent += `<div class="section-header">${section}</div>`;
        sections[section].forEach(item => {
          cleanedContent += `<div class="stat-item">${item}</div>`;
        });
      });
      
      cleanedContent += '</div></div>';
      
      return cleanedContent;
    });
  };

  // Process the console logs
  modifiedHtml = processConsoleLogs();

  // Add an additional script to hide all origin traces
  modifiedHtml = modifiedHtml.replace('</body>', `
  <script>
    // Hide all stack trace origins
    document.querySelectorAll('.suite-consolelog-item-origin').forEach(el => {
      el.classList.add('origin-hidden');
    });
  </script>
  </body>`);

  // Write the modified HTML back to the file
  fs.writeFile(reportPath, modifiedHtml, 'utf8', (err) => {
    if (err) {
      console.error('Error writing modified HTML report:', err);
      return;
    }
    console.log('HTML report successfully post-processed!');
  });
});