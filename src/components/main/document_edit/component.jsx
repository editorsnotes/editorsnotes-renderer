"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , Document = require('../../../records/document')
  , commonStrings = require('../../common_strings')
  , standaloneForm = require('../../util/standalone_form.jsx')
  , DocumentEdit

DocumentEdit = React.createClass({
  propTypes: {
    document: React.PropTypes.instanceOf(Document).isRequired,
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    projectURL: React.PropTypes.string.isRequired,
    saveAndRedirect: React.PropTypes.func.isRequired,
    handleRecordChange: React.PropTypes.func.isRequired
  },

  render() {
    var DocumentForm = require('../../shared/document_form/component.jsx')
      , { document, loading, errors, projectURL, handleRecordChange, saveAndRedirect } = this.props

    return (
      <div>
        <DocumentForm
            document={document}
            errors={errors}
            projectURL={projectURL}
            onChange={handleRecordChange} />

        <section>
          <div className="well">
            <button
                className="btn btn-primary btn-large"
                disabled={loading}
                onClick={saveAndRedirect}>
              <Translate text={commonStrings.save} />
            </button>
          </div>
        </section>
      </div>
    )
  }
});

module.exports = standaloneForm(DocumentEdit, Document);
