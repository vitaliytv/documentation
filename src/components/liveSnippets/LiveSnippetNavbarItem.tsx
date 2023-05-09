import React from 'react'
import { LiveSnippetModal } from './LiveSnippetModal'
import styles from './styles.module.css'
import FlashOnIcon from '@mui/icons-material/FlashOnRounded'
import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material'

const getCookie = (name: string) => {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name))
      ?.split('=')[1] || ''
  )
}

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
        Events will be sent to{' '}
        <span className={styles.successAlertCollectorUrl}>
          {getCookie('collectorEndpoint')}
        </span>
      </Alert>
    </Snackbar>
  )
}

const liveSnippetsEnabled = () =>
  getCookie('collectorEndpoint') !== '' && getCookie('appId') !== ''

export default function LiveSnippetNavbarItem(props: {
  mobile?: boolean
}): JSX.Element {
  const [showModal, setShowModal] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [enabled, setEnabled] = React.useState(liveSnippetsEnabled())

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [open, setOpen] = React.useState(false)

  const handleAlertClick = () => {
    setOpen(true)
  }

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

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
          setShowModal(!showModal)
          handleClick(e)
        }}
      >
        <FlashOnIcon sx={{ transform: 'translate(0.5px, 1px)' }} />
      </IconButton>

      {anchorEl && (
        <LiveSnippetModal
          showModal={enabled}
          setShowSuccess={setOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          setEnabled={setEnabled}
        />
      )}
      {successAlert(open, handleAlertClose)}
    </>
  )
}
