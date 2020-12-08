import React from 'react'
import styled, { keyframes } from 'styled-components'

const Loader = () => (
  <LoaderWrapper>
    <div className='container-bubble'>
      <Bubble className='bubble1' />
    </div>
    <div className='container-bubble'>
      <Bubble className='bubble2' />
    </div>
    <div className='container-bubble'>
      <Bubble className='bubble3' />
    </div>
    <div className='container-bubble'>
      <Bubble className='bubble4' />
    </div>
  </LoaderWrapper>
)

const inflate = keyframes`
  0% {
    transform: scale(1);
    animation-timing-function: ease-in;
  }
  33% {
    transform: scale(2);
    animation-timing-function: ease-out;
  }
  66% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
  100% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
`

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  overflow: hidden;
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  z-index: 99999;
  .container-bubble {
    width:2em;
    height:2em;
  }
  .bubble1 {
    animation-delay: 0%;
    background: #0057e7;
  }
  .bubble2 {
    animation-delay: 0.25s;
    background: #d62d20;
  }
  .bubble3 {
    animation-delay: 0.50s;
    background: #ffa700;
  }
  .bubble4 {
    animation-delay: 0.75s;
    background: #008744;
  }
`

const Bubble = styled.div`
  background: #383838;
  border-radius: 50%;
  width: 1em;
  height:1em;
  animation: ${inflate} 1.5s ease-in-out infinite;
`

export default Loader
