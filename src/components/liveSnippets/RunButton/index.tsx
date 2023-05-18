import React, { useCallback, useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { translate } from '@docusaurus/Translate'
import type { Props } from '@theme/CodeBlock/CopyButton'

import { CircularProgress } from '@mui/material'
import RunIcon from '@mui/icons-material/PlayArrowRounded'
import DoneIcon from '@mui/icons-material/Done'

import styles from './styles.module.css'
import { runSnippet } from '../liveSnippetUtils'

const enum RunState {
  IDLE,
  RUNNING,
  DONE,
}

const getButtonIcon = (runState: RunState) => {
  switch (runState) {
    case RunState.IDLE:
      return <RunIcon className={styles.runButtonIcon} />
    case RunState.RUNNING:
      return (
        <CircularProgress
          size="1.125rem"
          thickness={5}
          className={styles.loadingIcon}
        />
      )
    case RunState.DONE:
      return <DoneIcon className={styles.runButtonIcon} />
  }
}

export default function RunButton({ code, className }: Props): JSX.Element {
  const [runState, setRunState] = useState(RunState.IDLE)
  const runTimeout = useRef<number | undefined>(undefined)

  const handleRunCode = () =>
    useEffect(() => {
      setRunState(RunState.RUNNING)
      runSnippet(code)
      runTimeout.current = window.setTimeout(() => {
        setRunState(RunState.DONE)
        runTimeout.current = window.setTimeout(() => {
          setRunState(RunState.IDLE)
        }, 500)
      }, 750)
    }, [code])

  useEffect(() => () => window.clearTimeout(runTimeout.current), [])

  return (
    <button
      type="button"
      aria-label={
        runState
          ? translate({
              id: 'theme.CodeBlock.run',
              message: 'Run',
              description: 'The run button label on code blocks',
            })
          : translate({
              id: 'theme.CodeBlock.runButtonAriaLabel',
              message: 'Run code',
              description: 'The ARIA label for run code blocks button',
            })
      }
      title={translate({
        id: 'theme.CodeBlock.run',
        message: 'Run',
        description: 'The run button label on code blocks',
      })}
      className={clsx('clean-btn', className, styles.runButton)}
      onClick={handleRunCode}
    >
      <span className={styles.runButtonIcons} aria-hidden="true">
        {getButtonIcon(runState)}
      </span>
    </button>
  )
}
