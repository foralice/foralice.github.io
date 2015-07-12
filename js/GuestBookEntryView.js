var MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

/**
 * interface Props {
 *   authorName: string;
 *   entryDate: Date;
 *   messageText: string;
 * }
 */
var GuestBookEntryView = React.createClass({
  displayName: "GuestBookEntryView",

  _renderTimestamp: function(date) {
    if (date) {
      return MONTHS[date.getMonth()] + " " +
          date.getDate() + ", " + date.getFullYear();
    }
  },

  _renderMessage: function(messageText) {
    var elements = [];
    var lines = messageText.split("\n");
    if (lines.length > 0) {
      elements.push(lines[0]);
    }
    for (var i = 1; i < lines.length; ++i) {
      elements.push(React.DOM.br());
      elements.push(lines[i]);
    }
    return elements;
  },

  render: function() {
    return React.DOM.div({
        className: "guestBookEntryView"
      },
      React.DOM.span({
        className: "guestBookEntryView-name"
      }, this.props.authorName),
      React.DOM.span({
        className: "guestBookEntryView-date"
      }, this._renderTimestamp(this.props.entryDate)),
      React.DOM.p({
        children: this._renderMessage(this.props.messageText),
        className: "guestBookEntryView-message"
      })
    );
  }
});
