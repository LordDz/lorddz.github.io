export type Region = "eu" | "us";
export type Mission = { number: string; name: string; eu: string; us: string };
export type Campaign = {
	id: string;
	title: string;
	subtitle: string;
	available: boolean;
};

export const wingsOfLiberty: Mission[] = [
	["1", "Liberation Day", "204282", "294558"],
	["2", "The Outlaws", "204281", "294559"],
	["3", "Zero Hour", "204283", "294560"],
	["4", "Smash and Grab", "203465", "294561"],
	["5", "The Evacuation", "204478", "294562"],
	["6", "Outbreak", "204479", "294563"],
	["7", "The Great Train Robbery", "204498", "294564"],
	["8", "Cutthroat", "204502", "294565"],
	["9", "The Devil’s Playground", "204716", "294566"],
	["10", "The Dig", "204717", "294567"],
	["11", "Whispers of Doom", "204718", "294568"],
	["12", "A Sinister Turn", "204719", "294569"],
	["13", "Echoes of the Future", "204720", "294570"],
	["14", "In Utter Darkness", "204721", "294571"],
	["15", "The Moebius Factor", "204722", "294694"],
	["16", "Welcome to the Jungle", "204723", "294695"],
	["17A", "Breakout", "204724", "294696"],
	["17B", "Ghost of a Chance", "204726", "294697"],
	["18A", "Safe Haven", "204727", "294698"],
	["18B", "Haven’s Fall", "204737", "294699"],
	["19", "Supernova", "204728", "294707"],
	["20", "Maw of the Void", "204729", "294709"],
	["21", "Engine of Destruction", "204730", "294849"],
	["22", "Media Blitz", "204731", "294850"],
	["23S", "Piercing the Shroud", "204733", "294851"],
	["24", "Gates of Hell", "204734", "294852"],
	["25A", "Belly of the Beast", "204735", "294854"],
	["25B", "Shatter the Sky", "204738", "294855"],
	["26", "All In", "204739", "294856"],
	["27", "Reset Progress", "221538", "314694"],
].map(([number, name, eu, us]) => ({ number, name, eu, us }));

export const campaigns: Campaign[] = [
	{
		id: "wol",
		title: "Wings of Liberty",
		subtitle: "30 campaign Arcade maps",
		available: true,
	},
	{
		id: "hots",
		title: "Heart of the Swarm",
		subtitle: "Campaign maps coming soon",
		available: false,
	},
	{
		id: "lotv",
		title: "Legacy of the Void",
		subtitle: "Campaign maps coming soon",
		available: false,
	},
	{
		id: "nova",
		title: "Nova Covert Ops",
		subtitle: "Mission pack coming soon",
		available: false,
	},
];
