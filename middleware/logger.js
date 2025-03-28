module.exports = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method.padEnd(7);
    const path = req.originalUrl;
    
    // Color codes for Termux
    const colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      gray: '\x1b[90m',
      reset: '\x1b[0m'
    };
    
    let statusIcon, statusColor;
    
    if (status >= 500) {
      statusIcon = '🔴';
      statusColor = colors.red;
    } else if (status >= 400) {
      statusIcon = '🟠';
      statusColor = colors.yellow;
    } else if (status >= 300) {
      statusIcon = '🔵';
      statusColor = colors.blue;
    } else {
      statusIcon = '🟢';
      statusColor = colors.green;
    }
    
    console.log(
      `${statusIcon} ${statusColor}${status}${colors.reset} ` +
      `${colors.gray}${method}${colors.reset} ${path} ` +
      `${colors.gray}${duration}ms${colors.reset}`
    );
  });

  next();
};
