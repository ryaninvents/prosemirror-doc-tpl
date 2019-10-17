import htm from 'htm';
import { Node, NodeType, MarkType, Schema } from 'prosemirror-model';

/** Template string type which returns a ProseMirror node or array of nodes. */
type ProsemirrorDocBuilder<S extends Schema> = (
  literals: TemplateStringsArray,
  ...interpolations: Array<any>
) => Node<S> | Array<Node<S>>;

/**
 * Create a template tag
 * @param schema ProseMirror schema which will be used to generate nodes.
 */
export default function createBuilder<S extends Schema>(
  schema: S
): ProsemirrorDocBuilder<S> {
  /** Pass Node children through unchanged; convert strings to text nodes. */
  function normalize(child: Node<S> | string): Node<S> {
    if (typeof child !== 'string') return child;
    return schema.text(child) as any;
  }

  /** Normalize a child or list of children, as a list. */
  function normalizeAll(elems: Node<S> | Array<Node<S>>): Array<Node<S>> {
    if (Array.isArray(elems))
      return elems.reduce((state, elem) => {
        if (Array.isArray(elem)) {
          return [...state, ...normalizeAll(elem)];
        }
        return [...state, normalize(elem)];
      }, []);
    return [normalize(elems)];
  }

  /** Utility function for creating a node. */
  function createNode(
    type: NodeType<S>,
    props: { [key: string]: any },
    ...children
  ): Node<S> {
    return type.create(props, children.map((child) => normalize(child)));
  }

  /** 
   * Utility function for creating a marked set of nodes.
   * 
   * Treating marks as nestable tags is a necessary evil of using JSX to simplify
   * document creation. If you don't like the abstraction, you can manually generate
   * a node and pass it in as an interpolated value.
   */
  function createMark(
    type: MarkType<S>,
    props: { [key: string]: any },
    ...children
  ): Array<Node<S>> {
    /** Catch-all utility for applying the desired mark to any kind of node. */
    function mark(
      elem: Node | string | Array<Node<S>>,
      marks = []
    ): Node<S> | Array<Node<S>> {
      if (Array.isArray(elem)) {
        return elem.map(
          (node: Node<S>) => (mark(node, marks) as any) as Node<S>
        );
      }
      if (typeof elem === 'string') {
        return schema.text(elem, [type.create(props)]) as any;
      }
      if (elem.type && elem.type.name === 'text') {
        return schema.text(elem.text, [
          ...elem.marks,
          type.create(props),
        ]) as any;
      }
      return elem.mark([...marks, type.create(props)]);
    }

    // Iterate over the passed children, normalize, and apply the marks.
    return children.reduce(
      (state, next) => [
        ...state,
        ...normalizeAll(next).map((element) => mark(element, element.marks)),
      ],
      []
    );
  }

  return htm.bind((type: NodeType | MarkType | string, props, ...children):
    | Node<S>
    | Array<Node<S>> => {
    if (type === '') {
      // Fragment syntax; simply return an array.
      return normalizeAll(children);
    }
    if (typeof type === 'string') {
      const foundNodeType: NodeType<S> | undefined = schema.nodes[type] as any;
      if (foundNodeType) {
        return createNode(foundNodeType, props, ...normalizeAll(children));
      }
      const foundMarkType: MarkType<S> | undefined = schema.marks[type] as any;
      if (foundMarkType) {
        return createMark(foundMarkType, props, ...normalizeAll(children));
      }
    }
    if (type instanceof NodeType) {
      return createNode(type, props, ...normalizeAll(children));
    }
    if (type instanceof MarkType) {
      return createMark(type, props, ...normalizeAll(children));
    }
    throw new Error(`No such node type ${JSON.stringify(type)}`);
  }) as ProsemirrorDocBuilder<S>;
}
