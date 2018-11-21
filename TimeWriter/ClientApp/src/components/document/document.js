﻿import './_.css';

import React, { Component } from 'react';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import TextDocument from '../../services/text-document';
import Line from './line';

class Document extends Component {
	constructor(props) {
		super(props);

		this._hubConnection = new HubConnectionBuilder()
			.withUrl("/document_hub")
			.configureLogging(LogLevel.Information)
			.build();
		this._textDocument = new TextDocument();

		this.keyPressed = this.keyPressed.bind(this);

		this.state = {
			document: this._textDocument.state
		};
	}

	componentDidMount() {
		this._hubConnection.start().catch(err => console.error(err.toString()));
		//this._hubConnection.on('addMessage', this.addMessage);
		//this._hubConnection.invoke('sendMessage', 'dupa');
	}

	keyPressed(e) {
		const key = e.key;
		const keyCode = e.keyCode;

		if (keyCode === 32)
			this._textDocument.addEvent({ author: 1, type: 'insert', text: ' ' });
		else if (48 <= keyCode && keyCode <= 90)
			this._textDocument.addEvent({ author: 1, type: 'insert', text: key });
		else if (keyCode === 37 || keyCode === 39)
			this._textDocument.addEvent({ author: 1, type: 'navigate', offset: keyCode === 37 ? -1 : +1 });
		else if (keyCode === 8)
			this._textDocument.addEvent({ author: 1, type: 'delete', length: 1 });

		this.setState({
			document: this._textDocument.state
		});
	}

	prepareLayout(document) {
		let lines = document.text.split("\n");
		lines = lines.map(line => (
			{
				text: line,
				begin: 0,
				carets: []
			}));
		for (let i = 1; i < lines.length; i++)
			lines[i].begin = lines[i - 1].begin + lines[i - 1].text.length;
		for (const line of lines)
			for (const caret of this.state.document.carets)
				if (caret.position >= line.begin && caret.position < line.begin + line.text.length)
					line.carets.push(caret);

		const wrappedLines = lines.map((line, index) => <Line key={index} number={index + 1} text={line.text} carets={line.carets} begin={line.begin} />);

		return wrappedLines;
	}

	render() {
		var text = this.prepareLayout(this.state.document);

		return (
			<div className="document" tabIndex="0" onKeyDown={this.keyPressed}>
				<h1>{this.props.id}</h1>
				<div>
					{text}
				</div>
			</div>
		);
	}
}

export default Document;