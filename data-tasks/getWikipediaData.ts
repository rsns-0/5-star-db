import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

import { z } from "zod";
const db = new PrismaClient();
const entryName = "wikipedia language data";

const dataSchema = z.object({
	"Widely spoken": z.string(),
	"Country/Region": z.string(),
	"Minority language": z.string(),
	"National language": z.string(),
	"Official language": z.string(),
	"Regional language": z.string(),
});

async function saveData(data: Record<string, any>[]) {
	const res = await db.unstructured_storage.findFirst({
		where: {
			name: {
				equals: entryName,
			},
		},
	});

	// update
	if (res) {
		console.log("Entry already exists, updating.");
		await db.unstructured_storage.update({
			where: {
				id: res.id,
			},
			data: {
				json: data,
			},
		});
		console.log("done.");
		return;
	}

	// create
	console.log("Entry does not exist. Creating.");
	await db.unstructured_storage.create({
		data: {
			name: entryName,
			json: data,
		},
	});
	console.log("done.");
}

async function main() {
	const res = readFileSync("testLogs/convertjson.json", "utf-8");
	const data = JSON.parse(res);
	const res2 = dataSchema.array().parse(data);

	await saveData(res2);
}
void main();
