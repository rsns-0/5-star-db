import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";

async function main() {
	const db = new PrismaClient();

	const res = await db.rest_countries_api_data_names.findMany();
	writeFileSync("testLogs/langNames.json", JSON.stringify(res), "utf-8");
}
void main();
