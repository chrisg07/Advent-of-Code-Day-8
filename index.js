const fs = require('fs')
var Display = require('./Display.js')

const { Worker } = require('worker_threads')

fs.readFile('input.txt', 'utf8', (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	const entries = data.split(/\r?\n/).map(line => line.trim());
	const display = new Display(entries);
	console.log('answer: ', display.getAnswer())
})