import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
  if (filePath && filePath !== '/default-product-image.jpg') {
    const fullPath = path.join(process.cwd(), filePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Failed to delete file ${filePath}:`, err);
    });
  }
};