module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  '*.{css,scss}': ['prettier --write'],
  // Removed the catch-all '*' rule that was trying to format all files including images
};
