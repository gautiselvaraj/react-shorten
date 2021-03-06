# React-Shorten
[![Build Status](https://travis-ci.org/gautiselvaraj/react-shorten.svg?branch=master)](https://travis-ci.org/gautiselvaraj/react-shorten)
[![Coverage Status](https://coveralls.io/repos/github/gautiselvaraj/react-shorten/badge.svg?branch=master)](https://coveralls.io/github/gautiselvaraj/react-shorten?branch=master)
[![npm package](https://img.shields.io/npm/v/react-shorten.svg)](https://www.npmjs.org/package/react-shorten)

React component to shorten text by lines, words or characters with some customizations and callbacks.

## Installation

1. Using [yarn](https://yarnpkg.com) `yarn add react-shorten`
2. Or using [npm](https://npmjs.org/) `npm install react-shorten`

## Usage
```
import Shorten from 'react-shorten';

<Shorten
  by={'lines' | 'characters' | 'words'}
  length={Number}
  onExpand={() => {}}
  onShorten={() => {}}
  ellipsis="more..."
  ellipsisStyle={{
    color: 'white',
    fontSize: 20
  }}
  ellipsisClassName="ellipsis-btn">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</Shorten>
```

## API
| Prop | Type | Default | Description | Example |
| ---- | ---- | ------- | ----------- | ------- |
| by | 'lines' or 'characters' or 'words' | 'lines' | Specifies how to shorten the children | `<Shorten by="words">Lorem ipsum dolor sit amet</Shorten>` |
| length | integer | 3 | Specifies how many 'lines' or 'characters' or 'words' of text should be preserved until it gets shorten. | `<Shorten length={3}>Lorem ipsum dolor sit amet</Shorten>` |
| ellipsis | string | ' more...' | String that is added to the end of the text when it is shorten. | `<Shorten ellipsis="...">Lorem ipsum dolor sit amet</Shorten>`
| children | string | | The text to be shorten. | `<Shorten>Lorem ipsum dolor sit amet</Shorten>` |
| onShorten | function | | Function that is called every time when original text is shorten. | `<Shorten onShorten={() => {}}>Lorem ipsum dolor sit amet</Shorten>` |
| onExpand | function | | Function that is called when more link is clicked and original text is shown fully. | `<Shorten onExpand={() => {}}>Lorem ipsum dolor sit amet</Shorten>` |
| ellipsisStyle | object | | Object that overrides the inline-styles of ellipsis's button element. | `<Shorten ellipsisStyle={{color: 'white', fontSize: 20}}>Lorem ipsum dolor sit amet</Shorten>` |
| ellipsisClassName | string | | The css class name of ellipsis's button element. | `<Shorten ellipsisClassName="ellipsis-btn">Lorem ipsum dolor sit amet</Shorten>` |

## Author
**[Gauti Selvaraj](https://www.gauti.info)**

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
