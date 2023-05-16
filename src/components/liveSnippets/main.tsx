import React from 'react'
import CodeBlock from '@theme/CodeBlock'

import { parseSnowplowJsTrackerMethod } from './walker'

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

            const trackerNameSpace =
              ':snowplowDocs-' + localStorage.getItem('liveSnippetTrackerId')

            window.snowplow(
              parsedSnowplowCall.method + trackerNameSpace,
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
