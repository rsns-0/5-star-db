import z from "zod";
import type { ValidatorArgs } from "../types";

const ValidatorArgsSchema = z
	.object({
		leftFieldName: z.string().min(1, "leftFieldName is falsy"),
		rightFieldName: z.string().min(1, "rightFieldName is falsy"),
		leftTableData: z.array(z.record(z.any())).nonempty("leftTableData is empty"),
		rightTableData: z.array(z.record(z.any())).nonempty("rightTableData is empty"),
		leftTable: z.string().min(1),
		rightTable: z.string().min(1),
	})
	.refine((data) => data.leftTableData.length > 0 && data.leftTableData[0], {
		message: "leftTableData[0] is falsy",
	})
	.refine((data) => data.rightTableData.length > 0 && data.rightTableData[0], {
		message: "rightTableData[0] is falsy",
	})
	.refine((data) => data.leftFieldName in data.leftTableData[0], {
		message: `leftFieldName is not in leftTableData[0]`,
	})
	.refine((data) => data.rightFieldName in (data.rightTableData[0] || {}), {
		message: `rightFieldName:  is not in rightTableData[0]`,
	})
	.refine((data) => data.leftTable !== data.rightTable, {
		message: `leftTable is the same as rightTable`,
	});

export const defaultValidator = ({
	leftFieldName,
	rightFieldName,
	leftTableData,
	rightTableData,
	leftTable,
	rightTable,
}: ValidatorArgs) => {
	try {
		ValidatorArgsSchema.parse({
			leftFieldName,
			rightFieldName,
			leftTableData,
			rightTableData,
			leftTable,
			rightTable,
		});
	} catch (e) {
		if (!(e instanceof Error)) {
			throw e;
		}
		e.message = `Error in RatioCalc.validate. Data: ${JSON.stringify({
			leftFieldName,
			rightFieldName,
			leftTableData,
			rightTableData,
			leftTable,
			rightTable,
			errorMessage: e.message,
		})}`;
		throw e;
	}
};
