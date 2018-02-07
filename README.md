# React-Shorten

## Installation

1. Using [npm](https://npmjs.org/) `npm install react-shorten`
2. Or using [yarn](https://yarnpkg.com) `yarn add react-shorten`

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
| ellipsis | string | ' more...' | String that is added to the end of the text in case it is shorten. | `<Shorten ellipsis="...">Lorem ipsum dolor sit amet</Shorten>`
| children | string | | The text to be shorten. | `<Shorten>Lorem ipsum dolor sit amet</Shorten>` |
| onShorten | function | | Called on each time when original text is shorten. | `<Shorten onShorten={() => {}}>Lorem ipsum dolor sit amet</Shorten>` |
| onExpand | function | | Called on when more link is clicked and orginal text is shown. | `<Shorten onExpand={() => {}}>Lorem ipsum dolor sit amet</Shorten>` |
| ellipsisStyle | object | | Override the inline-styles of ellipsis's button element. | `<Shorten ellipsisStyle={{color: 'white', fontSize: 20}}>Lorem ipsum dolor sit amet</Shorten>` |
| ellipsisClassName | string | | The css class name of ellipsis's button element. | `<Shorten ellipsisClassName="ellipsis-btn">Lorem ipsum dolor sit amet</Shorten>` |
