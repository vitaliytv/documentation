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
            let x = parseSnowplowJsTrackerMethod(content.children)
            console.log(x)
            window.snowplow(
              x.method + window.localStorage.getItem('appId'),
              x.args
            )
          }}
        >
          Run
        </button>
      </div>
    </div>
  )
}
