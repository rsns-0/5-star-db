WITH cte1 AS (
SELECT
		rcad.id AS rcad_id,
		cca2 AS abbreviation,
		CASE 
			WHEN cca2 = 'CG' THEN 'fra'
			WHEN cca2 = 'DJ' THEN 'ara'
			WHEN cca2 = 'CM' THEN 'fra'
			WHEN cca2 = 'BQ' THEN 'nld'
			WHEN cca2 = 'CD' THEN 'fra'
			WHEN cca2 = 'BZ' THEN 'eng'
			WHEN cca2 = 'CW' THEN 'nld'
			WHEN cca2 = 'BY' THEN 'bel'
			WHEN cca2 = 'CF' THEN 'fra'
			WHEN cca2 = 'CZ' THEN 'ces'
			WHEN cca2 = 'BW' THEN 'eng'
			WHEN cca2 = 'AW' THEN 'nld'
		ELSE (
		SELECT
			KEY
		FROM
			jsonb_each_text(languages) AS key_value(KEY,
			value)
		LIMIT 1)
	END AS primary_language,
		
		rcad.name ->> 'official' AS country_name,
		discord_flag_emojis.value AS discord_flag_emojis_value,
		discord_flag_emojis.id AS discord_flag_emojis_id
FROM
	rest_countries_api_data rcad
JOIN discord_flag_emojis ON
	UPPER(SUBSTRING(discord_flag_emojis.value FROM 6)) = rcad.cca2
WHERE
	rcad.languages IS NOT NULL
),
cte2 AS (
SELECT
	cte1.*,
	rcad2.languages ->> cte1.primary_language AS full_language_name,
	rcad2.cca2
FROM
	rest_countries_api_data rcad2
JOIN cte1 ON
	rcad2.id = cte1.rcad_id),

cte3 AS (
SELECT
	cte2.*,
	dlsl.id AS dlsl_id,
	dlsl."name" AS dlsl_name,
	dlsl.abbreviation AS dlsl_abbreviation
FROM
	cte2
JOIN deep_l_supported_languages dlsl ON
	cte2.primary_language ILIKE dlsl.abbreviation
	OR cte2.cca2 ILIKE dlsl.abbreviation
	OR dlsl."name" ILIKE cte2.full_language_name
),

cte4 AS (
SELECT
	cte3.*,
	languages.id AS languages_id,
	languages.name AS languages_name
FROM
	cte3
JOIN languages ON
	languages."name" ILIKE dlsl_name
WHERE
	is_supported_by_deep_l = TRUE
)
--SELECT * FROM cte4

UPDATE discord_flag_emojis
SET "languagesId" = cte4.languages_id
FROM cte4
WHERE discord_flag_emojis.id = cte4.discord_flag_emojis_id
