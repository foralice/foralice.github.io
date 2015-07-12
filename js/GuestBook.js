var GuestBook = React.createClass({
  displayName: "GuestBook",

  getInitialState: function() {
    return {
      entries: null,
      fetchError: null
    };
  },

  componentWillMount: function() {
    this._fetchEntries();
  },

  _fetchEntries: function() {
    var me = this;
    this.setState({ fetchError: null });

    var query = new Parse.Query(GuestBookEntry);
    query.limit(10);
    query.find({
      success: function(results) {
        var entries = results.map(function(entry) {
          return {
            authorName: entry.get("authorName"),
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
    this._fetchEntries();
  },

  render: function() {
    return React.DOM.div({ className: "guestBook" },
      !(this.state.fetchError || this.state.entries)
          ? React.DOM.span({ className: "guestBook-loading" }, "Loading")
          : null,
      this.state.fetchError
          ? React.DOM.div({ className: "guestBook-error" },
              this.state.fetchError.message
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
          : null,
      React.createElement(GuestBookInput, {
        onEntrySaved: this._onInputEntrySaved
      })
    );
  }
});
