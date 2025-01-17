const formattedVariables = require('../web/formattedVariables')
const fileHeader = require('../web/fileHeader')
const {
  filteredTokens,
  matchDarkThemeToken,
  matchLightThemeToken
} = require('../common/tokenFilters')

module.exports = ({ dictionary, options, file }) => {
  const opts = options ?? {}
  const { outputReferences } = opts
  const groupedTokens = {
    light: filteredTokens(dictionary, (token) =>
      matchLightThemeToken(token, ['color', 'effect'])
    ),
    dark: filteredTokens(dictionary, (token) =>
      matchDarkThemeToken(token, ['color', 'effect'])
    ),
    rest: filteredTokens(
      dictionary,
      (token) =>
        ['color', 'custom-shadow'].includes(token.type) &&
        !matchDarkThemeToken(token) &&
        !matchLightThemeToken(token)
    )
  }

  // Note: replace strips out 'light-mode' and 'dark-mode' inside media queries
  return (
    fileHeader({ file }) +
    ':root {\n' +
    formattedVariables({
      format: 'tailwind',
      dictionary: groupedTokens.rest,
      outputReferences
    }).replace(/desktop-/gm, '') +
    '\n}\n\n' +
    '@media (prefers-color-scheme: light) {\n' +
    ' :root {\n' +
    formattedVariables({
      format: 'tailwind',
      dictionary: groupedTokens.light,
      outputReferences
    }).replace(/-light-/gm, '-') +
    '\n }\n}\n\n' +
    '@media (prefers-color-scheme: dark) {\n' +
    ' :root {\n' +
    formattedVariables({
      format: 'tailwind',
      dictionary: groupedTokens.dark,
      outputReferences
    }).replace(/-dark-/gm, '-') +
    '\n }\n}\n\n' +
    '[data-theme="light"] {\n' +
    formattedVariables({
      format: 'tailwind',
      dictionary: groupedTokens.light,
      outputReferences
    }).replace(/-light-/gm, '-') +
    '\n}\n\n' +
    '[data-theme="dark"] {\n' +
    formattedVariables({
      format: 'tailwind',
      dictionary: groupedTokens.dark,
      outputReferences
    }).replace(/-dark-/gm, '-') +
    '\n}\n'
  )
}
