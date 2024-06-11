const faviconMiddleware = (req, res, next) => {
  if (req.url === '/favicon.ico' && req.method === 'GET') {
    // Không log cho request GET đến '/favicon.ico'
    return;
  }
  // Tiếp tục xử lý middleware chain
  next();
};

module.exports = faviconMiddleware;
