class CustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    results.testResults.forEach(testResultItem => {
      if (testResultItem.console) {
        const filteredLogs = [];
        let currentSection = null;
        let currentContent = '';
        
        // Process each console log entry
        testResultItem.console.forEach(log => {
          const message = log.message.trim();
          
          // Identify section headers
          if (message.startsWith('Processed files breakdown:') ||
              message.startsWith('Metadata Counts:') ||
              message.startsWith('TranscriptType:') ||
              message.startsWith('ProceedingType:') ||
              message.startsWith('LitigationType:') ||
              message.includes('Found') && message.includes('files')) {
                
            // If we were already capturing a section, save it first
            if (currentSection) {
              filteredLogs.push({ message: `<div class="stat-section">${currentSection}</div><div class="stat-content">${currentContent}</div>` });
            }
            
            // Start a new section
            currentSection = message;
            currentContent = '';
          } 
          // Skip stack trace lines and empty lines
          else if (!message.startsWith('at ') && message !== '') {
            // Capture lines that appear to be statistics
            if (message.match(/^[\s-]*[A-Za-z0-9]+:/) || // Lines like "- Depositions: 9" or "Valid: 10"
                message.match(/^Total/) ||               // Lines starting with "Total"
                message.includes('Percentage')) {        // Lines with percentages
              currentContent += `<div class="stat-item">${message}</div>`;
            }
          }
        });
        
        // Add the last section if there is one
        if (currentSection) {
          filteredLogs.push({ message: `<div class="stat-section">${currentSection}</div><div class="stat-content">${currentContent}</div>` });
        }
        
        // Add CSS styling for the filtered content
        if (filteredLogs.length > 0) {
          filteredLogs.unshift({
            message: `
              <style>
                .stat-section {
                  font-weight: bold;
                  margin-top: 15px;
                  padding: 5px;
                  background-color: #f0f0f0;
                  border-radius: 3px;
                }
                .stat-content {
                  margin-left: 15px;
                  padding: 5px;
                  font-family: monospace;
                }
                .stat-item {
                  margin: 5px 0;
                }
              </style>
            `
          });
        }
        
        // Replace the console logs with our filtered version
        testResultItem.console = filteredLogs;
      }
    });
  }
}

module.exports = CustomReporter;