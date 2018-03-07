// @format

import 'chosen-js/chosen.css';

import $ from 'jquery';

import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

window.jQuery = window.$ = $;
require('chosen-js');

function Repeat(props) {
  let items = [];

  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }

  return <div>{items}</div>;
}

export function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {index => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}

export class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
};

function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

function Parent(props) {
  return (
    <div>
      My input: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}

export class Grandparent extends React.Component {
  render() {
    return <Parent inputRef={el => (this.inputElement = el)} />;
  }
}

export class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}

class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

export class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar'],
    };
  }

  handleClick = () => {
    // this.setState(prevState => ({
    //   words: prevState.words.concat(['marklar']),
    // }));
    this.setState(prevState => ({
      words: [...prevState.words, 'marklar'],
    }));
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}

const SomeRecord = Immutable.Record({foo: null});
const x = new SomeRecord({foo: 'bar'});
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
console.log('x === y is', x === y);
console.log('x === z is', x === z);

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string,
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

export class MessageList extends React.Component {
  getChildContext() {
    return {color: 'purple'};
  }

  render() {
    const children = this.props.messages.map(message => (
      <Message key={message.id} text={message.text} />
    ));

    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string,
};

const Home = () => (
  <div>
    <h1>Home</h1>
  </div>
);

const About = () => (
  <div>
    <h1>About</h1>
  </div>
);

const Topics = () => (
  <div>
    <h1>Topics</h1>
  </div>
);

export const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);

export class MediaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: 'desktop'};
  }

  getChildContext() {
    return {type: this.state.type};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia('(min-width: 1025px)').matches
        ? 'desktop'
        : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    return this.props.children;
  }
}

MediaQuery.childContextTypes = {
  type: PropTypes.string,
};

const SampleFragment = () => {
  return (
    <React.Fragment>
      <div />
      <div />
      <div />
    </React.Fragment>
  );
};

export class Table extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Col #1</th>
            <th>Col #2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Columns />
          </tr>
        </tbody>
      </table>
    );
  }
}

class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export const DataSource = {
  comments: [],
  changeListeners: [],
  getComments: () => DataSource.comments,
  addChangeListener: cl => {
    DataSource.changeListeners.push(cl);
  },
  removeChangeListener: cl => {
    DataSource.changeListeners.delete(cl);
  },
  notifyChangeListeners: () => {
    DataSource.changeListeners.forEach(cl => cl());
  },
  addComment: content => {
    const comments = DataSource.comments;
    const newId =
      comments.length === 0 ? 1 : Math.max(...comments.map(i => i.id)) + 1;
    const newComment = {
      id: newId,
      content: content,
    };
    DataSource.comments.push(newComment);
    DataSource.notifyChangeListeners();

    return newId;
  },
  removeComment: cid => {
    DataSource.comments = DataSource.comments.filter(c => c.id !== cid);
    DataSource.notifyChangeListeners();
  },
};

class Comment extends React.Component {
  render() {
    const comment = this.props.comment;

    return (
      <div>
        <p>
          Comment #{comment.id}: <strong>{comment.content}</strong>
        </p>
      </div>
    );
  }
}

class CommentList extends React.Component {
  render() {
    return (
      <div>
        {this.props.data.map(comment => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}

const withSubscription = (WrappedComponent, selectData) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectData(DataSource, props),
      };
    }

    componentDidMount() {
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange = () => {
      this.setState({data: selectData(DataSource, this.props)});
    };

    render() {
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
};

export const CommentListWithSubscription = withSubscription(
  CommentList,
  DataSource => DataSource.getComments(),
);

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {x: 0, y: 0};
  }

  handleMouseMove = event => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div style={{height: '100%'}} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

export class MouseTracker extends React.Component {
  render() {
    return (
      <div style={{position: 'absolute', height: '100%', width: '100%'}}>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => <Cat mouse={mouse} />} />
      </div>
    );
  }
}

class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;

    return (
      <img
        src="image.jpeg"
        alt="Cat"
        style={{position: 'absolute', left: mouse.x, top: mouse.y}}
      />
    );
  }
}

export class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.$el.on('change', this.handleChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger('chosen:updated');
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
  }

  handleChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => (this.el = el)}>
          {this.props.children}
        </select>
      </div>
    );
  }
}

export class TestEvent extends React.Component {
  onClick = event => {
    debugger;
    console.log(event);
    console.log(event.type);
    const eventType = event.type;

    setTimeout(() => {
      debugger;
      // console.log(event);
      // console.log(event.type);
      console.log(eventType);
    }, 0);

    this.setState({clickEvent: event});
    // this.setState({eventType: event.type});
  };

  render() {
    console.log(this.clickEvent);
    console.log(this.eventType);

    return <button onClick={this.onClick}>Click me!</button>;
  }
}
