import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { shallow, mount } from 'enzyme';
import ExecutionEnvironment from 'exenv';
import Shorten from '../src';

describe('<Shorten />', () => {
  const testChildren =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare finibus turpis, vel venenatis felis dignissi eu. In sed mattis eros, sit amet pulvinar velit. Donec vehicula metus ac libero condimentum, eget mollis enim ullamcorper.';
  const testChildrenSmall =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  it('should be a react component', () => {
    expect(Shorten).toBeInstanceOf(Component.constructor);
  });

  describe('in a server environment', () => {
    let canUseDOM;

    beforeAll(() => {
      canUseDOM = ExecutionEnvironment.canUseDOM;
      ExecutionEnvironment.canUseDOM = false;
    });

    afterAll(() => {
      ExecutionEnvironment.canUseDOM = canUseDOM;
    });

    it('should render children as it is for bots to index it', () => {
      const markup = renderToString(<Shorten>{testChildren}</Shorten>);
      expect(markup).toBe(testChildren);
    });
  });

  describe('in a client environment', () => {
    let canUseDOM;

    beforeAll(() => {
      canUseDOM = ExecutionEnvironment.canUseDOM;
      ExecutionEnvironment.canUseDOM = true;
      jest.spyOn(global.window, 'getComputedStyle').mockImplementation(() => ({
        'font-weight': 400,
        'font-style': 'normal',
        'font-size': '12px',
        'font-family': 'Arial'
      }));
    });

    beforeEach(() => {
      jest
        .spyOn(global.window.Element.prototype, 'getBoundingClientRect')
        .mockImplementation(() => ({ width: 300 }));
    });

    afterAll(() => {
      ExecutionEnvironment.canUseDOM = canUseDOM;
      global.window.getComputedStyle.mockRestore();
    });

    afterEach(() => {
      global.window.Element.prototype.getBoundingClientRect.mockRestore();
    });

    it('should render a span', () => {
      const wrapper = shallow(<Shorten>{testChildren}</Shorten>);
      expect(wrapper.type()).toBe('span');
    });

    it('should return null if empty children is passed', () => {
      const wrapper = shallow(<Shorten />);
      expect(wrapper.type()).toBeNull();
    });

    describe('by lines', () => {
      it('should render original text without shortening', () => {
        const wrapper = mount(<Shorten>{testChildrenSmall}</Shorten>);
        expect(wrapper.text()).toBe(testChildrenSmall);
      });

      it('should render correct truncated text with default options', () => {
        const wrapper = mount(<Shorten>{testChildren}</Shorten>);
        expect(wrapper.text()).toBe(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare finibus turpis, vel venenatis felis dignissi eu. In sed mattis eros, sit amet pulvinar velit. more...'
        );
      });

      it('should render correct truncated text with by="lines" and length={1} props', () => {
        const wrapper = mount(
          <Shorten by="lines" length={1}>
            {testChildren}
          </Shorten>
        );
        expect(wrapper.text()).toBe(
          'Lorem ipsum dolor sit amet, consectetur more...'
        );
      });

      it('should render correct truncated text with passed ellipsis prop', () => {
        const wrapper = mount(
          <Shorten ellipsis=" ...more" length={1}>
            {testChildren}
          </Shorten>
        );
        expect(wrapper.text()).toBe(
          'Lorem ipsum dolor sit amet, consectetur ...more'
        );
      });

      it('should render correct truncated text with passed ellipsisClassName prop', () => {
        const wrapper = mount(
          <Shorten ellipsisClassName="ellipsis-button" length={1}>
            {testChildren}
          </Shorten>
        );
        expect(wrapper.find('button').prop('className')).toBe(
          'ellipsis-button'
        );
      });

      it('should render correct truncated text with passed ellipsisStyle prop', () => {
        const ellipsisStyle = {
          backgroundColor: 'red',
          color: 'white',
          outline: 0,
          padding: 0
        };

        const wrapper = mount(
          <Shorten ellipsisStyle={ellipsisStyle} length={1}>
            {testChildren}
          </Shorten>
        );
        expect(wrapper.find('button').prop('style')).toEqual(ellipsisStyle);
      });

      it('should call onShorten when shortening', () => {
        const onShortenMock = jest.fn();
        const wrapper = mount(
          <Shorten onShorten={onShortenMock}>{testChildren}</Shorten>
        );
        expect(onShortenMock.mock.calls.length).toBe(1);
      });

      describe('onExpand', () => {
        let windowRemoveEventListenerMock;
        beforeEach(() => {
          windowRemoveEventListenerMock = jest.spyOn(
            global.window,
            'removeEventListener'
          );
        });

        afterEach(() => {
          global.window.removeEventListener.mockRestore();
        });

        it('should call onExpand prop when ellipsis is clicked', () => {
          const onExpandMock = jest.fn();
          const wrapper = mount(
            <Shorten onExpand={onExpandMock}>{testChildren}</Shorten>
          );
          wrapper.find('button').simulate('click');
          expect(onExpandMock.mock.calls.length).toBe(1);
        });

        it('should remove window resize event listener when ellipsis is clicked', () => {
          const wrapper = mount(<Shorten>{testChildren}</Shorten>);
          expect(
            windowRemoveEventListenerMock.mock.calls.find(
              call => call[0] === 'resize'
            )
          ).toBeUndefined();
          wrapper.find('button').simulate('click');
          expect(
            windowRemoveEventListenerMock.mock.calls.find(
              call => call[0] === 'resize'
            )
          ).toBeDefined();
        });
      });

      describe('during children change', () => {
        it('should not call onShorten when same children are passed', () => {
          const onShortenMock = jest.fn();
          const wrapper = mount(
            <Shorten onShorten={onShortenMock}>{testChildren}</Shorten>
          );
          expect(onShortenMock.mock.calls.length).toBe(1);

          wrapper.setState({ children: testChildren });
          expect(onShortenMock.mock.calls.length).toBe(1);
        });

        it('should call onShorten again when different children are passed', () => {
          const onShortenMock = jest.fn();
          const wrapper = mount(
            <Shorten onShorten={onShortenMock}>{testChildren}</Shorten>
          );
          expect(onShortenMock.mock.calls.length).toBe(1);

          wrapper.setProps({ children: `${testChildren} new children` });
          expect(onShortenMock.mock.calls.length).toBe(2);
        });
      });

      describe('during unmount', () => {
        let windowRemoveEventListenerMock;
        beforeEach(() => {
          windowRemoveEventListenerMock = jest.spyOn(
            global.window,
            'removeEventListener'
          );
        });

        afterEach(() => {
          global.window.removeEventListener.mockRestore();
        });

        it('should remove window resize event listener', () => {
          const wrapper = mount(<Shorten>{testChildren}</Shorten>);
          expect(
            windowRemoveEventListenerMock.mock.calls.find(
              call => call[0] === 'resize'
            )
          ).toBeUndefined();
          wrapper.unmount();
          expect(
            windowRemoveEventListenerMock.mock.calls.find(
              call => call[0] === 'resize'
            )
          ).toBeDefined();
        });
      });

      describe('during window resize', () => {
        it('should render truncate text with default options and update on window resize', () => {
          const wrapper = mount(<Shorten length={1}>{testChildren}</Shorten>);
          expect(wrapper.text()).toBe(
            'Lorem ipsum dolor sit amet, consectetur more...'
          );

          jest
            .spyOn(global.window.Element.prototype, 'getBoundingClientRect')
            .mockImplementation(() => ({ width: 200 }));
          global.window.dispatchEvent(new Event('resize'));
          expect(wrapper.text()).toBe('Lorem ipsum dolor sit amet, more...');
        });

        it('should call onShorten when shortening during resize', () => {
          const onShortenMock = jest.fn();
          const wrapper = mount(
            <Shorten onShorten={onShortenMock}>{testChildren}</Shorten>
          );
          expect(onShortenMock.mock.calls.length).toBe(1);

          jest
            .spyOn(global.window.Element.prototype, 'getBoundingClientRect')
            .mockImplementation(() => ({ width: 200 }));
          global.window.dispatchEvent(new Event('resize'));
          expect(onShortenMock.mock.calls.length).toBe(2);
        });

        it('should render original text without ellipsis when on window resize the screen width fits original text', () => {
          const wrapper = mount(<Shorten length={2}>{testChildren}</Shorten>);
          expect(wrapper.text()).toBe(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare finibus turpis, vel venenatis felis more...'
          );

          jest
            .spyOn(global.window.Element.prototype, 'getBoundingClientRect')
            .mockImplementation(() => ({ width: 1000 }));
          global.window.dispatchEvent(new Event('resize'));
          expect(wrapper.text()).toBe(testChildren);
        });
      });
    });

    describe('by characters', () => {
      it('should render original text without shortening', () => {
        const wrapper = mount(
          <Shorten by="characters" length={100}>
            {testChildrenSmall}
          </Shorten>
        );
        expect(wrapper.text()).toHaveLength(testChildrenSmall.length);
        expect(wrapper.text()).toBe(testChildrenSmall);
      });

      it('should render correct truncated text with by="characters" and length={100} props', () => {
        const wrapper = mount(
          <Shorten by="characters" length={25}>
            {testChildren}
          </Shorten>
        );
        expect(wrapper.text()).toHaveLength(25);
        expect(wrapper.text()).toBe('Lorem ipsum dolor more...');
      });

      it('should render correct truncated text with passed ellipsis prop', () => {
        const wrapper = mount(
          <Shorten by="characters" length={25} ellipsis="...big more text">
            {testChildren}
          </Shorten>
        );
        expect(wrapper.text()).toHaveLength(25);
        expect(wrapper.text()).toBe('Lorem ips...big more text');
      });

      it('should not call onShorten when shortening during resize', () => {
        const onShortenMock = jest.fn();
        const wrapper = mount(
          <Shorten onShorten={onShortenMock} by="characters" length={100}>
            {testChildren}
          </Shorten>
        );
        expect(onShortenMock.mock.calls.length).toBe(1);

        jest
          .spyOn(global.window.Element.prototype, 'getBoundingClientRect')
          .mockImplementation(() => ({ width: 200 }));
        global.window.dispatchEvent(new Event('resize'));
        expect(onShortenMock.mock.calls.length).toBe(1);
      });
    });

    describe('by words', () => {
      it('should render original text without shortening', () => {
        const wrapper = mount(
          <Shorten by="words" length={10}>
            {testChildrenSmall}
          </Shorten>
        );
        expect(wrapper.text().split(/\s/)).toHaveLength(
          testChildrenSmall.split(/\s/).length
        );
        expect(wrapper.text()).toBe(testChildrenSmall);
      });

      it('should render correct truncated text with by="words" and length={20} props', () => {
        const wrapper = mount(
          <Shorten by="words" length={10}>
            {testChildren}
          </Shorten>
        );
        expect(wrapper.text().split(/\s/)).toHaveLength(10);
        expect(wrapper.text()).toBe(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris more...'
        );
      });

      it('should render correct truncated text with passed ellipsis prop', () => {
        const wrapper = mount(
          <Shorten by="words" length={10} ellipsis="...big more text">
            {testChildren}
          </Shorten>
        );
        expect(wrapper.text().split(/\s/)).toHaveLength(10);
        expect(wrapper.text()).toBe(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit....big more text'
        );
      });

      it('should not call onShorten when shortening during resize', () => {
        const onShortenMock = jest.fn();
        const wrapper = mount(
          <Shorten onShorten={onShortenMock} by="words" length={10}>
            {testChildren}
          </Shorten>
        );
        expect(onShortenMock.mock.calls.length).toBe(1);

        jest
          .spyOn(global.window.Element.prototype, 'getBoundingClientRect')
          .mockImplementation(() => ({ width: 200 }));
        global.window.dispatchEvent(new Event('resize'));
        expect(onShortenMock.mock.calls.length).toBe(1);
      });
    });
  });
});
