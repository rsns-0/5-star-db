export class CleaningService {
	patterns = [
		/\b(?!(?:federation|and|of|democratic|republic|the|people(?:'s)?|islands?|northern|commonwealth)\b)\w+/g,
	];
	public clean(text: string) {
		return this.patterns.reduce((acc, pattern) => {
			return acc.replace(pattern, "");
		}, text);
	}
}
