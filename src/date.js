const State = require('./state');

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const elements = {};
const alerts = {
    3: "It's April! Make sure you seed your fields this month.",
    9: "It's October! Make sure you harvest your fields this month."
}

const DateView = {
    init(date, monthButton, alertElement) {
        Object.assign(elements, {date, monthButton, alertElement});

        DateView.setDateText(date);

        monthButton.addEventListener('click', DateView.nextMonth);
    },

    nextMonth() {
        State.currentMonth++;

        if (State.currentMonth === 12){
            State.currentMonth = 0;
            State.currentYear ++;
        }

        DateView.setDateText();
        DateView.displayAlerts();
    },

    displayAlerts() {
        if (State.currentMonth in alerts) {
            elements.alertElement.textContent = alerts[State.currentMonth];
        } else {
            elements.alertElement.textContent = '';
        }
    },

    setDateText() {
        elements.date.textContent = (MONTHS[State.currentMonth] + ", Year " + State.currentYear);
    }
};

module.exports = DateView;