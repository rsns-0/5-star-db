import { readFileSync } from "fs";

import type { Calculation } from "../../types";
import { PrismaClient, type Prisma } from "@prisma/client";

async function main() {
	const db = new PrismaClient();

	const res = JSON.parse(readFileSync("resources/ratioCalcData.json", "utf-8")) as Calculation[];

	const result = res.map((res): Prisma.CalculationCreateInput => {
		return {
			left_country_id: res.identifier.leftId,
			right_country_id: res.identifier.rightId,
			left_country_table: res.identifier.leftTable,
			right_country_table: res.identifier.rightTable,
			left_country_name: res.leftValue,
			right_country_name: res.rightValue,
			left_country_table_field_name: res.identifier.leftFieldName,
			right_country_table_field_name: res.identifier.rightFieldName,
			ratio: res.calculations.ratio,
			token_set_ratio: res.calculations.tokenSetRatio,
		};
	});
	await db.calculation.createMany({
		data: result,
	});
	console.log("done");
}

void main();
