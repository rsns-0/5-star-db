import { z } from "zod"

export const nameSchema = z.object({
	common: z.string(),
	official: z.string(),
	nativeName: z
		.record(
			z.string(),
			z.object({
				common: z.string(),
				official: z.string(),
			})
		)
		.optional(),
})

export const languagesSchema = z.record(z.string(), z.any())

export function findDuplicates<T>(array: T[]) {
	const seen = new Set<T>()
	const duplicates = new Set<T>()

	for (const item of array) {
		if (seen.has(item)) {
			duplicates.add(item)
			console.log("Duplicate found: ")
			console.log(item)
		}
		seen.add(item)
	}

	if (duplicates.size) {
		console.log("No duplicates found.")
	}
	return duplicates
}

export type LanguageData = {
	abbreviationFromLanguageTable: string
	languageIdFromLanguageTable: number
	restCountriesId: number
	newOfficialName: string
	languageIdNumbers: number[] // associates the rest country entry with the language table entries
}
