import React, { useContext, useEffect } from 'react'
import { navigate } from '@reach/router'
import styled from 'styled-components'
import { API } from 'aws-amplify'
import get from 'lodash.get'

import Header from './Header'
import Card from './Card'
import Loader from './Loader'

import { Store } from '../store'
import useAsyncAction from '../hooks/useAsyncAction'
import useToggleAction from '../hooks/useToggleAction'
import useAction from '../hooks/useAction'
import useInterval from '../hooks/useInterval'
import { sortVersions } from '../helpers/functions'
import { TOAST, NAV, REMOVE_LIBRARY, LOGIN_USER } from '../config/actions'

const Library = props => {
  const { state } = useContext(Store)
  const { buttonText } = state.ui.toastContent
  const [remove] = useAction(REMOVE_LIBRARY)
  const [toast] = useToggleAction(TOAST)
  const [nav] = useToggleAction(NAV)
  const [loginAction] = useAsyncAction(LOGIN_USER)

  const user = state.user.length && state.user.filter(item => item.email !== undefined)[0]
  const libraries = (state.user.length && state.user.filter(item => item.libraryId !== undefined)) || []
  const following = Object.values(get(user, 'following', 0))
  const library = libraries.find(item => item.libraryId === props.id)
  const libName = library ? library.libraryName : 'Library'
  const versions = sortVersions(get(library, 'versions', []))

  useEffect(() => {
    init()
  }, [state.user])

  const init = async () => {
    if (user && user.length <= 0) {
      const userData = await API.get('getuser', '/getuser')
      userData.ok ? loginAction.success(userData.data) : loginAction.fail(userData)
    }
  }

  useInterval(() => {
    toast.close()
    deleteLibrary()
  }, buttonText ? 6000 : null)

  const deleteLibrary = async () => {
    const deleteLib = await API.get('deletelibrary', `/deletelibrary?id=${props.id}`)
    if (deleteLib.ok) {
      toast.open({ title: 'Library Deleted', msg: 'Library was deleted', type: 'success', left: true })
      navigate('/releases')
      delete following[props.id]
      remove(following)
    } else {
      toast.open({ title: 'Fail', msg: 'There was an error, try in a moment', type: 'error', left: true })
    }
  }

  const onDeleteHandler = () => {
    toast.open({ title: 'Deleting library', msg: 'This library is going to be Deleted', buttonText: 'Undo', left: true })
  }

  return (
    <>
      {state.ui.isLibraryLoading && <Loader />}
      <Header
        onMenuClick={() => nav.open()}
        onDeleteclick={onDeleteHandler}
        title={`${libName} releases`}
        loading={false}
      />
      <ContentWrapper>
        {
          versions &&
          versions.map((key) => (
            <Card key={key} library={library} version={key} isSingle />
          ))
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
  max-width: 60rem;
  margin: ${props => props.theme.navHeight} auto;
  margin-bottom: 1rem;

  p {
    font-weight: 400;
    font-size: 1.8rem;
    margin-bottom: 3rem;
  }

  .add {
    color: ${props => props.theme.neutral900};
    text-align: center;
  }
`

export default Library
