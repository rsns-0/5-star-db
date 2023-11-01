import type { Calculation } from "../types";

export class DataTracker {
	data: Calculation[] = [];

	addData(value: Calculation) {
		this.data.push(value);
	}
}
