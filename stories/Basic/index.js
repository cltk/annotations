import React from 'react'

import Annotatable from '../../src'
import { blocks } from '../stubs'
import processText from '../../src/decorators/GreekProsody'

export default class Basic extends React.Component {
  render() {
    return <Annotatable blocks={blocks} />
  }
}
