// @flow

import type { ContentBlock, ContentState } from 'draft-js'

import {
  ANNOTATION_ENTITY_TYPE,
} from '../constants'
import Annotation from '../components/Annotation'

export const findNoteEntities = (
  contentBlock: ContentBlock,
  callback: Function,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity()

      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === ANNOTATION_ENTITY_TYPE
      )
    },
    callback,
  )
}

export const annotationDecorator = (
  hoverEntityKey: string,
  onHover: (entityKey: string) => void,
  onClick: (entityKey: string) => void,
) => ({
  strategy: findNoteEntities,
  component: Annotation(hoverEntityKey, onHover, onClick)
})


