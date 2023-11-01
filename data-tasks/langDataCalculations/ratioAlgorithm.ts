import { ratio, token_set_ratio } from "fuzzball";
import type { CoreActionArgs } from "../types";
import { DataTracker } from "./dataTracker";
import { CoreAction } from "./tableActionExecutor";

export class RatioAlgorithm {
	public calculateMultiple(left: string, right: string[]) {
		return right.map((right) => {
			return this.calculate(left, right);
		});
	}

	public calculate(left: string, right: string) {
		return { ratio: ratio(left, right), tokenSetRatio: token_set_ratio(left, right) };
	}
}

export class RatioAlgorithmToTableAdapter extends CoreAction {
	constructor(public dataTracker = new DataTracker(), public algorithm = new RatioAlgorithm()) {
		super();
	}

	execute({
		leftFieldName,
		leftTable,
		leftTableData,
		rightFieldName,
		rightTable,
		rightTableData,
	}: CoreActionArgs) {
		this.dataTracker.addData({
			identifier: {
				leftId: leftTableData.id,
				rightId: rightTableData.id,
				leftTable,
				rightTable,
				leftFieldName,
				rightFieldName,
			},
			calculations: this.algorithm.calculate(
				leftTableData[leftFieldName]!,
				rightTableData[rightFieldName]!
			),
			leftValue: leftTableData[leftFieldName]!,
			rightValue: rightTableData[rightFieldName]!,
		});
	}
}
