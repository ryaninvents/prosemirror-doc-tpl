import createBuilder from '../index';
import { Fragment } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import * as Util from 'prosemirror-test-builder';

const builder = Util.builders(schema);
const pm = createBuilder(schema);

describe('createBuilder', () => {
  it('should create a basic document', () => {
    const document = pm`
          <doc>
            <heading level=1>Hello world</heading>
            <heading level=2>And now for something completely different</heading>
            <paragraph>
              Here's to the crazy ones. The misfits. The rebels...
            </paragraph>
          </doc>
        `;
    expect((document as any).toJSON()).toMatchSnapshot();
  });
  it('should properly handle bare marks', () => {
    const frag = pm`<>Here is some <strong>bold text</strong></>`;
    const targetJson = [
      schema.text('Here is some ').toJSON(),
      ...(Fragment.from(
        builder.strong({}, schema.text('bold text')).flat
      ).toJSON() as any[]),
    ];
    expect(Fragment.from(frag).toJSON()).toEqual(targetJson);
  });
  it('should properly nest marks', () => {
    const doc1 = pm`
          <doc>
            <paragraph>
              Here is some <strong>bold text</strong>
            </paragraph>
          </doc>
        `;
    expect((doc1 as any).toJSON()).toMatchInlineSnapshot(`
Object {
  "content": Array [
    Object {
      "content": Array [
        Object {
          "text": "Here is some ",
          "type": "text",
        },
        Object {
          "marks": Array [
            Object {
              "type": "strong",
            },
          ],
          "text": "bold text",
          "type": "text",
        },
      ],
      "type": "paragraph",
    },
  ],
  "type": "doc",
}
`);
  });
});
