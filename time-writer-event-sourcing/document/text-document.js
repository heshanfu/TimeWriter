﻿import EventStore from "./event-history/event-store";

export default class TextDocument {
	constructor(history) {
		if (!history)
			history = [
				{
					state: {
						carets: [],
						text: ''
					},
					timestamp: Date.now()
				}
			];

		this._eventStore = new EventStore(history);
	}

	get history() {
		return this._eventStore.history;
	}

	get state() {
		return this._eventStore.state;
	}

	addEvent(event, timestamp) {
		this._eventStore.add(event, timestamp);

		console.dir(this.history);
	}

	setTimestemp(event, timestamp) {
		this._eventStore.setTimestamp(event, timestamp);
	}
}