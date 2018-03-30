import React, {Component} from 'react'
import {render} from 'react-dom'

import Shorten from '../../src'

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      by: 'lines',
      length: 3,
      ellipsis: ' more...',
      showDemo: true
    };
    this.updateInputValues = this.updateInputValues.bind(this);
  }

  componentDidUpdate() {
    if (!this.state.showDemo) {
      this.setState({ showDemo: true });
    }
  }

  updateInputValues(value, stateName) {
    this.setState({ showDemo: false, [stateName]: value });
  }

  render() {
    const { by, length, ellipsis, showDemo } = this.state;

    return (
      <div style={{maxWidth: 600, margin: '30px auto'}}>
        <h1>React-Shorten Demo</h1>
        <div>
          <div style={{marginBottom: 10}}>
            <label>By: </label>
            <select
              type="text"
              value={by}
              onChange={e => this.updateInputValues(e.target.value, 'by')}
            >
              <option value="lines">Lines</option>
              <option value="characters">Characters</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div style={{marginBottom: 10}}>
            <label>Length: </label>
            <input
              type="number"
              min="0"
              value={length}
              onChange={e =>
                this.updateInputValues(e.target.value, 'length')
              }
            />
          </div>
          <div style={{marginBottom: 10}}>
            <label>Ellipsis Text: </label>
            <input
              type="text"
              value={ellipsis}
              onChange={e =>
                this.updateInputValues(e.target.value, 'ellipsis')
              }
            />
          </div>
        </div>
        <div style={{marginTop: 20, backgroundColor: '#dfdfdf', padding: 10}}>
          {showDemo && (
            <Shorten
              by={by}
              length={length}
              ellipsis={ellipsis}
              ellipsisStyle={{
                background: 'transparent',
                border: 0,
                color: 'red',
                cursor: 'pointer',
                fontSize: 14,
                padding: 0
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Aenean placerat odio quam, et dictum lorem faucibus quis.
              Morbi molestie dictum consectetur. Donec at massa justo.
              Phasellus in elit vulputate, volutpat orci eget, sodales
              elit. In justo dui, blandit id augue egestas, auctor
              blandit ipsum. Nunc vel urna in dui tempus maximus sed
              quis erat. Cras pretium posuere ex eu volutpat. Fusce
              porta enim a posuere laoreet. Nam non porttitor metus.
              Phasellus non leo neque. Suspendisse lobortis viverra
              pharetra. Vivamus malesuada, orci non mollis gravida,
              purus massa congue lacus, tempor malesuada nisi quam eget
              purus. Vestibulum quam magna, aliquam id condimentum sed,
              consequat et lectus. Vivamus neque turpis, bibendum vel
              commodo at, elementum et risus. Ut ac hendrerit mauris.
              Vestibulum vitae nulla sed enim pretium iaculis ut quis
              est.
            </Shorten>
          )}
        </div>
      </div>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
