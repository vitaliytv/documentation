import React from 'react'
import styles from './styles.module.css'
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Popover,
  InputAdornment,
  IconButton,
  Unstable_TrapFocus,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

const getCookie = (name: string) => {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name))
      ?.split('=')[1] || ''
  )
}

const isValidUrl = (s: string) => {
  // Don't error if empty
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

const getCollectorEndpointError = (url: string) => {
  if (url === '') {
    return 'Required'
  } else if (!isValidUrl(url)) {
    return 'Please enter a valid URL'
  } else {
    return ''
  }
}

const getAppIdError = (appId: string) => {
  if (appId === '') {
    return 'Required'
  } else {
    return ''
  }
}

export function LiveSnippetModal(props: {
  showModal: boolean
  setShowSuccess: (show: boolean) => void
  anchorEl: any
  handleClose: () => void
  setEnabled: (enabled: boolean) => void
}) {
  const [collectorEndpoint, setCollectorEndpoint] = React.useState(
    getCookie('collectorEndpoint')
  )
  const [appId, setAppId] = React.useState(getCookie('appId'))
  const [collectorEndpointError, setCollectorEndpointError] = React.useState('')
  const [appIdError, setAppIdError] = React.useState('')
  const [collectorEndpointInputDisabled, setCollectorEndpointInputDisabled] =
    React.useState(collectorEndpoint !== '')
  const [appIdInputDisabled, setAppIdInputDisabled] = React.useState(
    appId !== ''
  )
  const appIdInputRef = React.useRef<HTMLInputElement>(null)
  const collectorEndpointInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <Popover
      // We need to anchor to the middle and offset with top: 20px
      // as the default anchorOrigin will cause the popover to shift slightly
      // when the button animates
      sx={{ top: '20px' }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      disableScrollLock={true}
      open={Boolean(props.anchorEl)}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
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
            snippets, allowing you to explore both how to structure your code,
            and explore the rich data that Snowplow produces.
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
                <a>Snowplow Micro</a>
              </Typography>

              <TextField
                ref={collectorEndpointInputRef}
                disabled={collectorEndpointInputDisabled}
                sx={{ m: 1, mx: 0 }}
                variant="outlined"
                fullWidth
                value={collectorEndpoint}
                onChange={(e) => {
                  setCollectorEndpoint(e.target.value)
                }}
                label={'Collector endpoint'}
                error={Boolean(collectorEndpointError)}
                helperText={collectorEndpointError}
                InputProps={{
                  endAdornment: collectorEndpointInputDisabled && (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          setCollectorEndpointInputDisabled(false)
                          document.cookie =
                            'collectorEndpoint=; Max-Age=0; SameSite=Strict'
                          setCollectorEndpoint('')
                          setCollectorEndpointError('')
                          props.setEnabled(false)
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </div>

            <TextField
              ref={appIdInputRef}
              disabled={appIdInputDisabled}
              sx={{ m: 1, mx: 0 }}
              margin="normal"
              fullWidth
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className={styles.inputBox}
              label="App ID"
              error={Boolean(appIdError)}
              helperText={appIdError}
              InputProps={{
                endAdornment: appIdInputDisabled && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setAppIdInputDisabled(false)
                        document.cookie = 'appId=; Max-Age=0; SameSite=Strict'
                        setAppId('')
                        setAppIdError('')
                        props.setEnabled(false)
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            ></TextField>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                onClick={() => {
                  // Validate the inputs
                  const collectorEndpointError =
                    getCollectorEndpointError(collectorEndpoint)
                  const appIdError = getAppIdError(appId)

                  if (collectorEndpointError === '' && appIdError === '') {
                    // Save the states to cookies
                    document.cookie = `collectorEndpoint=${collectorEndpoint}; SameSite=Strict`
                    document.cookie = `appId=${appId}; SameSite=Strict`
                    props.setEnabled(true)
                    props.setShowSuccess(true)
                    setCollectorEndpointInputDisabled(true)
                    setAppIdInputDisabled(true)
                  }
                  // Set the error messages either way, as we may need to clear them
                  // from a previous error if the input is now valid
                  setCollectorEndpointError(collectorEndpointError)

                  setAppIdError(appIdError)
                }}
              >
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Popover>
  )
}
