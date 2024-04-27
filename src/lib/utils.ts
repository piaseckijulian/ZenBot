export const getEnvironment = () =>
  __dirname.includes('dist') ? 'prod' : 'dev';
