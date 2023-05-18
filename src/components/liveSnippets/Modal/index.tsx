import React, { useEffect } from 'react'

import { Button, Card, CardContent, Typography, Popover } from '@mui/material'

import styles from './styles.module.css'
import { newTrackerFromAppIdAndCollectorUrl } from '../liveSnippetUtils'
import { ModalTextField, createModalInput } from '../ModalTextField'
import BrowserOnly from '@docusaurus/BrowserOnly'

/*
 * Set the global namespace for snowplow so typescript doesn't complain
 */
declare global {
  interface Window {
    snowplow: any
  }
}

const isValidUrl = (s: string) => {
  // Don't error if empty string
  if (s === '') {
    return true
  }

  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

const getCollectorEndpointError = (url: string): string => {
  if (url === '') {
    return 'Required'
  } else if (!isValidUrl(url)) {
    return 'Please enter a valid URL'
  } else {
    return ''
  }
}

const getAppIdError = (appId: string): string => {
  if (appId === '') {
    return 'Required'
  } else {
    return ''
  }
}

export function LiveSnippetModal(props: {
  setShowSuccessAlert: (show: boolean) => void
  modalAnchor: any
  closeModal: () => void
  setLiveSnippetsEnabled: (enabled: boolean) => void
}) {
  const collector = createModalInput(
    'collectorEndpoint',
    getCollectorEndpointError
  )

  const appId = createModalInput('appId', getAppIdError)

  return (
    <BrowserOnly>
      {() => (
        <Popover
          // We need to anchor to the middle and offset with top: 20px
          // as the default anchorOrigin will cause the popover to shift slightly
          // when the button animates
          sx={{ top: '20px' }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          // Disable scroll lock so the page doesn't jump when
          // the modal is opened, due to the scroll bar disappearing
          disableScrollLock={true}
          open={Boolean(props.modalAnchor)}
          anchorEl={props.modalAnchor}
          onClose={props.closeModal}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Card sx={{ p: 3 }} className={styles.liveSnippetModal}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                LIVE SNIPPETS
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Snowplow's live snippets allow you to run specific example code
                snippets, allowing you to explore both how to structure your
                code, and explore the rich data that Snowplow produces.
                <br />
                <br />
                Enter your Collector endpoint and an App ID below to enable this
                feature.
              </Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" sx={{ ml: '2px' }}>
                    Don't have a collector? Get set up quickly with{' '}
                    <a href="/docs/getting-started-with-micro">
                      Snowplow Micro
                    </a>
                  </Typography>

                  <ModalTextField
                    label="Collector Endpoint"
                    modalInput={collector}
                    setLiveSnippetsEnabled={props.setLiveSnippetsEnabled}
                  />
                </div>

                <ModalTextField
                  label="App ID"
                  modalInput={appId}
                  setLiveSnippetsEnabled={props.setLiveSnippetsEnabled}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    disabled={collector.state.disabled && appId.state.disabled}
                    sx={{ ml: 1 }}
                    variant="contained"
                    onClick={() => {
                      // Validate the inputs
                      const collectorEndpointError = collector.getError()
                      const appIdError = appId.getError()

                      if (collectorEndpointError === '' && appIdError === '') {
                        useEffect(() => {
                          collector.saveToStorage()
                          appId.saveToStorage()

                          newTrackerFromAppIdAndCollectorUrl(
                            appId.state.value,
                            collector.state.value
                          )
                        })

                        props.setLiveSnippetsEnabled(true)
                        props.closeModal()
                        props.setShowSuccessAlert(true)
                      } else {
                        collector.setState((prev) => ({
                          ...prev,
                          error: collectorEndpointError,
                        }))

                        appId.setState((prev) => ({
                          ...prev,
                          error: appIdError,
                        }))
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Popover>
      )}
    </BrowserOnly>
  )
}
