import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'

import { Store } from '../store'

const Home = ({ navigate }) => {
  const { state } = useContext(Store)
  const isAuth = state.isAuth

  useEffect(() => {
    isAuth && navigate('../releases')
  })

  return (
    <Layout>
      <Head>
        <Logo />
        <Title>Releazer</Title>
      </Head>
      <Subtitle>
        Start following your favorite GithHub libraries Releases
      </Subtitle>
      <Link to='login'><LoginButton>Log in</LoginButton></Link>
      <Bullet> Follow the new releases of your selected github libraries </Bullet>
      <Bullet> You will get web push notifications every time a new version of your libraries comes out </Bullet>
      <Bullet> Your followings will be saved to the cloud </Bullet>
      <Bullet> You can login on every one of your devices </Bullet>

      <h2>
        You can make comments, report bugs or request features at <a href='https://github.com/markhker/releazer-pwa'> the Releazer Github Page</a>
      </h2>
      <Footer>
        © Releazer & C&K Team 2019. Coded by <a href='https://github.com/markhker'>@markhker</a>
      </Footer>
    </Layout>
  )
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 3.5rem;
  justify-content: space-between;
  max-width: 60rem;
  margin: 0 auto;

  a {
    color: ${props => props.theme.primaryVivid500};
    text-decoration: none;
  }
`

const Logo = styled.div`
  height: 8rem;
  width: 8rem;
  border: 1.5rem solid ${props => props.theme.neutral900};
  border-radius: 50%;
`

const Head = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3rem;
`

const Title = styled.h1`
  margin-left: 2rem;
  font-weight: 500;
`

const Subtitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 500;
  margin: 8rem 0;
`

const Bullet = styled.p`
  border-left: 5px solid ${props => props.theme.primaryVivid500};
  padding-left: 1rem;
  font-size: 2.1rem;
`

const Footer = styled.footer`
  margin: 4rem 0;
  text-align: center;
  color: ${props => props.theme.neutral700};
`

const LoginButton = styled.button`
  color: ${props => props.theme.white};
  background-color: ${props => props.theme.primaryVivid500};
  border-radius: 3rem;
  height: 6rem;
  width: 100%;
  font-size: 3rem;
  font-weight: 500;
  border: none;
  text-transform: uppercase;
  text-decoration: none;
  outline: none !important;
  transition: 0.2s ease-out;
  box-shadow: ${props => props.theme.dp2};
  cursor: pointer;
  margin: 8rem 0;

  :hover {
    box-shadow: ${props => props.theme.dp5};
  }
`

export default Home
