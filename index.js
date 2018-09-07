/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    before: {
      type: 'string',
    },
    after: {
      type: 'string',
    },
    prevent: {
      type: 'string',
    },
  },
};

module.exports = function rawLoader(source) {
  const options = loaderUtils.getOptions(this) || {};
  validateOptions(schema, options, 'raw-loader-bump');

  this.value = source;

  const before = options.before || '';
  const after = options.after || '';
  const prevent = options.prevent
    ? `;if (window['${options.prevent}'] !== undefined){ throw Error() };`
    : '';

  const decoratedSource = `${before}${prevent}${source}${after}`;

  const json = JSON.stringify(decoratedSource)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `module.exports = ${json}`;
};
