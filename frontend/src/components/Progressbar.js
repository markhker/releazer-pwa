import React from 'react'
import styled from 'styled-components'

const Progressbar = ({ max, value }) => {
  return (
    <Progress>
      <progress max={max} value={value} />
      <p>{value} of {max} watching</p>
    </Progress>
  )
}

const Progress = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  margin-top: 4rem;

  progress {
    width: 100%;
    height: .8rem;
    appearance: none;

    ::-webkit-progress-bar {
      background-color: ${props => props.theme.mainBackground};
      border-radius: 1rem;
      box-shadow: 0px 1px 0px 0px rgba(255,255,255,0.15), inset 0px 2px 0px 0px rgba(0,0,0,0.15);
    }

    ::-webkit-progress-value {
      background-color: ${props => props.theme.accentVivid500};
      border-radius: 1rem;
    }
  }

  p {
    font-size: 1rem;
    color: ${props => props.theme.neutral900};
  }
`

export default Progressbar
