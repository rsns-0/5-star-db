import { type Prisma, PrismaClient } from "@prisma/client";

import { asyncLog } from "../utils";
import { findDuplicates } from "./util";
import { readFileSync } from "fs";
import { query1, query1Schema } from "./rawQuery";

class Main {
	constructor(public db: PrismaClient = new PrismaClient()) {}

	public async getData() {
		const res = await this.db.$queryRaw(query1);

		const res2 = query1Schema.array().parse(res);
	}

	public async cleanRestCountryData() {
		const res = await this.db.rest_countries_api_data.findMany();
		const res2 = res.map((item) => {
			return {
				...item,
				//@ts-expect-error all are json objects
				name: item.name?.official ?? "",
			};
		});

		const res3 = res2.map((item) => {
			return this.db.rest_countries_api_new_data.create({
				//@ts-expect-error JsonNull should accept null
				data: {
					...item,
					languages: {
						connect: item.languages
							? { name: Object.values(item.languages)[0] }
							: undefined,
					},
				},
			});
		});
		await this.db.$transaction(res3);
	}

	public async createRestCountryNamesTable() {
		const result: any[] = JSON.parse(
			readFileSync("scripts/langDataCleanup/countriesV3.json", "utf-8")
		);
		const result2 = result.map((res) => {
			return res.name;
		});

		const f = await this.db.rest_countries_api_data_names.createMany({
			data: result2,
		});
	}

	@asyncLog<Main["updateData"]>({
		logStrategy: (res) => {
			console.log(res.count + "updated");
		},
	})
	public async updateData() {
		const db = this.db;
		const data = await db.rest_countries_api_data.findMany();

		const languages = this.removeDuplicates(this.getLanguages(data));

		this.throwOnDuplicates(languages);

		const languageEntries = Object.entries(languages);

		return await db.rest_countries_api_data_languages.createMany({
			data: languageEntries.map(([abbreviation, fullName]) => ({
				abbreviation,
				name: fullName,
			})),
		});
	}

	@asyncLog<Main["insertDeepLData"]>({
		logStrategy: (res) => {
			console.log(res.count + "updated");
		},
	})
	public async insertDeepLData() {
		const languages = [
			{
				name: "Bulgarian",
				abbreviation: "BG",
			},
			{
				name: "Czech",
				abbreviation: "CS",
			},
			{
				name: "Danish",
				abbreviation: "DA",
			},
			{
				name: "German",
				abbreviation: "DE",
			},
			{
				name: "Greek",
				abbreviation: "EL",
			},
			{
				name: "English",
				abbreviation: "EN",
			},
			{
				name: "English_British",
				abbreviation: "EN-GB",
			},
			{
				name: "English_American",
				abbreviation: "EN-US",
			},
			{
				name: "Spanish",
				abbreviation: "ES",
			},
			{
				name: "Estonian",
				abbreviation: "ET",
			},
			{
				name: "Finnish",
				abbreviation: "FI",
			},
			{
				name: "French",
				abbreviation: "FR",
			},
			{
				name: "Hungarian",
				abbreviation: "HU",
			},
			{
				name: "Indonesian",
				abbreviation: "ID",
			},
			{
				name: "Italian",
				abbreviation: "IT",
			},
			{
				name: "Japanese",
				abbreviation: "JA",
			},
			{
				name: "Korean",
				abbreviation: "KO",
			},
			{
				name: "Lithuanian",
				abbreviation: "LT",
			},
			{
				name: "Latvian",
				abbreviation: "LV",
			},
			{
				name: "Norwegian",
				abbreviation: "NB",
			},
			{
				name: "Dutch",
				abbreviation: "NL",
			},
			{
				name: "Polish",
				abbreviation: "PL",
			},
			{
				name: "Portuguese",
				abbreviation: "PT",
			},
			{
				name: "Portuguese_Brazilian",
				abbreviation: "PT-BR",
			},
			{
				name: "Portuguese_All",
				abbreviation: "PT-PT",
			},
			{
				name: "Romanian",
				abbreviation: "RO",
			},
			{
				name: "Russian",
				abbreviation: "RU",
			},
			{
				name: "Slovak",
				abbreviation: "SK",
			},
			{
				name: "Slovenian",
				abbreviation: "SL",
			},
			{
				name: "Swedish",
				abbreviation: "SV",
			},
			{
				name: "Turkish",
				abbreviation: "TR",
			},
			{
				name: "Ukrainian",
				abbreviation: "UK",
			},
			{
				name: "Chinese",
				abbreviation: "ZH",
			},
		];

		return await this.db.deep_l_supported_languages.createMany({
			data: languages,
		});
	}

	public async insertFlags() {
		const data = [
			"flag_es",
			"flag_ac",
			"flag_ae",
			"flag_af",
			"flag_ag",
			"flag_ai",
			"flag_al",
			"flag_am",
			"flag_ao",
			"flag_aq",
			"flag_ar",
			"flag_as",
			"flag_at",
			"flag_au",
			"flag_aw",
			"flag_ax",
			"flag_az",
			"flag_ba",
			"flag_bb",
			"flag_bd",
			"flag_be",
			"flag_bf",
			"flag_bg",
			"flag_bh",
			"flag_bi",
			"flag_bj",
			"flag_bl",

			"flag_bm",
			"flag_bn",
			"flag_bo",
			"flag_bq",
			"flag_br",
			"flag_bs",
			"flag_bt",
			"flag_bv",
			"flag_bw",
			"flag_by",
			"flag_bz",
			"flag_ca",
			"flag_cc",
			"flag_cd",
			"flag_cf",
			"flag_cg",
			"flag_ch",
			"flag_ci",
			"flag_ck",
			"flag_cl",
			"flag_cm",
			"flag_cn",
			"flag_co",
			"flag_cp",
			"flag_cr",
			"flag_cu",
			"flag_cv",
			"flag_cw",
			"flag_cx",
			"flag_cy",
			"flag_cz",
			"flag_dg",
			"flag_dj",
			"flag_dk",
			"flag_dm",
			"flag_do",
			"flag_dz",
			"flag_ea",
			"flag_ec",
			"flag_ee",
			"flag_eg",
			"flag_eh",
			"flag_er",
			"flag_et",
			"flag_pw",
			"flag_py",
			"flag_qa",
			"flag_re",
			"flag_ro",
			"flag_rs",
			"flag_ru",
			"flag_rw",
			"flag_sa",
			"flag_sb",
			"flag_sc",
			"flag_sd",
			"flag_se",
			"flag_sg",
			"flag_sh",
			"flag_si",
			"flag_sj",
			"flag_sk",
			"flag_sl",
			"flag_sm",
			"flag_sn",
			"flag_so",
			"flag_sr",
			"flag_ss",
			"flag_st",
			"flag_sv",
			"flag_sx",
			"flag_sy",
			"flag_sz",
			"flag_ta",
			"flag_tc",
			"flag_td",
			"flag_tf",
			"flag_tg",
			"flag_th",
			"flag_tj",
			"flag_tk",
			"flag_tl",
			"flag_tm",
			"flag_tn",
			"flag_to",
			"flag_tr",
			"flag_tt",
			"flag_tv",
			"flag_tw",
			"flag_tz",
			"flag_ua",
			"flag_ug",
			"flag_um",
			"flag_uy",
			"flag_uz",
			"flag_va",
			"flag_vc",
			"flag_ve",
			"flag_vg",
			"flag_vi",
			"flag_vn",
			"flag_vu",
			"flag_wf",

			"flag_ws",
			"flag_xk",
			"flag_ye",
			"flag_yt",
			"flag_za",
			"flag_zm",
			"flag_zw",
			"flag_us",
			"flag_de",

			"flag_ad",
			"flag_hm",
			"flag_hn",
			"flag_hr",
			"flag_ht",
			"flag_hu",
			"flag_ic",
			"flag_id",
			"flag_ie",
			"flag_il",
			"flag_im",
			"flag_in",
			"flag_io",
			"flag_iq",
			"flag_ir",
			"flag_is",
			"flag_it",
			"flag_je",
			"flag_jm",
			"flag_jo",
			"flag_jp",
			"flag_ke",
			"flag_kg",
			"flag_kh",
			"flag_ki",
			"flag_km",
			"flag_kn",
			"flag_kp",
			"flag_kr",
			"flag_kw",
			"flag_ky",
			"flag_kz",
			"flag_la",
			"flag_lb",
			"flag_lc",
			"flag_li",
			"flag_lk",
			"flag_lr",
			"flag_ls",
			"flag_lt",
			"flag_lu",
			"flag_lv",
			"flag_ly",
			"flag_ma",
			"flag_mc",
			"flag_md",
			"flag_me",
			"flag_mf",
			"flag_mg",
			"flag_mh",
			"flag_mk",
			"flag_ml",
			"flag_mm",
			"flag_mn",
			"flag_mo",
			"flag_mp",
			"flag_mq",
			"flag_mr",
			"flag_ms",
			"flag_mt",
			"flag_mu",
			"flag_mv",
			"flag_mw",
			"flag_mx",
			"flag_my",
			"flag_mz",
			"flag_na",
			"flag_nc",
			"flag_ne",
			"flag_nf",
			"flag_ng",
			"flag_ni",
			"flag_nl",
			"flag_eu",
			"flag_fi",
			"flag_fj",
			"flag_fk",
			"flag_fm",
			"flag_fo",
			"flag_fr",
			"flag_ga",
			"flag_gb",
			"flag_gd",
			"flag_ge",
			"flag_gf",
			"flag_gg",
			"flag_gh",
			"flag_gi",
			"flag_gl",
			"flag_gm",
			"flag_gn",
			"flag_gp",
			"flag_gq",
			"flag_gr",
			"flag_gs",
			"flag_gt",
			"flag_gu",
			"flag_gw",
			"flag_gy",
			"flag_hk",
			"flag_pg",
			"flag_ph",
			"flag_pk",
			"flag_pl",
			"flag_pm",
			"flag_pn",
			"flag_pr",
			"flag_ps",
			"flag_pt",
			"flag_no",
			"flag_np",
			"flag_nr",
			"flag_nu",
			"flag_nz",
			"flag_om",
			"flag_pa",
			"flag_pe",
			"flag_pf",
		];
		console.log(data.length);

		const promises = data.map(async (item) => {
			const result = await this.db.discord_flag_emojis.findFirst({
				select: {
					id: true,
				},
				where: {
					value: item,
				},
			});

			if (!result) {
				return true;
			}
			return false;
		});
		const vals = await Promise.all(promises);
		const uniques = data.filter((_, i) => vals[i]);
		const res = uniques.map((item) => ({
			value: item,
			id: BigInt(~~(Math.random() * 100000) + 1),
		}));
		console.log(res);

		return await this.db.discord_flag_emojis.createMany({
			data: res,
		});
	}

	private getLanguages(data: Prisma.rest_countries_api_dataGetPayload<true>[]) {
		return data.map((res) => res.languages as Record<string, string> | null);
	}

	private removeDuplicates(languagesJSON: (Record<string, string> | null)[]) {
		const languages: Record<string, string> = {};

		for (const entry of languagesJSON) {
			if (!entry) {
				continue;
			}
			for (const [abbreviation, fullName] of Object.entries(entry)) {
				languages[abbreviation] = fullName;
			}
		}
		delete languages.deu;

		return languages;
	}

	private throwOnDuplicates(languages: any) {
		const res1 = findDuplicates(Object.keys(languages));
		const res2 = findDuplicates(Object.values(languages));
		if (res1.size || res2.size) {
			throw new Error(
				`Duplicates found. ${res1.size} duplicates found in keys, ${
					res2.size
				} duplicates found in values. Results: ${JSON.stringify({ res1, res2 }, null, 4)}`
			);
		}
	}
}

const main = new Main();

const run = async () => {
	await main.createRestCountryNamesTable();
};
void run();
