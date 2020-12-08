import React from 'react'
import styled, { keyframes } from 'styled-components'

const CircleLoader = (props) => {
  return (
    <Circle {...props}>
      <circle className='path' cx='25' cy='25' r='20' />
    </Circle>
  )
}

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const dash = keyframes`
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -124;
  }
`

const Circle = styled.svg`
  width: 5rem;
  height: 5rem;
  animation: ${rotate} 2s linear infinite;

  .path {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
    stroke-width: 6;
    stroke-miterlimit: 10;
    fill: none;
    animation: ${dash} 1.5s ease-in-out infinite;
    stroke-linecap: round;
    stroke: ${props =>
    props.white
      ? '#fff'
      : props.theme.primaryVivid500};
  }
`

export default CircleLoader
