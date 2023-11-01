

--SELECT rest_countries_api_data_names.id, rest_countries_api_data_names.official FROM rest_countries_api_new_data JOIN rest_countries_api_data_names ON rest_countries_api_data_names.official = rest_countries_api_new_data.name

UPDATE rest_countries_api_new_data 
SET rest_countries_api_data_names_id = rest_countries_api_data_names.id 
FROM rest_countries_api_data_names 
WHERE rest_countries_api_new_data.name = rest_countries_api_data_names.official 