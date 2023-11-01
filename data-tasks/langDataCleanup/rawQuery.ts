import { Prisma } from "@prisma/client"
import { z } from "zod"

export const query1Schema = z.object({
	rcad_id: z.number(),
	abbreviation: z.string(),
	languages: z.record(z.string()),
	continents: z.string().array(),
	capital: z.string().array().nullable(),
	country_name: z.string(),
	discord_flag_emojis_value: z.string(),
	discord_flag_emojis_id: z.bigint(),
})

export const query1 = Prisma.sql`

SELECT
		rcad.id AS rcad_id,
		cca2 AS abbreviation,
		
		languages,
		continents,
		rcad.capital,
		
		rcad.name ->> 'official' AS country_name,
		discord_flag_emojis.value AS discord_flag_emojis_value,
		discord_flag_emojis.id AS discord_flag_emojis_id
FROM
	rest_countries_api_data rcad
JOIN discord_flag_emojis ON
	UPPER(SUBSTRING(discord_flag_emojis.value FROM 6)) = rcad.cca2
WHERE
	rcad.languages IS NOT NULL`
