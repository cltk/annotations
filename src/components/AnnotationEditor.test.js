import React from 'react'
import {
  convertFromRaw,
  convertToRaw,
  genKey,
  ContentState,
  Editor,
  EditorState,
  SelectionState,
} from 'draft-js'
import { shallow } from 'enzyme'

import AnnotationEditor, { addNoteEntityToAnnotatable } from './AnnotationEditor'

describe('AnnotationEditor', () => {
  const noop = () => { }

  it('renders correctly', () => {
    const aEditor = shallow(
      <AnnotationEditor
        editorState={EditorState.createEmpty()}
        onChange={noop}
        readOnly={true}
      />
    )

    expect(aEditor).toBeDefined()
  })

  it('calls `onChange` prop on change', () => {
    const onChange = jest.fn()
    const aEditor = shallow(
      <AnnotationEditor
        editorState={EditorState.createEmpty()}
        onChange={onChange}
        readOnly={true}
      />
    )

    const editor = aEditor.find(Editor)

    editor.simulate('change')

    expect(onChange).toHaveBeenCalled()
  })

  describe('.addNoteEntityToAnnotatable()', () => {
    it('returns a new EditorState with a note added', () => {
      const key = 'cg41p'
      const text = 'arma virumque cano'
      const note = {
        entityMap: {},
        blocks:
        [{
          key: genKey(),
          text: 'note',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }]
      }
      const raw = {
        entityMap: {},
        blocks:
        [{
          key,
          text,
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {}
        }]
      }
      const annotatableEditorState =
        EditorState.createWithContent(convertFromRaw(raw))
      const annotatableSelectionState = SelectionState.createEmpty(key)
        .merge({
          focusKey: key,
          focusOffset: 5,
        })
      const aEditorStateWithSelection = EditorState.forceSelection(
        annotatableEditorState,
        annotatableSelectionState
      )
      const noteEditorState =
        EditorState.createWithContent(convertFromRaw(note))
      const newEditorState = addNoteEntityToAnnotatable(
        aEditorStateWithSelection,
        noteEditorState
      )
      const newContentState = newEditorState.getCurrentContent()
      const entityKey = newContentState.getLastCreatedEntityKey()
      const entity = newContentState.getEntity(entityKey)

      expect(entity.getData()).toMatchObject(note)
    })
  })
})
