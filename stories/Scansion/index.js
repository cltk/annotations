import React from 'react'
import {
  CompositeDecorator,
  EditorState,
  convertFromRaw,
} from 'draft-js'
import type { ContentState } from 'draft-js'

import Annotatable from '../../src'
import { argonautica } from '../stubs'
import GreekProsody, { processText } from '../../src/decorators/GreekProsody'

const scansionStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity()

      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'SCANSION'
      )
    },
    callback,
  )
}

export default class Scansion extends React.Component {
  constructor(props) {
    super(props)

    const entities = []
    const blocks = argonautica.reduce((blocks, block) => {
      const processed = processText(block.text)
      const entityRanges = []

      for (let i = 0, l = processed.length; i < l; i++) {
        entityRanges.push({
          key: entities.length,
          offset: processed[i].offset,
          length: processed[i].length
        })
        entities.push({
          type: 'SCANSION',
          mutability: 'IMMUTABLE',
          data: {
            diacritic: processed[i].diacritic,
          }
        })
      }

      return [...blocks, {...block, entityRanges }]
    }, [])

    this.state = {
      blocks,
      entityMap: entities.reduce((acc, curr, i) => ({...acc, [i]: curr }), {})
    }
  }

  render() {
    return <Annotatable
      blocks={this.state.blocks}
      decorators={[{ strategy: scansionStrategy, component: GreekProsody }]}
      entityMap={this.state.entityMap}
    />
  }
}
