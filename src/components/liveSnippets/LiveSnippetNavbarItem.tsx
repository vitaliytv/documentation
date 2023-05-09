import React from 'react'
import { LiveSnippetModal } from './LiveSnippetModal'
import styles from './styles.module.css'
import IconButton from '@mui/material/IconButton'
import FlashOnIcon from '@mui/icons-material/FlashOnRounded'

const getCookie = (name: string) => {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name))
      ?.split('=')[1] || ''
  )
}

const successAlert = (show) => {
  return (
    <div
      className={`${styles.successAlert} 
        ${show ? styles.successAlertShow : styles.successAlertHide}
         alert alert--primary`}
      role="alert"
    >
      <button aria-label="Close" className="clean-btn close" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
      Live Snippets enabled! 🎉 Events will be sent to:{' '}
      {getCookie('collectorEndpoint')}
    </div>
  )
}

const liveSnippetsEnabled = () =>
  getCookie('collectorEndpoint') !== '' && getCookie('appId') !== ''

export default function LiveSnippetNavbarItem(props: {
  mobile?: boolean
}): JSX.Element {
  const [showModal, setShowModal] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [enabled, setEnabled] = React.useState(liveSnippetsEnabled())

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
          setShowSuccess={setShowSuccess}
          anchorEl={anchorEl}
          handleClose={handleClose}
          setEnabled={setEnabled}
        />
      )}
      {successAlert(showSuccess)}
    </>
  )
}
