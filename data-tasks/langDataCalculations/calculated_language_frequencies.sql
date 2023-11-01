CREATE OR REPLACE VIEW joined_processed_lang_data_v1 AS


SELECT t.id,
       t.official,
       t.common,
       t.primary_language      AS cia_primary_language,
       t.primary_language_wiki AS wiki_primary_language,
       t.rest_countries_api_data_names_id,
       rcadl.name              AS rest_countries_primary_language
FROM processed_lang_data_v1 t


         JOIN rest_countries_api_new_data rcand
              ON rcand.rest_countries_api_data_names_id = t.rest_countries_api_data_names_id
         JOIN public."_rest_countries_api_data_languagesTorest_countries_api_new_data" rcadlTcand
              ON rcand.id = rcadlTcand."B"
         JOIN public.rest_countries_api_data_languages rcadl ON rcadlTcand."A" = rcadl.id;


CREATE OR REPLACE FUNCTION calculated_language_frequencies()
    RETURNS TABLE
            (
                id                              BIGINT,
                cia_primary_language            TEXT,
                wiki_primary_language           TEXT,
                rest_countries_primary_language TEXT,
                country                         TEXT,
                top_language                    TEXT,
                top_language_count              INT
            )
AS
$$

  class Counts {
    constructor() {
        this.data = {};
    }

    add(language) {
        if (this.data[language]) {
            this.data[language]++;
        } else {
            this.data[language] = 1;
        }
    }

    getHighestCount() {
        return Object.entries(this.data).reduce((acc, curr) => {
            return curr[1] > acc[1] ? curr : acc;
        });
    }
}

function calculateFreq(data) {
    return data.map((dataItem) => {
        const counts = new Counts();
        for (let key in dataItem) {
            if (!key.includes("primary_language")) {
                continue;
            }
            const value = dataItem[key];
            if (typeof value !== "string") {
                continue;
            }
            counts.add(value);
        }
        const highestCountData = counts.getHighestCount();
        return {
            ...dataItem,
            top_language: highestCountData[0],
            top_language_count: highestCountData[1],
        };
    });
}
var data = plv8.execute(`SELECT * FROM joined_processed_lang_data_v1`)
return calculateFreq(data)
$$ LANGUAGE plv8;