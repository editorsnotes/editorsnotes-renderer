"use strict";

var $ = require('./jquery')
  , Backbone = require('./backbone')
  , router = require('./client')

/* Add routes to the router */
router.add([])

$(document).ready(function () {
  initTimeago();
  initTooltips();
  initAutocomplete();
});

/*
BaseRouter = Backbone.Router.extend({
  routes: {
    'projects/:project/documents/:document/': 'showDocument'
  },
  showDocument: function () {
    var ScansView = require('./base_views/scans')
      , Document = require('./models/document')
      , dokument = new Document(EditorsNotes.bootstrap, { parse: true })
      , view = new ScansView({ el: '#scans', model: dokument })
  }
});
*/

// Initialize timeago
function initTimeago() {
  $('time.timeago').timeago();
}

// Initialize autocomplete for search input box
function initAutocomplete() {
  var opts = require('./utils/base_autocomplete_opts');

  $('input.search-autocomplete')
  .keydown(function(event) {
    // If no autocomplete menu item is active, submit on ENTER.
    if (event.keyCode === $.ui.keyCode.ENTER) {
      if ($('#ui-active-menuitem').length === 0) {
        $('#searchform form').submit();
      }
    }
  })
  .autocomplete(opts)
  .data('ui-autocomplete')._renderItem = function (ul, item) {
    var $li = $.ui.autocomplete.prototype._renderItem.call(this, ul, item);

    $li.find('a').prepend('<strong>' + item.type + ': </strong>');
    return $li;
  }
}

// Initialize tooltip functionality
function initTooltips () {
  $('body')
    .tooltip({ selector: '[data-toggle="tooltip"]' })
    .on('click', 'a[data-toggle="tooltip"][href="#"]', function () { return false });
}
