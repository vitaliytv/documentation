import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes'
const LiveSnippetNavbarItem = require.resolve(
  '@site/src/components/LiveSnippets/NavbarButton'
)

export default {
  ...ComponentTypes,
  'custom-liveSnippetNavbarItem': LiveSnippetNavbarItem,
}
