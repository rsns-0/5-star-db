import { writeFileSync, readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import pProps from "p-props";
import { asyncLog, log } from "../utils";
import type { ClassMethodReturn, QueryReturn } from "../types";

const getCount = (res: Record<string, any[]>) => {
	return Object.values(res)
		.map((res) => res.length)
		.reduce((acc, prev) => acc + prev);
};

export class QueryService {
	constructor(public fileLocation: string, public db: PrismaClient) {}

	@log<ClassMethodReturn<QueryService, "readFromFile">>(
		(res) => `Found ${getCount(res)} entries in file`
	)
	public readFromFile() {
		return JSON.parse(readFileSync(this.fileLocation, "utf-8")) as QueryReturn;
	}

	@log("done")
	public async run() {
		const data = await this.query();
		this.writeToFile(data);
	}

	@asyncLog<ClassMethodReturn<QueryService, "query">>(
		(res) => `Returned ${getCount(res)} entries from db`
	)
	query() {
		return pProps({
			wiki: this.db.wikiData.findMany({
				select: {
					id: true,
					country_or_region: true,
				},
			}),
			cia: this.db.newCiaLanguageData.findMany({
				select: {
					id: true,
					country: true,
					primary_language: true,
				},
			}),
			rest: this.db.rest_countries_api_data_names.findMany({
				select: {
					id: true,
					common: true,
					official: true,
					nativeName: true,
					rest_countries_api_new_data: { select: { altSpellings: true } },
				},
			}),
		});
	}

	private writeToFile(data: QueryReturn) {
		writeFileSync(this.fileLocation, JSON.stringify(data));
	}
}
