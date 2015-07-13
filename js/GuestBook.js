var GuestBook = React.createClass({
  displayName: "GuestBook",

  getInitialState: function() {
    return {
      entries: null,
      fetchError: null,
      isInputExpanded: false,
      showEntryConfirmation: false
    };
  },

  componentWillMount: function() {
    this._fetchEntries();
  },

  _fetchEntries: function() {
    var me = this;
    this.setState({ fetchError: null });

    var query = new Parse.Query(ApprovedGuestBookEntry);
    query.descending("createdAt");
    query.include("guestBookEntry");
    query.find({
      success: function(results) {
        var entries = results.map(function(approvedEntry) {
          var entry = approvedEntry.get("guestBookEntry");
          var uploadedPhoto = entry.get("uploadedPhoto");
          return {
            authorName: entry.get("authorName"),
            entryDate: entry.createdAt,
            id: entry.id,
            imgSrc: uploadedPhoto && uploadedPhoto.url(),
            location: entry.get("location"),
            messageText: entry.get("messageText")
          };
        });
        me.setState({
          entries: entries,
          fetchError: null
        });
      },
      error: function(error) {
        me.setState({ fetchError: error });
      }
    });
  },

  _onInputEntrySaved: function(entry) {
    this.setState({
      isInputExpanded: false,
      showEntryConfirmation: true
    });
  },

  _onExpandInputClick: function() {
    this.setState({ isInputExpanded: true });
  },

  _onInputCancelClick: function() {
    this.setState({ isInputExpanded: false });
  },

  render: function() {
    return React.DOM.div({ className: "guestBook" },
      this.state.isInputExpanded
          ? React.createElement(GuestBookInput, {
              onEntrySaved: this._onInputEntrySaved,
              onCancelClick: this._onInputCancelClick,
            })
          : (this.state.showEntryConfirmation
              ? null
              : React.DOM.button({
                  className: "guestBook-button",
                  onClick: this._onExpandInputClick
                }, "Add a Message")),
      this.state.fetchError
          ? React.DOM.div({ className: "guestBook-error" },
              this.state.fetchError.message
            )
          : null,
      this.state.showEntryConfirmation
          ? React.DOM.div({ className: "guestBook-entryConfirmed" },
              "Thank you. " +
                "Messages will be reviewed prior to posting."
            )
          : null,
      this.state.entries
          ? React.DOM.ul({ className: "guestBook-entries" },
              this.state.entries.map(function(entry) {
                return React.DOM.li({ key: entry.id },
                  React.createElement(GuestBookEntryView, entry)
                );
              })
            )
          : null
    );
  }
});
