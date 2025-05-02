const generateProductID = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `PRD-${timestamp}-${random}`.toUpperCase();
};

export default generateProductID; 