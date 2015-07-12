/**
 * interface Props {
 *   authorName: string;
 *   entryDate: Date;
 *   messageText: string;
 * }
 */
var GuestBookEntryView = React.createClass({
  displayName: "GuestBookEntryView",

  render: function() {
    return React.DOM.div({
        className: "guestBookEntryView"
      },
      React.DOM.p({
        className: "guestBookEntryView-message"
      }, this.props.messageText),
      React.DOM.span({
        className: "guestBookEntryView-date"
      }),
      this.props.authorName && this.props.authorName.length > 0
          ? React.DOM.span({
              className: "guestBookEntryView-name"
            }, "\u2014", this.props.authorName)
          : null
    );
  }
});
