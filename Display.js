module.exports = class Display {
	patterns = []
	output = []
	outputDigits = []
	solvedDigits = []
	signalHashes = []
	answer = 0
	
  constructor(lines) {
		for (let entry of lines) {
			if (entry) {
				let values = entry.split('|');
				this.patterns.push(values[0].trim().split(" "))
				this.output.push(values[1].trim().split(" "))
			}
		}
		for (let i = 0; i < lines.length; i++) {
			const digitMappings = [];
			for (let j = 0; j < 10; j++) {
				digitMappings.push([])
			}
			this.signalHashes.push([])
			this.solvedDigits.push([])
		}
		this.decodeInitialDigits();
		this.decodeRemainingDigits();
		this.decodeOutputDigits();
		this.answer = this.getSumOfSolvedOutput();
		console.log('answer:', this.answer)
  }

	getSumOfSolvedOutput() {
		this.solvedDigits = this.solvedDigits.map(digitArray => {
			return Number(digitArray.join(''))
		})
		console.log(this.solvedDigits)
		return this.solvedDigits.reduce((a, b) => a + b)
	}

	decodeInitialDigits() {
		for (let [index, values] of this.patterns.entries()) {
			for (let entry of values) {
				this.determineDigitFromLength(entry, index)
			}
		}
		for (const [index, values] of this.output.entries()) {
			for (let entry of values) {
				this.determineDigitFromLength(entry, index)
			}
		}
	}

	decodeRemainingDigits() {
		for (let [index, values] of this.patterns.entries()) {
			for (let entry of values) {
				this.determineDigitFromOtherDigits(entry, index)
			}
		}
		for (const [index, values] of this.output.entries()) {
			for (let entry of values) {
				this.determineDigitFromOtherDigits(entry, index)
			}
		}
		console.log(this.signalHashes)
	}

	decodeOutputDigits() {
		for (const [index, values] of this.output.entries()) {
			for (let entry of values) {
				const digit = this.determineDigitFromSolvedDigits(entry, index)
				this.solvedDigits[index].push(digit)
			}
		}
	}

	determineDigitFromSolvedDigits(entry, index) {
		const solvedDigits = this.signalHashes[index]
		for (let i = 0; i < 10; i++) {
			const isSameSignal = this.determineStringDelta(entry, solvedDigits[i]) === entry.length && this.determineStringDelta(solvedDigits[i], entry) === solvedDigits[i].length
			if (isSameSignal) {
				return i
			}
		}
	}

	/*
		Segment lengths: [digit]:[required # of segments to display]
		0: 6
		2: 5
		3: 5
		5: 5
		6: 6
		9: 6
	 */
	determineDigitFromOtherDigits(entry, index) {
		const solvedDigits = this.signalHashes[index]
		switch(entry.length) {
			case 5:
				this.determineFiveSegmentDigit(entry, index)
				break
			case 6:
				this.determineSixSegmentDigit(entry, index)
			default:
		}
	}

	determineFiveSegmentDigit(entry, index) {
		const solvedDigits = this.signalHashes[index]
		const isThree = this.determineStringDelta(entry, solvedDigits[1]) === 2
		if (isThree) {
			this.signalHashes[index][3] = entry
		} else {
			// must be 2 or 5
			const isTwo = this.determineStringDelta(entry, solvedDigits[4]) === 2
			if (isTwo) {
				this.signalHashes[index][2] = entry
			} else {
				this.signalHashes[index][5] = entry
			}
		}
	}

	determineSixSegmentDigit(entry, index) {
		const solvedDigits = this.signalHashes[index]
		const isNine = this.determineStringDelta(entry, solvedDigits[4]) === 4
		if (isNine) {
			this.signalHashes[index][9] = entry
		} else {
			// must be 0 or 6
			const isZero = this.determineStringDelta(entry, solvedDigits[1]) === 2
			if (isZero) {
				console.log("matched zero with: " + entry)
				this.signalHashes[index][0] = entry
			} else {
				console.log("matched six")
				this.signalHashes[index][6] = entry
			}
		}
	}

/**
 * returns the number of shared characters between string1 and string 2
 */
	determineStringDelta(string1, string2) {
		let numSame = 0
		for (let char of string1) {
			if (string2.includes(char)) {
				numSame++
			}
		}
		return numSame
	}

	/*
		Segment lengths: [digit]:[required # of segments to display]
		1: 2
		4: 4
		7: 3
		8: 7
	 */
	determineDigitFromLength(signal, entryIndex) {
		const numSegments = signal.length
		switch (numSegments) {
			case 2:
				this.signalHashes[entryIndex][1] = signal
				return 1;
			case 3:
				this.signalHashes[entryIndex][7] = signal
				return 7;
			case 4:
				this.signalHashes[entryIndex][4] = signal
				return 4;
			case 7:
				this.signalHashes[entryIndex][8] = signal
				return 8;
			default:
		}
	}

	getAnswer() {
		return this.answer
	}
}
