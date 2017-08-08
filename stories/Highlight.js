import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import highlight from 'highlight.js'

import '../node_modules/highlight.js/styles/tomorrow.css'

// https://github.com/akiran/react-highlight/blob/master/src/index.js
export default class Highlight extends React.Component {
  static defaultProps = {
    inline: false,
  }

  static propTypes = {
    inline: PropTypes.bool,
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {
    const thisNode = ReactDOM.findDOMNode(this)

    highlight.highlightBlock(thisNode)
  }

  render() {
    const { children, inline } = this.props

    if (inline) {
      return (
        <code className="javascript html">
          {children}
        </code>
      )
    }

    return (
      <pre className="javascript html">
        {children}
      </pre>
    )
  }
}
