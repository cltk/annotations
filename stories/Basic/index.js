import React from 'react'

import Annotatable from '../../src'
import { argonautica } from '../stubs'
import processText from '../../src/decorators/GreekProsody'

export default class Basic extends React.Component {
  render() {
    return <Annotatable blocks={argonautica} />
  }
}
