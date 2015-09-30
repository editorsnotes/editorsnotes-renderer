"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
    projectURL: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    html: React.PropTypes.string,
    minimal: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      html: '',
      style: {},
      minimal: false
    }
  },

  getInitialState() {
    return {
      editor: null,
      referenceType: null,
    }
  },

  onAddEmptyReference(type) {
    this.setState({ referenceType: type || 'empty' });
    this.state.editor.on('beforeChange', this.clearReferenceType);
  },

  clearReferenceType() {
    this.setState({ referenceType: null });
    this.state.editor.off('beforeChange', this.clearReferenceType);
  },

  componentDidMount() {
    var codemirrorEditor = require('./editor')
      , el = React.findDOMNode(this.refs.content)
      , opts = {}
      , editor

    if (!this.props.minimal) {
      opts.handleAddReference = this.onAddEmptyReference;

    }

    editor = codemirrorEditor(el, this.props.html, opts);

    editor.display.wrapper.style.fontFamily = '"Times New Roman"';
    editor.display.wrapper.style.fontSize = '16px';
    editor.display.wrapper.style.height = 'auto';
    editor.display.wrapper.style.border = '1px solid #ccc';
    editor.display.wrapper.style.padding = '1em';
    editor.display.scroller.style.minHeight = '360px';

    editor.refresh();

    editor.on('change', () => this.props.onChange(editor.getValue()));

    this.setState({ editor });
  },

  handleReferenceSelect(item) {
    this.state.editor.focus();
    this.state.editor.doc.replaceSelection(item.get('id') + ' ');
  },

  render() {
    var References = require('./references.jsx')
      , { projectURL, minimal } = this.props
      , { referenceType } = this.state

    return (
      <div className="row">
        <div className={minimal ? "span12" : "span7"}>
          <div ref="content" />
        </div>
        {
          !minimal && (
            <div className="span5">
              <References
                  type={referenceType}
                  projectURL={projectURL}
                  onSelect={this.handleReferenceSelect} />
            </div>
          )
        }
      </div>
    )
  }
});
