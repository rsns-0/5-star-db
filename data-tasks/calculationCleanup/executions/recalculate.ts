import { Prisma, PrismaClient } from "@prisma/client";
import { RatioAlgorithm } from "../../langDataCalculations/ratioAlgorithm";

async function main() {
	const db = new PrismaClient();
	console.log(
		await db.calculation.findMany({
			where: {
				left_country_name: {
					contains: "republic",
					mode: "insensitive",
				},
				right_country_name: {
					contains: "African",
				},
			},
		})
	);
}
