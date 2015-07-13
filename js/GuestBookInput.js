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
      isPhotoUploadExpanded: false,
      location: "",
      messageText: "",
      selectedPhoto: null,
      selectedPhotoSrc: null,
      submissionError: null
    };
  },

  componentDidMount: function() {
    React.findDOMNode(this.refs.authorNameInput).focus();
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.selectedPhoto &&
        (this.state.selectedPhoto !== prevState.selectedPhoto)) {
      var me = this;
      var reader = new FileReader();
      reader.onload = function(e) {
        me.setState({ selectedPhotoSrc: e.target.result });
      }
      reader.readAsDataURL(this.state.selectedPhoto);
    }
  },

  _saveEntry: function(uploadedPhoto) {
    var me = this;
    var entry = new GuestBookEntry();

    entry.set("authorName", this.state.authorName);
    entry.set("location", this.state.location);
    entry.set("messageText", this.state.messageText);
    entry.set("uploadedPhoto", uploadedPhoto);
    entry.save(null, {
      success: function(entry) {
        me.setState({
          authorName: "",
          isLoading: false,
          isPhotoUploadExpanded: false,
          location: "",
          messageText: "",
          selectedPhoto: null,
          selectedPhotoSrc: null,
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

  _onFormSubmit: function(event) {
    var me = this;
    event.preventDefault();
    this.setState({ isLoading: true });

    if (this.state.selectedPhoto) {
      var file = this.state.selectedPhoto;
      var parseFile = new Parse.File(file.name, file);
      parseFile.save().then(function() {
        me._saveEntry(/*uploadedPhoto*/parseFile);
      }, function(error) {
        me.setState({ submissionError: error });
      });
    } else {
      this._saveEntry();
    }
  },

  _onNameChange: function(event) {
    this.setState({
      authorName: event.target.value
    });
  },

  _onLocationChange: function(event) {
    this.setState({
      location: event.target.value
    });
  },

  _onMessageChange: function(event) {
    this.setState({
      messageText: event.target.value
    });
  },

  _onPhotoChange: function(e) {
    this.setState({ selectedPhoto: null });
    var files = e.target.files || e.dataTransfer.files;
    var file = files[0];
    if (file) {
      this.setState({
        selectedPhoto: file,
        selectedPhotoSrc: null
      });
    }
  },

  _onExpandPhotoUploadClick: function(event) {
    this.setState({ isPhotoUploadExpanded: true });
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
            className: "guestBookInput-input",
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
            className: "guestBookInput-input guestBookInput-messageTextInput",
            disabled: this.state.isLoading,
            id: "guest_book_input_message",
            onChange: this._onMessageChange,
            value: this.state.messageText
          })
        ),
        React.DOM.div({ className: "guestBookInput-field" },
          React.DOM.label({
            className: "guestBookInput-label",
            htmlFor: "guest_book_input_location"
          }, "City"),
          React.DOM.input({
            className: "guestBookInput-input",
            disabled: this.state.isLoading,
            id: "guest_book_input_location",
            onChange: this._onLocationChange,
            value: this.state.location
          })
        ),
        this.state.isPhotoUploadExpanded
          ? React.DOM.div({ className: "guestBookInput-field" },
              React.DOM.label({
                className: "guestBookInput-label",
                htmlFor: "guest_book_input_photo"
              }, "Photo"),
              React.DOM.input({
                disabled: this.state.isLoading,
                id: "guest_book_input_photo",
                onChange: this._onPhotoChange,
                type: "file"
              })
            )
          : React.DOM.a({
              className: "guestBookInput-expandPhotoUploadButton",
              onClick: this._onExpandPhotoUploadClick
            }, "Upload a Photo"),
        React.DOM.div({ className: "guestBookInput-footer" },
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
        )
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
                imgSrc: this.state.selectedPhotoSrc,
                key: "previewEntry",
                location: this.state.location,
                messageText: this.state.messageText,
              })
            )
          : null
    );
  }
});
