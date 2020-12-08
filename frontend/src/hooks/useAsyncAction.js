import { useContext } from 'react'

import { Store } from '../store'

const ACTION_ASYNC_REQUEST_SUFFIX = '@REQUEST'
const ACTION_ASYNC_SUCCESS_SUFFIX = '@SUCCESS'
const ACTION_ASYNC_FAILURE_SUFFIX = '@FAIL'

const ACTION_ASYNC_SUCCESS_METHOD = 'success'
const ACTION_ASYNC_FAILURE_METHOD = 'fail'

const useAsyncAction = type => {
  const { dispatch } = useContext(Store)

  let action = {}
  action = () => {
    const actionObj = {
      type: `${type}${ACTION_ASYNC_REQUEST_SUFFIX}`
    }
    return dispatch(actionObj)
  }

  action[ACTION_ASYNC_SUCCESS_METHOD] = payload => {
    const actionObj = {
      type: `${type}${ACTION_ASYNC_SUCCESS_SUFFIX}`,
      payload
    }
    return dispatch(actionObj)
  }

  action[ACTION_ASYNC_FAILURE_METHOD] = err => {
    const actionObj = {
      type: `${type}${ACTION_ASYNC_FAILURE_SUFFIX}`,
      payload: err
    }
    return dispatch(actionObj)
  }

  return [ action ]
}

export default useAsyncAction
