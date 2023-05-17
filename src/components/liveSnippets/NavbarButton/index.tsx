import React, { useEffect } from 'react'
import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material'
import FlashOnIcon from '@mui/icons-material/FlashOnRounded'

import { LiveSnippetModal } from '../Modal'
import styles from './styles.module.css'

import {
  liveSnippetsEnabled,
  newTrackerFromLocalStorageOptions,
} from '../liveSnippetUtils'

const successAlert = (show, onClose) => {
  return (
    <Snackbar open={show} autoHideDuration={5000} onClose={onClose}>
      <Alert
        sx={{ color: 'primary' }}
        variant="filled"
        severity="success"
        className={styles.successAlert}
      >
        <AlertTitle>Live Snippets Enabled 🎉</AlertTitle>
        Events with App ID{' '}
        <span className={styles.successAlertCollectorUrl}>
          {localStorage.getItem('appId')}
        </span>{' '}
        will be sent to{' '}
        <span className={styles.successAlertCollectorUrl}>
          {localStorage.getItem('collectorEndpoint')}
        </span>
      </Alert>
    </Snackbar>
  )
}

export default function LiveSnippetNavbarItem(props: {
  mobile?: boolean
}): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [enabled, setEnabled] = React.useState(liveSnippetsEnabled())

  useEffect(() => {
    const observer = new MutationObserver((mutation) => {
      for (const mut of mutation) {
        if (
          mut.type === 'attributes' &&
          (mut.target as any).classList.contains('DocSearch--active')
        ) {
          closeModal()
        }
      }
    })

    observer.observe(document.body, {
      attributes: true,
    })
  }, [])

  const openModal = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeModal = () => {
    setAnchorEl(null)
  }

  const [openSuccessAlert, setShowSuccessAlert] = React.useState(false)

  const handleAlertClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setShowSuccessAlert(false)
  }

  useEffect(() => {
    if (liveSnippetsEnabled()) {
      newTrackerFromLocalStorageOptions()
    }
  }, [])

  return (
    <>
      <IconButton
        size="small"
        title={
          enabled
            ? 'Live Snippets enabled!'
            : 'Enables or disables Live Snippets'
        }
        sx={{
          ml: 1,
          mr: 0.5,
          transition: 'background-color 0.2s',
          color: enabled ? '#FDCA40' : 'inherit',
        }}
        className={`${styles.liveSnippetButton} ${
          Boolean(anchorEl) ? styles.snippetButtonModalOpen : ''
        }
        ${
          enabled
            ? styles.liveSnippetIconActive
            : styles.liveSnippetIconInactive
        }
        `}
        onClick={(e) => {
          openModal(e)
        }}
      >
        <FlashOnIcon sx={{ transform: 'translate(0.5px, 1px)' }} />
      </IconButton>

      {anchorEl && (
        <LiveSnippetModal
          setShowSuccessAlert={setShowSuccessAlert}
          anchorEl={anchorEl}
          closeModal={closeModal}
          setLiveSnippetsEnabled={setEnabled}
        />
      )}
      {successAlert(openSuccessAlert, handleAlertClose)}
    </>
  )
}
