import React, { useContext, useState, useEffect } from 'react'
import { Link, navigate } from '@reach/router'
import styled from 'styled-components'
import get from 'lodash.get'
import { Auth } from 'aws-amplify'

import useAsyncAction from '../hooks/useAsyncAction'
import Button from './Button'
import Icon from './Icon'
import Progressbar from './Progressbar'
import Avatar from './Avatar'
import { Store } from '../store'
import { LOGIN_USER } from '../config/actions'

const Nav = ({ toggle, isNavOpen, progressValue, progressMax, libraries }) => {
  const { state } = useContext(Store)
  const isAuth = state.isAuth
  const user = state.user.length && state.user.filter(item => item.email !== undefined)[0]
  const userName = get(user, 'email', 'User')
  const [libsOpen, setLibsOpen] = useState(false)
  const [install, setInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [loginAction] = useAsyncAction(LOGIN_USER)

  useEffect(() => {
    windowEventListeners()
  }, [])

  const windowEventListeners = () => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      setDeferredPrompt(e)
      setInstall(true)
    })

    window.addEventListener('appinstalled', e => {
      console.log('a2hs installed', e)
    })
  }

  const addToHomeScreen = async () => {
    setInstall(false)
    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt')
    } else {
      console.log('User dismissed the A2HS prompt')
    }
    setDeferredPrompt(null)
  }

  const notInstall = () => {
    setInstall(false)
  }

  const toggleLibraries = () => {
    setLibsOpen(!libsOpen)
  }

  const closeNavAndLibs = () => {
    toggle()
    toggleLibraries()
  }

  const logout = async () => {
    const logout = await Auth.signOut()
    toggle()
    loginAction.fail('logged out')
    typeof logout === 'undefined' && navigate('/login')
    await window.OneSignal.logoutEmail()
  }

  return (
    <NavWrapper open={isNavOpen}>
      {
        isAuth &&
          <>
            <div className='header'>
              <Icon className='hide' name='arrow_back' onClick={toggle} />
              <Logout onClick={logout}>Log Out</Logout>
              <Avatar src={''} alt={userName} noUser />
              <h3>{userName}</h3>
              {/* <h4>{user.nickname}</h4> */}
              <Progressbar max={progressMax} value={progressValue} />
            </div>
            <List>
              <li>
                <Link to='/releases' onClick={closeNavAndLibs}>All Releases</Link>
              </li>
              <li onClick={toggleLibraries}>
                Libraries <Icon name='expand_more' size={2} />
              </li>
              <Dropdown expanded={libsOpen}>
                {
                  libraries.length > 0 &&
                    libraries.sort((a, b) => {
                      if (a.libraryName < b.libraryName) {
                        return 1
                      }
                      if (a.libraryName > b.libraryName) {
                        return -1
                      }
                      return 0
                    }).map((library) => (
                      <li key={library.libraryId}>
                        <Link to={`/library/${library.libraryId}`} onClick={toggle}>{library.libraryName}</Link>
                      </li>
                    ))
                }
              </Dropdown>
            </List>
            {install &&
              <Install className='ad2hs-prompt'>
                <div className='head'>
                  <Logo />
                  <p className='title'>
                    Keep track of your libraries
                    <br />
                    <span>
                      Add Releazer App to your applications
                    </span>
                  </p>
                </div>
                <div className='buttons'>
                  <Button
                    flat
                    whiteText
                    small
                    onClick={notInstall}
                  >
                    Not now
                  </Button>
                  <Button
                    success
                    small
                    onClick={addToHomeScreen}
                  >
                    Install
                  </Button>
                </div>
              </Install>}
          </>
      }
    </NavWrapper>
  )
}

const NavWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  left: 0;
  top: 0;
  height: 100%;
  overflow-y: scroll;
  width: 80%;
  max-width: 35rem;
  transform: ${props => props.open ? 'translateX(0)' : 'translateX(-100%)'};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.white} 0%, ${theme.primary} 100%)`};
  z-index: 999;
  transition: transform 300ms ease-in-out;
  box-shadow: ${props => props.theme.dp5};

  .hide {
    display: flex;
    align-self: flex-start;
    margin-left: -20px;
    color: ${props => props.theme.neutral900};
    cursor: pointer;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 3.5rem;

    h3, h4 {
      margin-top: .5rem;
      margin-bottom: 0;
      color: ${props => props.theme.neutral900};
    }
    h4 {
      color: ${props => props.theme.accentVivid100};
    }
  }
`

const Logo = styled.div`
  height: 6rem;
  width: 6rem;
  border: 1rem solid ${props => props.theme.white};
  border-radius: 50%;
`

const Logout = styled.p`
  position: absolute;
  right: 20px;
  margin: .5rem 0;
  cursor: pointer;
  color: ${props => props.theme.neutral900};
`

const List = styled.ul`
  flex: 1 0 auto;
  width: 100%;
  list-style-type: none;
  margin-bottom: 0;
  padding: 0;
  box-shadow: ${props => props.inner ? 'none' : '0px -2px 5px 0px rgba(0,0,0,0.15)'};

  li {
    display: flex;
    overflow-y: scroll;
    height: 5.5rem;
    padding-left: ${props => props.inner ? '4.5rem' : '3.5rem'};
    align-items: center;
    color: ${props => props.theme.neutral900};
    border-left: ${props => props.active ? '4px solid #fff' : 'none'};
    cursor: pointer;

    a {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      color: ${props => props.theme.neutral900};
      text-decoration: none;
    }
  }
`

const Dropdown = styled.div`
  max-height: ${props =>
    props.expanded
      ? '1000rem'
      : '0'};
  position: relative;
  display: block;
  overflow: hidden;
  height: auto;
  padding-left: .8rem;
  background-color: ${props => props.theme.white};
  transition: all ease-out 300ms;

  li {
    text-transform: capitalize;
  }
`

const Install = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: ${props => props.theme.primary700};
  color: ${props => props.theme.white};

  .head {
    display: flex;
    padding: 1rem 2rem;
  }

  .title {
    flex: 1;
    margin: 0 1rem;
    font-size: 2rem;
    font-weight: 500;

    span {
      font-size: 1.5rem;
    }
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 2rem;
  }
`

export default Nav
