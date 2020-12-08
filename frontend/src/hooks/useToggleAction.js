import { useContext } from 'react'

import { Store } from '../store'

const ACTION_ASYNC_OPEN_SUFFIX = '@OPEN'
const ACTION_ASYNC_CLOSE_SUFFIX = '@CLOSE'

const ACTION_ASYNC_OPEN_METHOD = 'open'
const ACTION_ASYNC_CLOSE_METHOD = 'close'

const useToggleAction = (type) => {
  const { dispatch } = useContext(Store)

  let action = {}

  action[ACTION_ASYNC_OPEN_METHOD] = (payload = {}) => {
    const actionObj = {
      type: `${type}${ACTION_ASYNC_OPEN_SUFFIX}`,
      payload
    }
    return dispatch(actionObj)
  }

  action[ACTION_ASYNC_CLOSE_METHOD] = () => {
    const actionObj = {
      type: `${type}${ACTION_ASYNC_CLOSE_SUFFIX}`
    }
    return dispatch(actionObj)
  }

  return [ action ]
}

export default useToggleAction
