const Component = require('component');
const { span, text } = require('component/src/html');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CurrentDate = {
  init() {
    return {
      month: 0,
      year: 1
    };
  },

  useShadow: true,

  render: model =>
    span({ id: 'date' }, [ text(CurrentDate.asText(model)) ]),

  asText: ({ month, year }) => `${MONTHS[month]}, Year ${year}`
};

Component.define('current-date', CurrentDate);