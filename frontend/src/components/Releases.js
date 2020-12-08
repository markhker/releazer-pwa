import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { API } from 'aws-amplify'
import get from 'lodash.get'

import Header from './Header'
import Icon from './Icon'
import Modal from './Modal'
import Card from './Card'
import Button from './Button'
import { Store } from '../store'
import useDebounce from '../hooks/useDebounce'

import useToggleAction from '../hooks/useToggleAction'
import useAsyncAction from '../hooks/useAsyncAction'
import { MODAL, NAV, TOAST, ADD_LIBRARY, LOGIN_USER } from '../config/actions'

const Releases = props => {
  const [addInput, setAddInput] = useState('')
  const [search, setSearch] = useState([])
  const { state } = useContext(Store)
  const [modal] = useToggleAction(MODAL)
  const [nav] = useToggleAction(NAV)
  const [toast] = useToggleAction(TOAST)
  const [libraryAction] = useAsyncAction(ADD_LIBRARY)
  const [loginAction] = useAsyncAction(LOGIN_USER)

  const { isModalOpen, isLibraryLoading, isNotifToastOpen, isLoginLoading } = state.ui
  const user = (state.user.length && state.user.filter(item => item.email !== undefined)[0]) || {}
  const libraries = (state.user.length && state.user.filter(item => item.libraryId !== undefined)) || []
  const following = Object.values(get(user, 'following', 0))

  const debouncedSearchTerm = useDebounce(addInput, 500)

  useEffect(() => {
    init()
    isNotifToastOpen && user.email && initPushNotifications()
  }, [state.user])

  useEffect(() => {
    debouncedSearchTerm ? searchLibrary() : setAddInput('')
  }, [debouncedSearchTerm])

  const init = async () => {
    if (user && user.length <= 0) {
      const userData = await API.get('getuser', '/getuser')
      userData.ok ? loginAction.success(userData.data) : loginAction.fail(userData)
    }
  }

  const initPushNotifications = async () => {
    window.OneSignal.push(() => {
      window.OneSignal.showSlidedownPrompt()
      window.OneSignal.on('notificationPermissionChange', (permissionChange) => {
        if (permissionChange.to === 'granted') {
          window.OneSignal.setEmail(user.email)
        }
        toast.close()
      })
    })
  }

  const searchLibrary = async () => {
    try {
      const searchLibs = await API.get('searchlibrary', `/searchlibrary?q=${addInput}`)
      searchLibs.ok && setSearch(searchLibs.searchResults)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleModalChange = value => {
    setAddInput(value)
  }

  const handleSearchItemClick = value => {
    setAddInput(value)
  }

  const okClickHandler = async () => {
    if (following.length === 10 && !user.roles.includes('admin')) {
      // Move this condition to the server
      toast.open({ title: 'Exceeded', msg: 'You only can have 10 libraries following', type: 'error' })
      return
    }

    libraryAction()
    const libraryId = await API.get('libraryid', `/libraryid?name=${addInput}`)
    if (libraryId.ok) {
      const id = libraryId.id.toString()
      if (following.includes(id)) {
        libraryAction.fail('You have already added this library')
      } else {
        const library = await API.get('library', `/library?id=${libraryId.id}&name=${addInput}`)
        library.ok ? libraryAction.success(library.data) : libraryAction.fail(library)
        toast.open({ title: 'Done', msg: `Library ${addInput} successfully added.`, type: 'success' })
        handleModalChange('')
      }
    } else {
      libraryAction.fail(libraryId)
      if (!libraryId.ok) {
        libraryId.error === 'Library not found' && toast.open({ title: 'Error', msg: `Library ${addInput} not found.`, type: 'error' })
      }
    }
  }

  const handleCloseModal = () => {
    modal.close()
    setAddInput('')
    setSearch([])
  }

  return (
    <>
      <Button floating danger onClick={modal.open}><Icon name='add' size={2} /></Button>
      {
        isModalOpen &&
          <Modal
            id='modal'
            modalSize='responsive'
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title='Add library releases'
            input='Name of library'
            inputContent={addInput}
            onInputChange={handleModalChange}
            onItemClick={handleSearchItemClick}
            content='e.g: facebook/react, webpack/webpack'
            okButton='Add'
            okClick={okClickHandler}
            search={search}
          />
      }
      <Header onMenuClick={() => nav.open()} title='Latest Libraries' loading={isLibraryLoading || isLoginLoading} />
      <ContentWrapper>
        {
          (libraries.length === 0 && !isLoginLoading) &&
            <>
              <p>
                You don't have any library yet. <br />
                Start watching releases by clicking the "plus" button.
              </p>
              <Icon className='add' name='add_circle_outline' size={10} onClick={modal.open} />
            </>
        }
        {
          libraries.length > 0 &&
          libraries.sort((a, b) => {
            if (a.lastUpdated < b.lastUpdated) {
              return 1
            }
            if (a.lastUpdated > b.lastUpdated) {
              return -1
            }
            return 0
          }).map((library) => {
            if (library.versions.length) {
              return <Card key={library.libraryId} library={library} />
            }
          })
        }
      </ContentWrapper>
    </>
  )
}


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 100%;
  padding-bottom: ${props => props.theme.navHeight};
  max-width: 60rem;
  margin: ${props => props.theme.navHeight} auto;

  h1 {
    font-size: 2rem;
    font-weight: 500;
  }

  p {
    font-weight: 400;
    font-size: 1.8rem;
    margin: 3rem;
  }

  .add {
    color: ${props => props.theme.neutral900};
    text-align: center;
  }
`

export default Releases
