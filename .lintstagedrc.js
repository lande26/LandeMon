const path = require('path');

const buildEslintCommand = (filenames) => {
  const filesToLint = filenames
    .map((f) => path.relative(process.cwd(), f))
    .filter(
      (f) =>
        !f.startsWith('load-tests') &&
        !f.startsWith('nothing-to-watch') &&
        !f.startsWith('ad-proxy-worker'),
    );

  if (filesToLint.length === 0) return 'echo "No files to lint"';
  return `next lint --fix --file ${filesToLint.join(' --file ')}`;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  '*.{css,scss,sass,less,styl,json,js,tsx,ts,cjs,mjs}': ['prettier --write'],
};
