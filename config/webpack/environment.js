const { environment } = require('@rails/webpacker')

const css = environment.loaders.get('moduleCss').use.find(el => el.loader === 'css-loader')

css.options.modules.localIdentRegExp = /\/([^\/]+?)\.module\./
css.options.modules.localIdentName = '[1]_[local]'

module.exports = environment
