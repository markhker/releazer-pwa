import React, { useContext } from 'react'
import { createGlobalStyle } from 'styled-components'
import get from 'lodash.get'

import Nav from './Nav'
import Toast from './Toast'
import { Store } from '../store'
import useToggleAction from '../hooks/useToggleAction'
import { NAV, TOAST } from '../config/actions'

const GlobalStyle = createGlobalStyle`
  html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-rendering: optimizeLegibility;
    font-size: 10px;
    height: 100%;
  }

  *, ::after, ::before {
    box-sizing: border-box;
    font-weight: 300;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100vw;
    font-family: 'Roboto';
    font-size: 1.6rem;
  }

  h3 {
    font-size: 2rem;
  }

  h4 {
    font-size: 1.6rem;
  }
`

const App = ({ children }) => {
  const { state } = useContext(Store)
  const [nav] = useToggleAction(NAV)
  const [toast] = useToggleAction(TOAST)

  const menuOpen = state.ui.isNavOpen
  const { isToastOpen } = state.ui
  const user = state.user.length && state.user.filter(item => item.email !== undefined)[0]
  const libraries = (state.user.length && state.user.filter(item => item.libraryId !== undefined)) || []
  const roles = get(user, 'userRoles', ['user'])

  const toggleNavOpen = () => {
    menuOpen ? nav.close() : nav.open()
  }

  return (
    <>
      <GlobalStyle />
      <Nav
        isNavOpen={menuOpen}
        toggle={toggleNavOpen}
        progressMax={roles.includes('admin') ? Infinity : 10}
        progressValue={libraries.length}
        allActive
        libraries={libraries}
      />
      {children}
      {
        isToastOpen &&
          <Toast
            onClose={toast.close}
          />
      }
    </>
  )
}

export default App
