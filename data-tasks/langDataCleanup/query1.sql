
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
	rcad.languages IS NOT NULL