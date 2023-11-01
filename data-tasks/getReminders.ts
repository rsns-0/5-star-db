import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";

import SuperJSON from "superjson";

const db = new PrismaClient();

async function main() {
	const result = await db.reminders.findMany();
	writeFileSync("testLogs/data.json", SuperJSON.stringify(result));
}
void main();
