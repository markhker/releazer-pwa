import React from 'react'
import styled from 'styled-components'

import { getReleaseType, getChangelogReleaseUrl, sortVersions } from '../helpers/functions'

const Card = props => {
  const { library, version, isSingle } = props
  const sortedVersions = sortVersions(library.versions)
  const releaseType = version ? getReleaseType(version) : getReleaseType(sortedVersions[0])
  const url = getChangelogReleaseUrl(library.libraryUrl, isSingle ? version : library.versions[0])
  const avatarUrl = `${library.avatar}&size=60`

  return (
    <CardWrapper
      {...props}
      onClick={props.onClick}
    >
      <a href={url}>
        <img src={avatarUrl} alt={library.libraryName} />
        <div className='name'>
          <h2>{library.libraryName}</h2>
          <p>{releaseType}</p>
        </div>
        <div className='version'>
          {
            version
              ? <p>{version}</p>
              : <p>{library.versions[0]}</p>
          }
        </div>
      </a>
    </CardWrapper>
  )
}

const CardWrapper = styled.div`
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.neutral900};
  padding: 1rem;
  margin: 0;
  font-size: 2rem;
  font-weight: 500;
  border: none;
  text-decoration: none;
  outline: none !important;
  transition: all 0.2s ease-out;
  border-bottom: 2px solid hsl(210, 23%, 95%);
  cursor: pointer;

  :hover {
    box-shadow: ${props => props.theme.dp5};
    z-index: 99;
  }

  a {
    position: relative;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${props => props.theme.neutral900};
  }

  img {
    width: 4rem;
  }

  .name {
    margin-left: 1rem;

    h2 {
      text-transform: capitalize;
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
    }

    p {
      font-size: 1.3rem;
      margin: 0;
    }
  }

  .version {
    position: absolute;
    right: 0;

    p {
      font-size: 1.2rem;
      margin: 0;
      font-weight: 700;
      background-color: ${props => props.theme.accentVivid100};
      color: ${props => props.theme.accentVivid800};
      padding: .5rem 1rem;
      border-radius: 1.5rem;
    }
  }
`

export default Card
