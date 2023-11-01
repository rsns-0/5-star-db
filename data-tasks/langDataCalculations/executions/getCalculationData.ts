import { writeFileSync } from "fs";

import { PrismaClient } from "@prisma/client";
import { TableActionExecutorImpl } from "../tableActionExecutorImpl";
import { QueryService } from "../query";

async function main() {
	const db = new PrismaClient();

	const queryService = new QueryService("resources/queryData.json", db);
	const res = queryService.readFromFile();

	const calc = new TableActionExecutorImpl(res);

	calc.run();
	writeFileSync("resources/ratioCalcData.json", JSON.stringify(calc.dataTracker.data));
}

void main();
