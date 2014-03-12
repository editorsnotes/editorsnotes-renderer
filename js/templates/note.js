var _ = require('underscore')

module.exports = _.template(''
  + '<header><h2><%= note.title %></h2></header>'
  + '<section id="note-details">'
    + '<div id="note-about">'
      + '<div id="note-status"><strong>'
        + 'This note is <span class="note-status-<%= note.status %>"><%= note.status %></span>'
      + '</strong></div>'
      + '<div id="note-related-topics"></div>'
    + '</div>'
    + '<dl id="note-authorship">'
    + '</dl>'
  + '</section>'
  + '<section id="note-description"><%= note.content %></section>'
  + '<section id="note-sections"></section>')
