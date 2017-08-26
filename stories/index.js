import React from 'react'

import { storiesOf } from '@storybook/react'

import Annotating from './Annotating'
import Basic from './Basic'
import Scansion from './Scansion'
import Highlight from './Highlight'
import rawAnnotating from '!!raw-loader!./Annotating'
import rawBasic from '!!raw-loader!./Basic'
import rawScansion from '!!raw-loader!./Scansion'

storiesOf('Annotatable', module)
  .add('Basic reading environment', () => (
    <div style={{ maxWidth: 600 }}>
      <p>
        At its simplest, the <code>Annotatable</code> component is just a
        convenient way to render text.
      </p>
      <p>
        Provide it with a set of
        Draft.js <code>blocks</code> and an optional <code>entityMap</code>,
        and you'll be good to go.
      </p>
      <p>
        Why display text this way instead of wrapping it in <code>
          &lt;p&gt;
        </code>'s? To be sure, most use cases ought to take the simplest
        approach. For our cases with the CLTK, "simple" meant a structure that
        could play nicely with texts of all shapes and sizes. We were drawn to
        Draft.js's concept of <code>blocks</code> and an <code>entityMap</code>
        because it gave us a way of referring to a text across editions and
        display schemes while retaining the text's own underlying structure.
        This schema also made it easier to reference parts of the text for
        adding annotations, and Draft.js's decorators API makes scansion and
        named-entity recognition a breeze.
      </p>
      <Highlight>
        {rawBasic}
      </Highlight>
      <Basic />
    </div>
  ))
  .add('Scansion', () => (
    <div style={{ maxWidth: 600 }}>
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
  )).add('Annotating', () => (
    <div style={{ maxWidth: 600 }}>
      <p>
        Below is a raw example of adding annotations to a text. When you
        highlight a passage, the annotation editor will accept input. When you
        submit your note, the selected passage becomes permanently highlighted.
        Clicking on the passage then displays your note for viewing or further
        editing.
      </p>
      <p>
        Note that this example is not intended to be complete, but merely to
        show — as clearly as we can — some ways of using these components.
      </p>
      <Highlight>
        {rawAnnotating}
      </Highlight>
      <Annotating />
    </div>
  ))
