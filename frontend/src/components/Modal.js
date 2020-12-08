import React, { Component } from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'
import Icon from './Icon'
import Input from './Input'
import Button from './Button'

const modalRoot = document.getElementById('modal-root')

class Modal extends Component {
  static defaultProps = {
    id: '',
    modalClass: '',
    modalSize: 'md'
  }

  state = {
    fadeType: null,
    isInputvalid: false,
    isSearchOpen: false
  }

  background = React.createRef()

  componentDidMount() {
    window.addEventListener('keydown', this.onEscKeyDown, false)
    setTimeout(() => this.setState({
      fadeType: 'in'
    }), 0)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isOpen && prevProps.isOpen) {
      this.setState({
        fadeType: 'out'
      })
    }

    if (this.props.search.length && (this.props.search !== prevProps.search)) {
      this.setState({
        isSearchOpen: true
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscKeyDown, false)
  }

  onEscKeyDown = e => {
    if (e.key !== 'Escape') return
    this.setState({
      fadeType: 'out'
    })
  }

  handleClick = e => {
    e.preventDefault()
    this.setState({
      fadeType: 'out',
      isInputvalid: false,
      isSearchOpen: false
    })
  }

  okClick = e => {
    e.preventDefault()
    this.props.okClick()
    this.setState({
      fadeType: 'out'
    })
  }

  transitionEnd = e => {
    if (e.propertyName !== 'opacity' || this.state.fadeType === 'in') return
    if (this.state.fadeType === 'out') {
      this.props.onClose()
    }
  }

  handleChange = e => {
    this.setState({
      isInputvalid: e.target.validity.valid
    })
    this.props.onInputChange(e.target.value)
  }

  handleItemClick = e => {
    this.props.onItemClick(e.target.textContent)
    this.setState({
      isSearchOpen: false,
      isInputvalid: true
    })
  }

  render () {
    const {
      id,
      modalSize,
      modalClass,
      title,
      input,
      inputContent,
      content,
      okButton,
      search
    } = this.props

    return ReactDom.createPortal(
      <StyledModal
        id={id}
        className={`wrapper size-${modalSize} fade-${this.state.fadeType} ${modalClass}`}
        role='dialog'
        modalSize={modalSize}
        onTransitionEnd={this.transitionEnd}
      >
        <div className='dialog'>
          <div className='header'>
            <h4>{title}</h4>
            <Icon onClick={this.handleClick} name='close' size={3} />
          </div>
          <div className='content'>
          {search.length > 0 &&
              <SearchResults isOpen={this.state.isSearchOpen}>
                {
                  search.map((library) => (
                    <li key={library} onClick={this.handleItemClick}>
                      {library}
                    </li>
                  ))
                }
              </SearchResults>
            }
            {input &&
              <Input
                placeholder={input}
                name='addInput'
                required={true}
                value={inputContent}
                handleChange={this.handleChange}
                pattern='^[^/]*\/(?=.)[^/]*$'
                autoComplete='off'
              />
            }

            {content &&
              <div className='textContent'>
                {content}
              </div>
            }
          </div>
          <div className='footer'>
            <Button flat onClick={this.handleClick}>Close</Button>
            {
              okButton &&
              <Button
                primary
                disabled={!this.state.isInputvalid}
                onClick={this.okClick}
              >
                Add
              </Button>
            }
          </div>
        </div>
        <div
          className={`background`}
          onMouseDown={this.handleClick}
          ref={this.background}
        />
      </StyledModal>,
      modalRoot
    )
  }
}

const StyledModal = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity linear 0.15s;
  background-color: ${props => props.theme.white};
  z-index: 2000;
  width: ${props => {
    switch (props.modalSize) {
      case 'lg':
        return '80rem'
      case 'responsive':
        return '100%'
      default:
        return '48rem'
    }
  }};
  max-width: 38rem;
  margin: 4rem auto;

  &.fade-in {
    opacity: 1;
    transition: opacity linear 0.5s;
  }

  &.fade-out {
    opacity: 0;
    transition: opacity linear 0.5s;
  }

  .background {
    background: rgba(0,0,0,0.5);
    position: fixed;
    z-index: 1040;
    display: block;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    outline: 0;
  }

  .dialog {
    z-index: 1050;
    width: 100%;
    background-color: #fff;
    box-shadow: ${props => props.theme.dp15};
    color: ${props => props.theme.neutral900};
    border-radius: 1rem;

    .header {
      height: 5rem;
      padding: 0.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h4 {
        font-size: 2rem;
        font-weight: 400;
        margin: 0;
      }
    }

    .content {
      padding: 2.5rem;
      width: 100%;

      .textContent {
        margin-top: 1rem;
        font-size: 1.5rem;
        color: ${props => props.theme.grayText};
      }
    }

    .footer {
      height: 6rem;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background-color: ${props => props.theme.neutral100};
      border-bottom-right-radius: 1rem;
      border-bottom-left-radius: 1rem;
    }
  }
`

const SearchResults = styled.ul`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: absolute;
  flex-direction: column-reverse;
  bottom: 60%;
  max-height: 30vh;
  list-style-type: none;
  background-color: ${props => props.theme.neutral200};
  padding: 0;
  margin: 0;
  border-radius: 3rem;
  overflow-y: scroll;
  z-index: 99;
  cursor: pointer;

  li {
    padding: 1rem 2rem;

    :hover {
      background-color: ${props => props.theme.neutral};
      font-weight: 700;
    }
  }
`

export default Modal
