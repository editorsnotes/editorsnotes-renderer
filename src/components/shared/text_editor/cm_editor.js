"use strict";

var CodeMirror = require('codemirror')


// Register CodeMirror modes for our markup
require('codemirror/addon/edit/continuelist');
require('./cm_en-markdown_mode');


CodeMirror.commands.newlineAndIndentPromptForCitation = function (cm) {
  if (cm.getOption("disableInput")) return CodeMirror.Pass;

  var lastRange = cm.listSelections().slice(-1)[0]
    , lastLine = lastRange.head.line
    , eolState = cm.getStateAfter(lastLine)
    , wasInQuote = eolState.quote !== 0
    , hasCitation = cm.getLineTokens(lastLine).map(t => t.type).some(t => t === 'citation-start')
    , indent
    , quotes
    , after
    , noLongerInQuote

  if (wasInQuote && hasCitation) {
    cm.replaceSelection('\n\n');
    return null;
  }

  if (wasInQuote) {
    let match = /^(\s*)(>+)(\s*)/.exec(cm.getLine(lastLine));
    [, indent, quotes, after] = match;
  }

  CodeMirror.commands.newlineAndIndentContinueMarkdownList(cm);

  noLongerInQuote = cm.getStateAfter(cm.getCursor().line).quote === 0;

  // This means we have a newline
  if (wasInQuote && noLongerInQuote) {
    let actions = require('./cm_actions')
      , pos = cm.getCursor()
      , prev = { line: pos.line - 1, ch: 0 }

    cm.setSelection(prev, pos);
    cm.replaceSelection(
      indent + quotes + after + '\n' +
      indent + quotes + after + '[@@d'
    );

    actions.checkEmptyReferences(cm, { to: cm.getCursor(), text: 'd' });
  }
}


module.exports = function (el, value='', opts={}) {
  var actions = require('./cm_actions')
    , editor

  editor = CodeMirror(el, {
    value,
    mode: 'en-markdown',
    lineWrapping: true,
    extraKeys: {
      'Enter': 'newlineAndIndentPromptForCitation'
    }
  });

  Object.keys(opts).forEach(key => {
    editor[key] = opts[key];
  });

  editor.on('inputRead', actions.checkEmptyReferences)
  editor.on('change', function (cm, { from, to }) {
    var fromLine = from.line
      , toLine = to.line

    //actions.updateDocumentMarks(cm, fromLine, toLine);
    actions.updateInlineReferences(cm, fromLine, toLine);
  });

  // Update references on editor initialization
  actions.updateInlineReferences(editor, 0, editor.doc.lineCount() - 1);

  return editor;
}
