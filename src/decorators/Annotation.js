// @flow

import type { ContentBlock, ContentState } from 'draft-js'

import {
  ANNOTATION_ENTITY_TYPE,
  HIGHLIGHT_BLUE,
  PENDING_ANNOTATION_BLUE,
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

export const annotationDecorator = {
  strategy: findNoteEntities,
  component: Annotation,
}

export const styleMap = {
  PENDING_ANNOTATION: {
    backgroundColor: PENDING_ANNOTATION_BLUE,
  },
  HIGHLIGHT: {
    backgroundColor: HIGHLIGHT_BLUE,
  }
}


