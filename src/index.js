// @flow
import React, { Component } from 'react';
import ExecutionEnvironment from 'exenv';

type Props = {
  length: number,
  by: 'lines' | 'characters' | 'words',
  onExpand?: () => void,
  onShorten?: () => void,
  ellipsis: string,
  children: string,
  ellipsisStyle?: CSSStyleDeclaration,
  ellipsisClassName?: string
};

type State = {
  shortenedText?: string,
  shorten?: boolean
};

export default class Shorten extends Component<Props, State> {
  canvasContext: CanvasRenderingContext2D;
  shortenContext: ?HTMLSpanElement;
  frameTimeout: number;
  targetWidth: number;

  static defaultProps = {
    length: 3,
    by: 'lines',
    ellipsis: ' more...'
  };

  state = {};

  componentDidMount() {
    if (this.props.by === 'lines') {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      this.canvasContext = canvas.getContext('2d');
      const style = window.getComputedStyle(this.shortenContext);
      this.canvasContext.font = [
        style['font-weight'],
        style['font-style'],
        style['font-size'],
        style['font-family']
      ].join(' ');

      window.addEventListener('resize', this.onResize);
      this.calculateWidth();
    }
    this.shortenText();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.children !== nextProps.children) {
      this.shortenText();
    }
  }

  componentWillUnmount() {
    if (this.props.by === 'lines') {
      window.removeEventListener('resize', this.onResize);
    }
  }

  calculateWidth = () => {
    const { shortenContext } = this;
    if (!shortenContext || !shortenContext.parentElement) {
      return;
    }

    this.targetWidth = Math.floor(
      shortenContext.parentElement.getBoundingClientRect().width
    );
  };

  onResize = (): void => {
    this.calculateWidth();
    this.shortenText();
  };

  calculateShortenWidth = (text: string): number =>
    this.canvasContext.measureText(text).width;

  shortenByCharacters = (length: number, text: string) => {
    if (text.length <= length) {
      return [text, false];
    }
    return [text.substr(0, length - this.props.ellipsis.length), true];
  };

  shortenByWords = (length: number, text: string) => {
    const wordsArray = text.split(' ');
    if (wordsArray.length <= length) {
      return [text, false];
    }
    return [
      wordsArray
        .slice(0, length - this.props.ellipsis.split(' ').length + 1)
        .join(' '),
      true
    ];
  };

  shortenByLines = (length: number, text: string) => {
    const wordsArray: Array<string> = text.split(' ');
    let linesArray: Array<string> = [];
    const { props: { ellipsis }, targetWidth } = this;

    for (let line = 0; line < length; line++) {
      let lineArray = [];

      do {
        lineArray.push(wordsArray.shift());
        if (
          targetWidth <
          this.calculateShortenWidth(
            lineArray.join(' ') + (line === length - 1 ? ellipsis : '')
          )
        ) {
          wordsArray.unshift(lineArray.pop());
          break;
        }
      } while (wordsArray.length);

      linesArray[line] = lineArray.join(' ');
    }

    return [linesArray.join(' ').trim(), !!wordsArray.length];
  };

  shortenText = () => {
    let shortenedText: string, shorten: boolean;
    const { length, by, children, onShorten } = this.props;
    if (!children) {
      return;
    }

    switch (by) {
      case 'characters':
        [shortenedText, shorten] = this.shortenByCharacters(length, children);
        break;
      case 'words':
        [shortenedText, shorten] = this.shortenByWords(length, children);
        break;
      default:
        [shortenedText, shorten] = this.shortenByLines(length, children);
        break;
    }

    if (shorten && typeof onShorten === 'function') {
      onShorten();
    }

    this.setState({
      shortenedText,
      shorten
    });
  };

  handleExpand = () => {
    const { children, onExpand } = this.props;

    this.setState({
      shortenedText: children,
      shorten: false
    });

    if (typeof onExpand === 'function') {
      onExpand();
    }
  };

  render() {
    if (!this.props.children) {
      return null;
    }

    // Return originalText when rendering in server
    // so bots can index the whole text
    if (!ExecutionEnvironment.canUseDOM) {
      return this.props.children;
    }

    const { shortenedText, shorten } = this.state;
    const { ellipsis, ellipsisStyle, ellipsisClassName } = this.props;

    return (
      <span ref={ele => (this.shortenContext = ele)}>
        {shortenedText}
        {shorten && (
          <button
            onClick={this.handleExpand}
            className={ellipsisClassName}
            style={ellipsisStyle}
            dangerouslySetInnerHTML={{
              __html: ellipsis.replace(/^\s/, '&nbsp;')
            }}
          />
        )}
      </span>
    );
  }
}
