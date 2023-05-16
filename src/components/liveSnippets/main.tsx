import React from 'react'
import CodeBlock from '@theme/CodeBlock'

import { parseSnowplowJsTrackerMethod } from './walker'
import { getLiveSnippetNamespace } from './trackerHelper'

export function JavaScriptTrackerExecutable(content) {
  return (
    <div>
      <CodeBlock language="javascript">{content.children}</CodeBlock>
      <div className="button-container">
        <button
          className="button button--primary"
          onClick={() => {
            const parsedSnowplowCall = parseSnowplowJsTrackerMethod(
              content.children
            )

            const namespace = getLiveSnippetNamespace()
            if (namespace === null) {
              console.error(
                'Namespace not set for live snippet tracker. If this happens, please file a bug report.'
              )
              return
            }

            window.snowplow(
              parsedSnowplowCall.method + ':' + getLiveSnippetNamespace(),
              ...parsedSnowplowCall.args
            )
          }}
        >
          Run
        </button>
      </div>
    </div>
  )
}
