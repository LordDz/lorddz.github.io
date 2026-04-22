export type ModProjectEmbed = "coop-economy" | "goh-mi-merge";

export type ModProject = {
	id: string;
	title: string;
	summary: string;
	image: string;
	youtubeUrl?: string;
	steamWorkshopUrl?: string;
	steamStoreUrl?: string;
	/** In-card demo instead of external links only */
	embed?: ModProjectEmbed;
};

export type PortfolioGame = {
	id: string;
	title: string;
	engine: string;
	tagline: string;
	accent: string;
	projects: ModProject[];
};

/** Card art from `public/portfolio/` (extracted from legacy `origin/gh-pages` CRA assets). */
const portfolioImg = (file: string) =>
	`${import.meta.env.BASE_URL}portfolio/${file}`;

export const portfolioGames: PortfolioGame[] = [
	{
		id: "goh",
		title: "Call to Arms: Gates of Hell — Ostfront",
		engine: "Call to Arms / GEM lineage",
		tagline: "Workshop campaigns, conversions, and multiplayer modes",
		accent: "from-[#3a2a22] to-[#6a4a38]",
		projects: [
			{
				id: "goh-indomitus-am",
				title: "Indomitus — Astra Militarum Campaign (beta)",
				summary:
					"Campaign mission for the Indomitus mod: investigate a silent manufactorum city, scripted objectives, difficulty tweaks, and AI-voiced dialogue for playtesting.",
				image: portfolioImg("goh_indomitus.jpg"),
				steamWorkshopUrl:
					"https://steamcommunity.com/sharedfiles/filedetails/?id=3636458259",
			},
			{
				id: "goh-german-soviet",
				title: "German Campaign — Soviet Perspective",
				summary:
					"All pre-DLC German campaign missions replayed from the Soviet side, with tuned inventories, co-op support, and autosave / trigger fixes across the set.",
				image: portfolioImg("goh_soviets.jpg"),
				steamWorkshopUrl:
					"https://steamcommunity.com/sharedfiles/filedetails/?id=3559493014",
			},
			{
				id: "goh-ffa-domination",
				title: "FFA — Domination & Battle Zones",
				summary:
					"Multiplayer maps for free-for-all domination and battle zones—1v1v1v1 or 2v2v2v2 layouts, per-map rules so other modes stay vanilla when the mod is on.",
				image: portfolioImg("goh_ffa.jpg"),
				steamWorkshopUrl:
					"https://steamcommunity.com/sharedfiles/filedetails/?id=3483216664",
			},
			{
				id: "goh-mi-merge-tool",
				title: "Mission (.mi) merge",
				summary:
					"Browser-side helper for Gates of Hell / Men of War style missions: patch vars, triggers, and entities from a reference .mi into a target map, with collision-safe entity id remaps.",
				image: portfolioImg("goh_mission_merge.jpg"),
				embed: "goh-mi-merge",
			},
		],
	},
	{
		id: "sc2",
		title: "StarCraft II",
		engine: "Blizzard Galaxy",
		tagline: "Cooperative RTS campaign work",
		accent: "from-[#0d3b4a] to-[#1a6b7c]",
		projects: [
			{
				id: "sc2-coop-wol",
				title: "Co-op Wings of Liberty",
				summary:
					"Three-player cooperative port of the Wings of Liberty campaign: shared progression, mercenaries, and research that carries between missions.",
				image: portfolioImg("sc2-coop.jpg"),
				youtubeUrl:
					"https://www.youtube.com/results?search_query=LordDz+starcraft+2+cooperative",
			},
			{
				id: "sc2-coop-hots",
				title: "Co-op Heart of the Swarm",
				summary:
					"Cooperative take on the Zerg campaign arc: Kerrigan’s evolution, brood management, and swarm-scale set-pieces rebuilt for multiple commanders.",
				image: portfolioImg("sc2-coop.jpg"),
				youtubeUrl:
					"https://www.youtube.com/results?search_query=LordDz+starcraft+2+heart+of+the+swarm+coop",
			},
			{
				id: "sc2-coop-lotv",
				title: "Co-op Legacy of the Void",
				summary:
					"Shared Protoss campaign missions: Spear of Adun powers, allied armies, and endgame escalation tuned for two or three players.",
				image: portfolioImg("sc2-coop.jpg"),
				youtubeUrl:
					"https://www.youtube.com/results?search_query=LordDz+starcraft+2+legacy+of+the+void+coop",
			},
			{
				id: "sc2-coop-nova",
				title: "Co-op Nova Covert Ops",
				summary:
					"Covert-ops missions as a co-op arc: stealth beats, gadget loadouts, and tactical objectives split across a fireteam of players.",
				image: portfolioImg("sc2-coop.jpg"),
				youtubeUrl:
					"https://www.youtube.com/results?search_query=LordDz+starcraft+2+nova+covert+ops+coop",
			},
		],
	},
	{
		id: "jb3",
		title: "Jabroni Brawl: Episode 3",
		engine: "Source",
		tagline: "Free multiplayer Source game — mapper credits",
		accent: "from-[#5a1518] to-[#9a2828]",
		projects: [
			{
				id: "jb3-maps",
				title: "Multiplayer maps",
				summary:
					"Original and ported levels for Team Jabroni’s free Steam release: jb_minigames, jb_miniroyale, jb_deathcarts, jb_coast03 (ported), jb_coast10 (ported).",
				image: `${import.meta.env.BASE_URL}jb3-credits.png`,
				steamStoreUrl:
					"https://store.steampowered.com/app/869480/Jabroni_Brawl_Episode_3/",
			},
		],
	},
	{
		id: "mow",
		title: "Men of War: Assault Squad 2",
		engine: "GEM Engine",
		tagline: "Pacific theatre scenarios",
		accent: "from-[#2a4a2f] to-[#4a7a52]",
		projects: [
			{
				id: "mow-pacific",
				title: "Pacific Island",
				summary:
					"American and Japanese factions across Guadalcanal: beach landings, defensive holds, and night stealth objectives scripted for co-op.",
				image: portfolioImg("mow-pacific.jpg"),
				youtubeUrl: "https://youtu.be/O7w376qiQX4?si=blAmeBkXzKLUhw3k",
			},
		],
	},
	{
		id: "blackmesa",
		title: "Black Mesa",
		engine: "Source",
		tagline: "Spy FPS episodes",
		accent: "from-[#3a2a4a] to-[#6a4a8a]",
		projects: [
			{
				id: "bm-spy1",
				title: "A Spy in A Madman’s Way",
				summary:
					"Fast Black Mesa episode with VO, custom combat beats, and a tone inspired by NOLF2 and Half-Life.",
				image: portfolioImg("bm-spy1.jpg"),
				youtubeUrl: "https://www.youtube.com/watch?v=GpIisyPb2Ls",
			},
			{
				id: "bm-spy2",
				title: "A Spy on His Way Home",
				summary:
					"Follow-up escape through a facility under siege—more set-pieces, music, and scripted chaos.",
				image: portfolioImg("bm-spy2.jpg"),
				youtubeUrl: "https://www.youtube.com/watch?v=IWPudWPngCk",
			},
		],
	},
	{
		id: "aoe2de",
		title: "Age of Empires II: Definitive Edition",
		engine: "Genie",
		tagline: "Workshop random maps and silly scenarios",
		accent: "from-[#3d2e12] to-[#7a5a1e]",
		projects: [
			{
				id: "aoe2-sheep-nothing",
				title: "SHEEP NOTHING",
				summary:
					"A random map in the spirit of Forest Nothing and friends: light cover, a sea of sheep, and relics to fight over—built for humans; the AI does not grasp elite herding strategy.",
				image: portfolioImg("aoe2-sheep-nothing.jpg"),
				steamWorkshopUrl:
					"https://steamcommunity.com/sharedfiles/filedetails/?id=1480672505",
			},
		],
	},
	{
		id: "mapLabs",
		title: "Map Labs [Source Engine]",
		engine: "Source",
		tagline: "Workshop maps",
		accent: "from-[#1a2618] to-[#355a30]",
		projects: [
			{
				id: "maplabs-11",
				title: "Map Labs #11: Abridged",
				summary:
					"Entry for the Map Labs Abridged contest: the first four Swamp Fever maps compressed and reworked with a twist, plus a custom finale.",
				image: portfolioImg("map_labs_abridged.jpg"),
				steamWorkshopUrl:
					"https://steamcommunity.com/sharedfiles/filedetails/?id=2317926326",
			},
			{
				id: "maplabs-test-tube-something",
				title: "Gotta find the map..",
				summary:
					"I can't remember the name of this map.. Will have to look for it.",
				image: portfolioImg("maplabs_2_halloween_horror.png"),
			},
			{
				id: "maplabs-test-tube-10",
				title: "Map Labs Test tube #10: The Wrap-Up!",
				summary:
					"For The Wrap-Up!, we asked creators go back and finish old maps, make new maps based on themes they missed, or just remake/remaster a map from their Map Labs past.",
				image: portfolioImg("maplabs_2_halloween_horror.png"),
				youtubeUrl: "https://youtu.be/GsZxmOE-_OM?t=3862",
				steamWorkshopUrl:
					"https://www.moddb.com/mods/map-labs/downloads/test-tube-10-the-wrap-up",
			},
			{
				id: "maplabs-6-halloween-horror",
				title: "Map Labs #6: Halloween Horror 2: The Darkness",
				summary:
					"A mapping challenge where entrants were to make scary maps that utilized the darkness in some form.",
				image: portfolioImg("maplabs_2_halloween_horror.png"),
				youtubeUrl: "https://youtu.be/UG7ygRrWrbQ?t=3403",
				steamWorkshopUrl:
					"https://www.moddb.com/mods/map-labs/downloads/map-lab-6-halloween-horror-2-the-darkness",
			},
			{
				id: "maplabs-atom-1-blade",
				title: "Map Labs Atom #1: Blade",
				summary:
					"24 Hour mapping challenge where entrants were to make a map based on the word Blade.",
				image: portfolioImg("map_labs_atom_1_blade.jpg"),
				steamWorkshopUrl:
					"https://www.moddb.com/mods/map-labs/downloads/atom-1-blade",
			},
			{
				id: "maplabs-test-tube-3",
				title: "Map Labs Test tube #3: Abstraction",
				summary:
					"A mapping challenge where entrants were required to make a map making use of abstract themes and concepts.",
				image: portfolioImg("maplabs_test_tube_3_abstraction.png"),
				steamWorkshopUrl:
					"https://www.moddb.com/mods/map-labs/downloads/test-tube-3-abstraction",
			},
			{
				id: "maplabs-test-tube-1",
				title: "Map Labs Test tube #1: Room in my head",
				summary:
					"Entry for the Map Labs Test tube #1: Room in my head contest: a single-player map with a focus on exploration and atmosphere.",
				image: portfolioImg("maplabs_mom_and_dad.jpg"),
				steamWorkshopUrl:
					"https://www.moddb.com/mods/map-labs/downloads/oneroom",
			},
			{
				id: "maplabs-1",
				title: "Map Labs #1: Halloween Horror",
				summary:
					"The first-ever Map Labs competition that was run from 6th Oct thru 27th Oct. Entrants were to use horror and Halloween themes.",
				image: portfolioImg("maplabs_1_halloween_horror.png"),
				youtubeUrl: "https://www.youtube.com/watch?v=OZtB0Hu1Pqs",
				steamWorkshopUrl:
					"https://www.moddb.com/mods/map-labs/downloads/halloween-horror",
			},
		],
	},
	{
		id: "unity-jams",
		title: "Unity game jams",
		engine: "Unity",
		tagline: "Small-team prototypes",
		accent: "from-[#4a3a2a] to-[#8a6a3a]",
		projects: [
			{
				id: "jam-super-evil",
				title: "Super Evil Corps",
				summary:
					"Castle Game Jam 2018: deliver the boss’s lunch through traps as clone employee #1—coding plus two levels.",
				image: portfolioImg("legacy-placeholder.jpg"),
			},
			{
				id: "jam-tortoise",
				title: "Tortoise Island",
				summary:
					"A kid and a tortoise on a quiet island—most of the coding and some environment detailing.",
				image: portfolioImg("jam-tortoise.jpg"),
			},
		],
	},
];

export const currentGamePitch = {
	title: "Next project (WIP)",
	body: "A new build-focused RTS experiment—design docs, blockout maps, and tooling are in progress. Swap the carousel to older titles for shipped work.",
};
