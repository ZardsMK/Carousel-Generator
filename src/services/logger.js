const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../output/log.txt');

function logToFile(level, message, details = null) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level}: ${message}`;
    fs.appendFileSync(logFilePath, `${logEntry}\n`);
    if (details) fs.appendFileSync(logFilePath, `Details: ${JSON.stringify(details)}\n`);
  }

function log(level, message, details = null) {
    logToFile(level, message, details);
}
  
module.exports = log;