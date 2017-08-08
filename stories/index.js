import React from 'react'

import { storiesOf } from '@storybook/react'
import Basic from './Basic'
import Highlight from './Highlight'
import rawBasic from '!!raw-loader!./Basic'

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
