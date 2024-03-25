export const getFileExtension = () => {
  if (__dirname.includes('dist')) {
    return '.js';
  } else {
    return '.ts';
  }
};
