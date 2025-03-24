app.use((req, res, next) => {
    if (req.method === 'POST' && !req.headers['content-type']) {
      console.warn('⚠️  Missing Content-Type header!');
    }
    next();
  });