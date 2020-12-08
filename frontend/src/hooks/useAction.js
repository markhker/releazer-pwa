import { useContext } from 'react'

import { Store } from '../store'

const useAction = type => {
  const { dispatch } = useContext(Store)

  const action = payload => {
    const actionObj = {
      type,
      payload: payload || null
    }
    return dispatch(actionObj)
  }

  return [action]
}

export default useAction
