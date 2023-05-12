import React from 'react'
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Popover,
  InputAdornment,
  IconButton,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

import styles from './styles.module.css'

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

type ModalState = {
  value: string
  error: string
  disabled: boolean
}

type ModalInput = {
  cookieName: string
  inputRef: React.RefObject<HTMLInputElement>
  state: ModalState
  setState: React.Dispatch<React.SetStateAction<ModalState>>
  clear: () => void
  save: () => void
  delete: () => void
  getError: () => string
}

const clearModalInput = (input: ModalInput) => {
  input.setState({
    value: '',
    error: '',
    disabled: false,
  })
  input.delete()
}

const createModalInput = (
  name: string,
  getError: (val: string) => string
): ModalInput => {
  const [state, setState] = React.useState<ModalState>({
    value: localStorage.getItem(name) || '',
    error: '',
    disabled: Boolean(localStorage.getItem(name)),
  })

  let ret: ModalInput = {
    cookieName: name,
    inputRef: React.useRef<HTMLInputElement>(null),
    state,
    setState,
    clear: () => clearModalInput(ret),
    save: () => localStorage.setItem(ret.cookieName, ret.state.value),
    delete: () => localStorage.removeItem(ret.cookieName),
    getError: () => getError(ret.state.value),
  }

  return ret
}

export function LiveSnippetModal(props: {
  setShowSuccessAlert: (show: boolean) => void
  anchorEl: any
  handleClose: () => void
  setEnabled: (enabled: boolean) => void
}) {
  const collector = createModalInput(
    'collectorEndpoint',
    getCollectorEndpointError
  )

  const appId = createModalInput('appId', getAppIdError)

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
                ref={collector.inputRef}
                disabled={collector.state.disabled}
                sx={{ m: 1, mx: 0 }}
                variant="outlined"
                fullWidth
                value={collector.state.value}
                onChange={(e) => {
                  collector.setState((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }}
                label={'Collector endpoint'}
                error={Boolean(collector.state.error)}
                helperText={collector.state.error}
                InputProps={{
                  endAdornment: collector.state.disabled && (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          collector.clear()
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
              ref={appId.inputRef}
              disabled={appId.state.disabled}
              sx={{ m: 1, mx: 0 }}
              margin="normal"
              fullWidth
              value={appId.state.value}
              onChange={(e) => {
                appId.setState((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }}
              className={styles.inputBox}
              label="App ID"
              error={Boolean(appId.state.error)}
              helperText={appId.state.error}
              InputProps={{
                endAdornment: appId.state.disabled && (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => {
                        appId.clear()
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
                disabled={collector.state.disabled && appId.state.disabled}
                sx={{ ml: 1 }}
                variant="contained"
                onClick={() => {
                  // Validate the inputs
                  const collectorEndpointError = collector.getError()
                  const appIdError = appId.getError()

                  if (collectorEndpointError === '' && appIdError === '') {
                    // Save the states to cookies
                    collector.save()

                    collector.setState((prev) => ({
                      ...prev,
                      disabled: true,
                    }))

                    appId.save()
                    appId.setState((prev) => ({
                      ...prev,
                      disabled: true,
                    }))

                    props.setEnabled(true)
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
  )
}
