import React from 'react'
import CodeBlock from '@theme/CodeBlock'

function setGlobals(collectorUrl, appId) {
  window.collectorUrl = collectorUrl
  window.appId = appId
}

export function UserTracker() {
  const [collectorUrl, setCollectorUrl] = React.useState(
    'http://localhost:9090'
  )
  const [appId, setAppId] = React.useState('snowplow-docs')

  return (
    <>
      <label>
        Collector URL
        <input
          value={collectorUrl}
          onChange={(e) => setCollectorUrl(e.target.value)}
        />
      </label>
      <label>
        App ID
        <input value={appId} onChange={(e) => setAppId(e.target.value)} />
      </label>
      <button
        onClick={() => {
          setGlobals(collectorUrl, appId)
          window.snowplow('newTracker', appId, collectorUrl, {
            appId,
            buffer: 1,
          })
        }}
      >
        Set Tracker
      </button>
    </>
  )
}

export function JavaScriptTrackerExecutable(content) {
  return (
    <div>
      <CodeBlock language="javascript">{content.children}</CodeBlock>
      <div className="button-container">
        <button
          className="button button--primary"
          onClick={() => {
            eval(content.children)
            console.log('Running:\n', content.children)
          }}
        >
          Run
        </button>
      </div>
    </div>
  )
}
