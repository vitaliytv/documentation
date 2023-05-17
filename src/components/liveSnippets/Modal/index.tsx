import React from 'react'
import { v4 as uuidv4 } from 'uuid'
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
import { newTrackerFromAppIdAndCollectorUrl } from '../liveSnippetUtils'

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

/*
 * Represents the mutable state of a text input field on the modal
 * @param value - the value of the text input
 * @param error - the error message to display
 * @param disabled - whether the text input is disabled
 */
type ModalState = {
  value: string
  error: string
  disabled: boolean
}

/*
 * Represents a text input field on the modal
 * @param fieldName - the name of the cookie to store the value in
 * @param inputRef - a ref to the text input, used to focus the input when the field is cleared
 * @param state - the state of the modal
 * @param setState - a function to update the state of the modal
 * @param clear - Clears the text input, sets the error to empty, removes from localStorage, and enables the text input
 * @param save - Saves the text input, sets the error to empty, adds to localStorage, and disables the text input
 * @param delete - Deletes the text input, sets the error to empty, removes from localStorage, and enables the text input
 * @param getError - Returns the error message for the text input
 */
type ModalInput = {
  fieldName: 'appId' | 'collectorEndpoint'
  inputRef: React.RefObject<HTMLInputElement>
  state: ModalState
  setState: React.Dispatch<React.SetStateAction<ModalState>>
  clear: () => void
  saveToStorage: () => void
  removeFromStorage: () => void
  getError: () => string
}

const clearModalInput = (input: ModalInput) => {
  input.setState({
    value: '',
    error: '',
    disabled: false,
  })
  input.removeFromStorage()
}

/*
 * Creates a ModalInput object that can be used to create a modal input
 * @param name - the name of the input (e.g. collectorEndpoint or appId)
 * @param getError - a function that takes in the value of the input and returns an error string
 * @returns a ModalInput object
 */
const createModalInput = (
  fieldName: 'appId' | 'collectorEndpoint',
  getError: (val: string) => string
): ModalInput => {
  const [state, setState] = React.useState<ModalState>({
    value: localStorage.getItem(fieldName) || '',
    error: '',
    disabled: Boolean(localStorage.getItem(fieldName)),
  })

  let ret: ModalInput = {
    fieldName,
    inputRef: React.useRef<HTMLInputElement>(null),
    state,
    setState,
    clear: () => clearModalInput(ret),
    saveToStorage: () => {
      localStorage.setItem(ret.fieldName, ret.state.value)
      setState((prev) => ({ ...prev, disabled: true, error: '' }))
    },
    removeFromStorage: () => {
      localStorage.removeItem(ret.fieldName)
      setState((prev) => ({ ...prev, disabled: false, error: '' }))
    },
    getError: () => getError(ret.state.value),
  }

  return ret
}

/*
 * Set the global namespace for snowplow so typescript doesn't complain
 */
declare global {
  interface Window {
    snowplow: any
  }
}

const ModalTextField = (props: {
  label: string
  modalInput: ModalInput
  setLiveSnippetsEnabled: (enabled: boolean) => void
}) => (
  <TextField
    ref={props.modalInput.inputRef}
    disabled={props.modalInput.state.disabled}
    sx={{ m: 1, mx: 0 }}
    margin="normal"
    fullWidth
    value={props.modalInput.state.value}
    onChange={(e) => {
      props.modalInput.setState((prev) => ({
        ...prev,
        value: e.target.value,
      }))
    }}
    label={props.label}
    error={Boolean(props.modalInput.state.error)}
    helperText={props.modalInput.state.error}
    InputProps={{
      endAdornment: props.modalInput.state.disabled && (
        <InputAdornment position="end">
          <IconButton
            edge="end"
            onClick={() => {
              props.modalInput.clear()
              props.setLiveSnippetsEnabled(false)
            }}
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  ></TextField>
)

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
      modalAnchor={props.modalAnchor}
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
                    collector.saveToStorage()
                    appId.saveToStorage()

                    newTrackerFromAppIdAndCollectorUrl(
                      appId.state.value,
                      collector.state.value
                    )

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
  )
}
