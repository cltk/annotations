import React from 'react'

import { storiesOf } from '@storybook/react'

import Basic from './Basic'
import Scansion from './Scansion'
import Highlight from './Highlight'
import rawBasic from '!!raw-loader!./Basic'
import rawScansion from '!!raw-loader!./Scansion'

storiesOf('Annotatable', module)
  .add('Basic reading environment', () => (
    <div>
      <p>
        At its simplest, the <code>Annotatable</code> component is just a
        convenient way to render text.
      </p>
      <p>
        Provide it with a set of
        Draft.js <code>blocks</code> and an optional <code>entityMap</code>,
        and you'll be good to go.
      </p>
      <Highlight>
        {rawBasic}
      </Highlight>
      <Basic />
    </div>
  ))
  .add('Scansion', () => (
    <div>
      <p>
        You can also pass in an array of custom decorators, which,
        as with vanilla
        {' '}<a href="https://draftjs.org/docs/advanced-topics-decorators.html">
          Draft.js
        </a>,
        are objects containing a <code>strategy</code> function and a
        {' '}<code>component</code> — erm, component.
      </p>
      <Highlight>
        {rawScansion}
      </Highlight>
      <Scansion />
    </div>
  ))
