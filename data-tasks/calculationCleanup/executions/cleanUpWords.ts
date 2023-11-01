import { PrismaClient } from "@prisma/client";
const input_string = `Bolivarian Republic of Venezuela`;

async function main() {
	const regex = [
		"federation",
		"of",
		"and",
		"democratic",
		"republic",
		"the",
		"people",
		"people's",
		"islands",
		"island",
		"northern",
		"commonwealth",
	];
	const regexPattern = new RegExp(`\\b(${regex.join("|")})\\b`, "gi");
	const cleanedString = input_string
		.replace(",", "") // remove commas
		.replace(regexPattern, "") // main regex
		.replace(`'s`, "") // remove "'s"
		.trim() // trim outer whitespace
		.replace(/ +(?= )/g, ""); // remove extra spaces

	return cleanedString;
}
void main();
