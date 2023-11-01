/* eslint-disable @typescript-eslint/no-unused-vars */
type PglData = {
	id: number
	cia_primary_language: string
	wiki_primary_language: string
	rest_countries_primary_language: string
	country: string
}

class Counts {
	data: Record<string, number> = {}

	add(language: string) {
		if (this.data[language]) {
			this.data[language]++
		} else {
			this.data[language] = 1
		}
	}

	getHighestCount() {
		return Object.entries(this.data).filter(([_, value]) => {
			return value === this.getMaxCount()
		})
	}

	private getMaxCount(): number {
		return Math.max(...Object.values(this.data))
	}
}

class RestCountriesPrimaryLanguageFindStrategy {
	static keywords = ["rest", "primary_language"]
	static keyword2 = ["countries", "country"]

	static find(this: void, key: string) {
		if (
			RestCountriesPrimaryLanguageFindStrategy.keywords.every((keyword) =>
				key.includes(keyword)
			) &&
			RestCountriesPrimaryLanguageFindStrategy.keyword2.every(
				(keyword) => !key.includes(keyword)
			)
		) {
			return true
		}
		return false
	}
}

/** The default row value to use if all languages are tied */
class DefaultValueFinder {
	strategy: (key: string) => boolean = RestCountriesPrimaryLanguageFindStrategy.find

	public find(keys: string[]) {
		return keys.find(this.strategy)
	}
}

class FrequencyCalculator {
	defaultValueFinder = new DefaultValueFinder()

	calculate(data: PglData[]) {
		return data.map((data) => {
			const counts = new Counts()
			let key: keyof PglData
			for (key in data) {
				if (!key.includes("primary_language")) {
					continue
				}
				const value = data[key]
				if (typeof value !== "string") {
					continue
				}
				counts.add(value)
			}
			const highestCountData = counts.getHighestCount()

			return this.#resolveReturn(data, counts, highestCountData)
		})
	}

	#resolveReturn(data: PglData, counts: Counts, highestCountData: [string, number][]) {
		if (highestCountData.length > 1) {
			const defaultValueKey = this.defaultValueFinder.find(Object.keys(data))
			if (!defaultValueKey) {
				throw new Error("No default value found")
			}
			return {
				...data,
				top_language: defaultValueKey,
				top_language_count: counts.data[defaultValueKey],
			}
		}

		return {
			...data,
			top_language: highestCountData[0],
			top_language_count: highestCountData[1],
		}
	}
}

function calculateFreq(data: PglData[]) {
	return data.map((data) => {
		const counts = new Counts()
		let key: keyof PglData
		for (key in data) {
			if (!key.includes("primary_language")) {
				continue
			}
			const value = data[key]
			if (typeof value !== "string") {
				continue
			}
			counts.add(value)
		}
		const highestCountData = counts.getHighestCount()
		return {
			...data,
			top_language: highestCountData[0],
			top_language_count: highestCountData[1],
		}
	})
}
