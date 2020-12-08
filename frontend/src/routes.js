import React from 'react'
import loadable from '@loadable/component'
import Loader from './components/Loader'

export const HomePage = loadable(
  () => import('./pages/home'),
  { fallback: <Loader /> }
)

export const LoginPage = loadable(
  () => import('./pages/login'),
  { fallback: <Loader /> }
)

export const ReleasesPage = loadable(
  () => import('./pages/releases'),
  { fallback: <Loader /> }
)

export const LibraryPage = loadable(
  () => import('./pages/library'),
  { fallback: <Loader /> }
)
