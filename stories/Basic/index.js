import React from 'react'

import Annotatable, { createEditorState } from '../../src'
import { argonautica } from '../stubs'

const Basic = () => <Annotatable editorState={createEditorState(argonautica)} />

export default Basic
