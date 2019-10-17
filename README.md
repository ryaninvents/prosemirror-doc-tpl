# @ryaninvents/prosemirror-doc-tpl

> Create [Prosemirror](pm) documents using JSX-like syntax

[![CircleCI][circleci-image]][circleci-url]
[![GitHub repository][github-image]][github-url]
[![semantic-release][semantic-release-image]][semantic-release-url]
![Maintenance status as of 2019][maint-image]

## Why do I want to use this?

This package provides a concise way to create [Prosemirror](pm) documents using a JSX-like syntax, for testing or content generation.

## Installation

```bash
npm install --save @ryaninvents/prosemirror-doc-tpl
```

## Usage

This package uses your schema to generate nodes. Create the template tag with `createBuilder`, then use the tag
to generate ProseMirror documents.

```js
import createBuilder from '@ryaninvents/prosemirror-doc-tpl';
import mySchema from './schema';

const pm = createBuilder(mySchema);

const starterDocument = pm`
<doc>
  <heading level=1>prosemirror-doc-tpl</heading>
  <blockquote>
    Create <link href="https://prosemirror.net" title="ProseMirror">ProseMirror</link>
    documents using JSX-like syntax
  </blockquote>
  <paragraph>
    This package provides a concise way to create Prosemirror documents using
    a JSX-like syntax, for testing or content generation.
  </paragraph>
</doc>
`;

```

[pm]: https://prosemirror.net

[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[semantic-release-url]: https://github.com/semantic-release/semantic-release

[maint-image]: https://img.shields.io/maintenance/yes/2019.svg

[github-image]: https://img.shields.io/github/stars/ryaninvents/prosemirror-doc-tpl.svg?style=social

[github-url]: https://github.com/ryaninvents/prosemirror-doc-tpl

[circleci-image]: https://img.shields.io/circleci/project/github/ryaninvents/prosemirror-doc-tpl/master.svg?logo=circleci

[circleci-url]: https://circleci.com/gh/ryaninvents/prosemirror-doc-tpl