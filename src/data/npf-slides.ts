export type NpfContentSlide = {
	id: string;
	kicker?: string;
	title: string;
	bullets: string[];
	speakerNotes: string;
};

export const npfContentSlides: NpfContentSlide[] = [
	{
		id: "utredning",
		kicker: "Bakgrund",
		title: "Hur jag hamnade här",
		bullets: [
			"Egen utredning för ca 7 månader sedan",
			"Mitt bonusbarn hade problem på fritids",
			"Kände igen mig väldigt mycket från egen ungdom",
		],
		speakerNotes: `Jag gjorde en egen utredning för ca 7 månader sen, då mitt bonusbarn hade problem med vissa saker på fritids som jag kände igen mig väldigt mycket i – hur jag hade varit när jag var ung.

Det var där jag började förstå att det kanske inte bara var "så är vissa barn" – utan att jag sett samma mönster i mig själv.`,
	},
	{
		id: "typer",
		kicker: "ADHD",
		title: "Tre typer – och min diagnos",
		bullets: [
			"Hyperaktiv: inre rastlöshet, pratar mycket, svårt koppla av",
			"Ouppmärksam: svårt fokusera, distraherad av ljud, svårt komma igång",
			"Kombinerad: båda",
			"Medelsvår ADHD – huvudsakligen ouppmärksam form",
			"Öppen med diagnosen – bättre kommunikation framåt",
			"Dopaminbrist: kroppens belöningssystem (träning, Jira, choklad…)",
		],
		speakerNotes: `Det finns vad vi vet tre typer av ADHD: hyperaktiv, ouppmärksam och kombinerad.

Hyperaktiva har ofta en inre rastlöshet, pratar mycket, har svårt att koppla av. Ouppmärksamma har svårt att fokusera på långa möten, blir distraherade av ljud, har svårt att komma igång.

Jag fick diagnosen medelsvår ADHD, huvudsakligen ouppmärksam form.

Jag har valt att vara öppen med det, då jag tror att information om det kan göra att andra kan må bättre och att kommunikationen framåt blir lättare.

Huvudbiten av ADHD är att man har dopaminbrist – kroppens belöningssystem för när man gör något bra. Till exempel tränar, blir klar med en Jira-ticket, äter choklad, och så vidare.`,
	},
	{
		id: "positivt",
		kicker: "Styrkor",
		title: "Det positiva",
		bullets: [
			"Hyperfokus – kan lägga hur mycket tid som helst på det jag brinner för",
			"Flow kommer lätt när saker går bra",
			"Ofta väldigt kreativ",
			"Empati och lyhördhet – läser av rummet och hur folk mår",
			"Ser mönster och helhet som andra missar",
		],
		speakerNotes: `Det positiva med diagnosen: jag kan lätt få hyperfokus.

Jag beskrev mig själv ofta på intervjuer att när jag verkligen brinner för något, då kan jag lägga hur mycket tid som helst på det.

Flow är väldigt lätt att hamna i – när saker går bra blir väldigt mycket gjort på kort tid.

ADHD-personer brukar oftast vara väldigt kreativa.

Empati och lyhördhet – brukar ha en god förmåga att läsa av ett rum, känna hur personer mår.

Kan se mönster och helhet som andra missar.`,
	},
	{
		id: "negativt",
		kicker: "Utmaningar",
		title: "Det negativa (för mig)",
		bullets: [
			"Glömmer möten – hänt att jag hyperfokuserat och missat veckomöte/standup",
			"Tappar saker dagligen – vi ringer varandra för att hitta mobilerna",
			"Svårt komma igång – behöver känna lite flow, inte bara ”sätta sig och jobba”",
			"Långa tråkiga möten – ”det känns som att själen dör”",
			"Distraktionsljud (t.ex. tickande klocka) kan vara väldigt jobbiga",
		],
		speakerNotes: `Det negativa, för mig:

Svårt att komma ihåg saker, speciellt möten. Det har hänt mer än en gång att man sitter och hyperfokuserar på något och sedan helt glömt bort att det är veckomöte, standup, och så vidare.

Kan tappa bort saker – det är nästan dagligen jag och min sambo ringer varandra för att hitta var vi har lagt våra mobiler.

Det kan vara svårt att komma igång – behöver känna lite flow. Jag kan inte bara sätta mig ner och jobba, utan jag måste få in lite känsla.

Möten som tar för lång tid kan bli tråkiga, på den nivån att det känns som att man dör inombords när man har möten som inte är intressanta – "det känns som att själen dör".

Om ni hör en tickande klocka nu: det är med flit. Distraktionsljud som andra knappt registrerar kan för vissa med ADHD/NPF ta enorm fokus – och kännas nästan fysiskt jobbiga. Det är poängen med den här sliden.`,
	},
	{
		id: "fore",
		kicker: "Före diagnos",
		title: "Vad jag gjorde innan jag visste",
		bullets: [
			"KAFFE – helst 3–4 koppar per dag",
			"Musik – techno, metal, för att komma igång",
			"YouTube – glo på något intressant, bli lite glad",
			"Träning – lättare sagt än gjort när det är svårt att komma igång",
		],
		speakerNotes: `Det jag gjorde innan jag visste att jag hade diagnosen:

KAFFE! Helst 3–4 kaffekoppar per dag.

Musik! Techno, metal – så man kommer igång, så man får känsla.

YouTube! Glo på något intressant så man blir lite glad.

Träning, ut och röra på sig. Lättare sagt än gjort när det är svårt att komma igång.`,
	},
	{
		id: "nu",
		kicker: "Med diagnos",
		title: "Nu när jag har diagnos",
		bullets: [
			"Concerta från apoteket – ökar tillgängligheten av dopamin",
			"Slutat med kaffe – dricker koffeinfritt nu",
			"Koffein gör mig trött och rastlös",
			"Träning hjälper utöver medicinen",
		],
		speakerNotes: `Nu när jag har diagnos – statligt knark.

Jag får Concerta av apoteket. Det ökar tillgängligheten av dopamin.

Så nu behöver jag inte längre kaffe – jag dricker nu koffeinfritt, för det visar sig att koffein gör mig trött. Samt det gör mig rastlös.

Träning hjälper utöver detta.`,
	},
	{
		id: "diagnos",
		kicker: "Varför diagnos?",
		title: "Alla har väl lite ADHD?",
		bullets: [
			"Ja – lite drag av autism/ADHD, men diagnos när det blir ett problem",
			"Imposter syndrome – ”de kommer komma på att jag är fake”",
			"Stress av att försöka leva som alla andra",
			"Glömmer räkningar, ladda mobil – risk att bli av med jobbet",
			"Många odiagnoserade blir sjukskrivna, risk för depression",
		],
		speakerNotes: `Varför behöver man då en diagnos? Alla har väl lite ADHD i sig?

Ja, alla har lite drag av autism och ADHD – men det är först när det blir ett problem som man får en diagnos.

Det finns ganska stora konsekvenser om man går utan odiagnostiserad.

Imposter syndrome – väldigt många med ADHD känner imposter syndrome: "vad gör jag här, de kommer komma på att jag är fake snart".

Stress – att försöka leva som alla andra, se hur de klarar av allt annat, varför kan inte jag det?

Man glömmer bort räkningar, glömmer bort ladda mobilen, blir av med jobbet.

Väldigt många som går utan diagnos blir till sist sjukskrivna.

Det kan i många fall leda till depression – och i värsta fall självmord, för man orkar inte leva när något känns fel hela tiden. Det här är allvarligt, inte bara "lite glömsk".`,
	},
	{
		id: "tack",
		kicker: "Avslutning",
		title: "Tack för mig",
		bullets: [
			"Främst för att informera – inte ge er en diagnos",
			"Har ni tankar? Fråga gärna mig privat efteråt",
			"Studier: ca 50 % i tech tror ha någon form av NPF",
			"ADHD, autism, dyslexi, OCD, med mera",
		],
		speakerNotes: `Tack för mig. Det här är främst för att informera – jag är inte ute efter att ge er en diagnos.

Men har ni tankar kring det, fråga gärna mig privat sen så kan jag prata mycket om det.

Det finns studier där man tror att cirka 50 % i tech har någon typ av NPF – alltså ADHD, autism, dyslexi, OCD, och så vidare.

Tack för att ni lyssnade.`,
	},
];

/** Total slides: splash (0) + content slides */
export const npfSlideCount = 1 + npfContentSlides.length;
