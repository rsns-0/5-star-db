import { PrismaClient } from "@prisma/client"

import { readFileSync } from "fs"
import { z } from "zod"
type ProcessedLangData = {
	id: number
	common: string
	official: string
	nativeName: any
	fuzzy_official_top_country: string
	fuzzy_official_top_country_similarity: number
	fuzzy_common_top_country: string
	fuzzy_common_top_country_similarity: number
	max__official_score_between_common_and_official: number
	country: string
	primary_language: string
	fuzzy_top_country_or_region: string
	fuzzy_top_country_or_region_similarity: number
	widely_spoken: string
	country_or_region: string
	minority_language: string
	national_language: string
	official_language: string
	regional_language: string
	primary_language_wiki: string
}

const processedLangDataSchema = z.object({
	id: z.number(),
	common: z.string(),
	official: z.string(),
	nativeName: z.record(z.any()),
	fuzzy_official_top_country: z.string(),
	fuzzy_official_top_country_similarity: z.number(),
	fuzzy_common_top_country: z.string(),
	fuzzy_common_top_country_similarity: z.number(),
	max_official_score_between_common_and_official: z.number(),
	country: z.string(),
	primary_language: z.string(),
	fuzzy_top_country_or_region: z.string(),
	fuzzy_top_country_or_region_similarity: z.number(),
	widely_spoken: z.string(),
	country_or_region: z.string(),
	minority_language: z.string(),
	national_language: z.string(),
	official_language: z.string(),
	regional_language: z.string(),
	primary_language_wiki: z.string(),
})

async function main() {
	const res: ProcessedLangData[] = JSON.parse(readFileSync("testLogs/clean_data.json", "utf-8"))
	const res2 = res.map((data) => {
		return {
			...data,
			max_official_score_between_common_and_official:
				data.max__official_score_between_common_and_official,
		}
	})
	const res3 = processedLangDataSchema.array().parse(res2)

	const db = new PrismaClient()

	await db.processedLangData.createMany({
		data: res3.map((data) => {
			return {
				...data,
				rest_countries_api_data_names_id: data.id,
			}
		}),
	})
}
void main()
