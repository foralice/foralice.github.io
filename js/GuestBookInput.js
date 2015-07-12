/**
 * interface Props {
 *   onEntrySaved: (entry: GuestBookEntry) => any;
 *   onInputCancelClick: React.MouseEventHandler;
 * }
 */
var GuestBookInput = React.createClass({
  displayName: "GuestBookInput",

  getInitialState: function() {
    return {
      authorName: "",
      isLoading: false,
      messageText: "",
      submissionError: null
    };
  },

  componentDidMount: function() {
    React.findDOMNode(this.refs.authorNameInput).focus();
  },

  _onFormSubmit: function(event) {
    var me = this;
    event.preventDefault();
    this.setState({ isLoading: true });

    var entry = new GuestBookEntry();
    entry.set("authorName", this.state.authorName);
    entry.set("messageText", this.state.messageText);
    entry.save(null, {
      success: function(entry) {
        me.setState({
          authorName: "",
          isLoading: false,
          messageText: "",
          submissionError: null
        });
        me.props.onEntrySaved(entry);
      },
      error: function(entry, error) {
        me.setState({
          isLoading: false,
          submissionError: error
        });
      }
    });
  },

  _onNameChange: function(event) {
    this.setState({
      authorName: event.target.value
    });
  },

  _onMessageChange: function(event) {
    this.setState({
      messageText: event.target.value
    });
  },

  render: function() {
    return React.DOM.div({
        className: "guestBookInput" +
          (this.state.isLoading ? " is-loading" : "")
      },
      this.state.submissionError
          ? React.DOM.div({
              className: "guestBookInput-error"
            }, this.state.submissionError.message)
          : null,
      React.DOM.form({
          onSubmit: this._onFormSubmit
        },
        React.DOM.div({ className: "guestBookInput-field" },
          React.DOM.label({
            className: "guestBookInput-label",
            htmlFor: "guest_book_input_name"
          }, "Name"),
          React.DOM.input({
            className: "guestBookInput-authorNameInput",
            disabled: this.state.isLoading,
            id: "guest_book_input_name",
            ref: "authorNameInput",
            onChange: this._onNameChange,
            value: this.state.authorName,
          })
        ),
        React.DOM.div({ className: "guestBookInput-field" },
          React.DOM.label({
            className: "guestBookInput-label",
            htmlFor: "guest_book_input_message"
          }, "Message"),
          React.DOM.textarea({
            className: "guestBookInput-messageTextInput",
            disabled: this.state.isLoading,
            id: "guest_book_input_message",
            onChange: this._onMessageChange,
            value: this.state.messageText
          })
        ),
        React.DOM.button({
          className: "guestBook-button guestBookInput-submitButton",
          disabled: this.state.isLoading,
          type: "submit"
        }, "Submit"),
        React.DOM.button({
          className: "guestBook-button guestBookInput-cancelButton",
          disabled: this.state.isLoading,
          onClick: this.props.onCancelClick,
          type: "button"
        }, "Cancel")
      ),
      (this.state.authorName && this.state.authorName.length > 0) ||
      (this.state.messageText && this.state.messageText.length > 0)
          ? React.DOM.div({ className: "guestBookInput-preview" },
              React.DOM.span({
                className: "guestBookInput-previewLabel",
                key: "previewLabel"
              }, "Preview"),
              React.createElement(GuestBookEntryView, {
                authorName: this.state.authorName,
                entryDate: new Date(),
                key: "previewEntry",
                messageText: this.state.messageText
              })
            )
          : null
    );
  }
});
