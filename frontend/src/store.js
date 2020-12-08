import React, { useReducer } from 'react'

export const Store = React.createContext()

const initialState = {
  error: null,
  isAuth: false,
  ui: {
    isLoginLoading: false,
    isLibraryLoading: false,
    isNavOpen: false,
    isModalOpen: false,
    isToastOpen: false,
    isNotifToastOpen: false,
    toastContent: {
      toastTitle: '',
      msg: '',
      type: null,
      buttonText: null,
      left: false,
      onOk: false,
      executeFunction: false
    }
  },
  user: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_USER@REQUEST':
      return { ...state, ui: { ...state.ui, isLoginLoading: true } }
    case 'LOGIN_USER@SUCCESS':
      return { ...state, isAuth: true, ui: { ...state.ui, isLoginLoading: false }, user: [...action.payload] }
    case 'LOGIN_USER@FAIL':
      return { ...state, isAuth: false, ui: { ...state.ui, isLoginLoading: false }, error: action.payload, user: {} }
    case 'ADD_LIBRARY@REQUEST':
      return { ...state, ui: { ...state.ui, isLibraryLoading: true } }
    case 'ADD_LIBRARY@SUCCESS':
      return {
        ...state,
        ui: {
          ...state.ui,
          isLibraryLoading: false
        },
        user: [
          ...state.user,
          action.payload
        ]
      }
    case 'ADD_LIBRARY@FAIL':
      return { ...state, ui: { ...state.ui, isLibraryLoading: false }, error: action.payload }
    case 'GET_LIBRARY@REQUEST':
      return { ...state, ui: { ...state.ui, isLibraryLoading: true } }
    case 'GET_LIBRARY@SUCCESS':
      return { ...state, ui: { ...state.ui, isLibraryLoading: false }, libraries: { ...state.libraries, ...action.payload } }
    case 'GET_LIBRARY@FAIL':
      return { ...state, ui: { ...state.ui, isLibraryLoading: false }, error: action.payload }
    case 'REMOVE_LIBRARY':
      return { ...state, user: { ...state.user, following: action.payload } }
    case 'CLEAR_LIBRARY':
      return { ...state, libraries: {} }
    case 'LOGOUT_USER':
      return { ...state, isAuth: false }
    case 'NAV@OPEN':
      return { ...state, ui: { ...state.ui, isNavOpen: true } }
    case 'NAV@CLOSE':
      return { ...state, ui: { ...state.ui, isNavOpen: false } }
    case 'MODAL@OPEN':
      return { ...state, ui: { ...state.ui, isModalOpen: true } }
    case 'MODAL@CLOSE':
      return { ...state, ui: { ...state.ui, isModalOpen: false } }
    case 'TOAST@OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          isToastOpen: true,
          toastContent: {
            toastTitle: action.payload.title,
            msg: action.payload.msg,
            type: action.payload.type,
            buttonText: action.payload.buttonText,
            left: action.payload.left,
            onOk: action.payload.onOk,
            executeFunction: action.payload.executeFunction
          }
        }
      }
    case 'TOAST@CLOSE':
      return { ...state, ui: { ...state.ui, isToastOpen: false, toastContent: { title: '', msg: '', type: null, buttonText: null } } }
    case 'NOTIF_TOAST@OPEN':
      return { ...state, ui: { ...state.ui, isNotifToastOpen: true } }
    case 'NOTIF_TOAST@CLOSE':
      return { ...state, ui: { ...state.ui, isNotifToastOpen: false } }
    default:
      return state
  }
}

export const StoreProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
