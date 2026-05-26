export type NpfBullet = string | { text: string; subtext?: string };

export type NpfContentSlide = {
	id: string;
	kicker?: string;
	title: string;
	bullets: NpfBullet[];
	callout?: string;
	speakerNotes: string;
};

export const npfContentSlides: NpfContentSlide[] = [
	{
		id: "utredning",
		kicker: "Bakgrund",
		title: "Hur jag hamnade här",
		bullets: [
			"Sambo gjorde privatutredning för 1 år sedan",
			"Mitt bonusbarn hade symptom som jag kände igen mig i",
			"Jag gjorde själv en privatutredning för ca 7 månader sen",
		],
		speakerNotes: `Min sambo gjorde en privatutredning för ungefär ett år sedan.

Mitt bonusbarn hade symptom som jag kände igen mig i – det var där jag började se mönster från min egen barndom.

Jag gjorde själv en privatutredning för ca 7 månader sen. Det var där jag började förstå att det kanske inte bara var "så är vissa barn" – utan att jag sett samma mönster i mig själv.`,
	},
	{
		id: "typer",
		kicker: "ADHD",
		title: "Typer av ADHD",
		bullets: [
			"Hyperaktiv: inre rastlöshet, pratar mycket, svårt koppla av",
			"Ouppmärksam: svårt fokusera, distraherad av ljud, svårt komma igång",
			"Kombinerad: båda",
			"AuDHD: någon av ovanstående ADHD-typer tillsammans med autism",
		],
		speakerNotes: `Det finns vad vi vet tre typer av ADHD: hyperaktiv, ouppmärksam och kombinerad.

Hyperaktiva har ofta en inre rastlöshet, pratar mycket, har svårt att koppla av. Ouppmärksamma har svårt att fokusera på långa möten, blir distraherade av ljud, har svårt att komma igång.

AuDHD betyder att man har någon av ADHD-typerna tillsammans med en autismdiagnos – det är vanligt att ha båda.`,
	},
	{
		id: "myter",
		kicker: "ADHD",
		title: "Myter om ADHD",
		bullets: [
			"Svårt att fokusera – man har svårt att reglera vad man fokuserar på",
			"Är lata – det är bara svårt att komma igång; personer vill inte vara lata",
			"Är något man växer ifrån – man lär sig bara maskera mer",
			"Behöver bättre disciplin – det kommer bara öka ångesten och maskering",
			"Kan inte vara framgångsrika – IKEAs vd hade ADHD och dyslexi",
		],
		speakerNotes: `Några vanliga myter om ADHD – och vad som faktiskt stämmer.

Det handlar inte om att man inte kan fokusera, utan om att reglera vad man fokuserar på.

Personer med ADHD är inte lata – det är svårt att komma igång, men de vill inte vara lata.

Man växer inte ifrån det – man lär sig ofta bara maskera mer.

Bättre disciplin hjälper inte; det ökar bara ångest och maskering.

Och man kan absolut vara framgångsrik – IKEAs vd hade till exempel ADHD och dyslexi.`,
	},
	{
		id: "diagnos",
		kicker: "ADHD",
		title: "Min diagnos",
		bullets: [
			"Medelsvår ADHD – huvudsakligen ouppmärksam form",
			"Öppen med diagnosen – bättre kommunikation framåt",
			"Dopaminbrist: kroppens belöningssystem (träning, Jira, choklad…)",
		],
		speakerNotes: `Jag fick diagnosen medelsvår ADHD, huvudsakligen ouppmärksam form.

Jag har valt att vara öppen med det, då jag tror att information om det kan göra att andra kan må bättre och att kommunikationen framåt blir lättare.

Huvudbiten av ADHD är att man har dopaminbrist – kroppens belöningssystem för när man gör något bra. Till exempel tränar, blir klar med en Jira-ticket, äter choklad, och så vidare.`,
	},
	{
		id: "positivt",
		kicker: "Styrkor",
		title: "Det positiva (för mig)",
		bullets: [
			"Hyperfokus – kan lägga hur mycket tid som helst på det jag brinner för",
			"Flow: kan fortsätta med samma sak när saker går bra, går snabbt",
			"Empati och lyhördhet – läser av rummet och hur folk mår",
			"Ofta väldigt kreativ",
			"Ser mönster och helhet som andra missar",
		],
		speakerNotes: `Det positiva med diagnosen: jag kan lätt få hyperfokus.

Jag beskrev mig själv ofta på intervjuer att när jag verkligen brinner för något, då kan jag lägga hur mycket tid som helst på det.

Flow: kan fortsätta med samma sak när saker går bra – och då går det snabbt.

Empati och lyhördhet – brukar ha en god förmåga att läsa av ett rum, känna hur personer mår.

ADHD-personer brukar oftast vara väldigt kreativa.

Kan se mönster och helhet som andra missar.`,
	},
	{
		id: "negativt",
		kicker: "Utmaningar",
		title: "Det negativa (för mig)",
		bullets: [
			"Glömmer möten – hänt att jag nästan missat veckomöten / standup pga att jag har hyperfokuserat på något",
			"Svårt att hålla koll på var saker är, sambo och jag får ofta ringa varandra för att hitta var vi lagt mobilerna",
			"Svårt komma igång – behöver känna lite flow, inte bara ”sätta sig och jobba”",
			"Långa tråkiga möten – ”det känns som att själen dör”",
			"Distraktionsljud kan vara väldigt jobbiga",
			"Imposter syndrome",
		],
		speakerNotes: `Det negativa, för mig:

Svårt att komma ihåg saker, speciellt möten. Det har hänt mer än en gång att man sitter och hyperfokuserar på något och sedan helt glömt bort att det är veckomöte, standup, och så vidare.

Kan tappa bort saker – det är nästan dagligen min sambo och jag ringer varandra för att hitta var vi har lagt våra mobiler.

Det kan vara svårt att komma igång – behöver känna lite flow. Jag kan inte bara sätta mig ner och jobba, utan jag måste få in lite känsla.

Möten som tar för lång tid kan bli tråkiga, på den nivån att det känns som att man dör inombords när man har möten som inte är intressanta – "det känns som att själen dör".

Distraktionsljud som andra knappt registrerar kan för vissa med ADHD/NPF ta enorm fokus – och kännas nästan fysiskt jobbiga.

Imposter syndrome – väldigt många med ADHD känner imposter syndrome: "vad gör jag här?"`,
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
			"Medicin från apoteket - ökar tillgängligheten av dopamin",
			"Slutat med koffein i kaffet, då det faktiskt gjorde mig trött",
			"Träning hjälper utöver medicinen",
			"Lättare att komma igång",
			"Håller fokus och intresse på möten",
		],
		speakerNotes: `Nu när jag har diagnos – statligt knark.

Jag får medicin av apoteket. Det ökar tillgängligheten av dopamin.

Jag har slutat med koffein i kaffet, då det faktiskt gjorde mig trött.

Träning hjälper utöver detta.

Det är lättare att komma igång med uppgifter – jag behöver inte lika mycket "kick" innan jag sätter igång.

På möten håller jag fokus och intresse bättre när de faktiskt engagerar mig.`,
	},
	{
		id: "diagnos",
		kicker: "Varför diagnos?",
		title: "Alla har väl lite ADHD?",
		bullets: [
			"Ja – lite drag av autism/ADHD, men diagnos när det blir ett problem",
			"Stress av att försöka leva som alla andra",
			"Odiagnostiserad ADHD: upprepade utmattningar, sjukskrivningar, depression och ångest är mycket vanligt",
		],
		speakerNotes: `Varför behöver man då en diagnos? Alla har väl lite ADHD i sig?

Ja, alla har lite drag av autism och ADHD – men det är först när det blir ett problem som man får en diagnos.

Det finns ganska stora konsekvenser om man går utan odiagnostiserad.

Stress – att försöka leva som alla andra, se hur de klarar av allt annat, varför kan inte jag det?

Det är extremt vanligt att vid odiagnostiserad ADHD hamna i upprepade utmattningar, sjukskrivningar, depression. Ångest är mycket vanligt.

Det här är allvarligt, inte bara "lite glömsk".`,
	},
	{
		id: "autism",
		kicker: "Autism",
		title: "Så kan det kännas",
		bullets: [
			"Svårt med oplanerade och plötsliga förändringar — t.ex. möten som dyker upp under dagen",
			"Kan ha svårt att tolka vad personer menar — lyssnar på orden, inte hur de säger dem; leder ofta till kommunikationsmissar",
			"Kan vara svårt att komma igång (likt ADHD), eller att något måste göras i en viss ordning",
		],
		speakerNotes: `Några vanliga utmaningar med autism.

Oplanerade och plötsliga förändringar kan vara väldigt jobbiga — till exempel möten som dyker upp under dagen utan förvarning.

Man kan ha svårt att tolka vad personer egentligen menar. Man lyssnar på vilka ord de säger, inte hur de säger dem — och då uppstår det ofta kommunikationsmissar.

Det kan vara svårt att komma igång med saker, ungefär som med ADHD. Eller så måste något göras i en viss ordning för att det ska fungera.`,
	},
	{
		id: "tack",
		kicker: "Avslutning",
		title: "Tack för mig",
		bullets: [
			"Främst för att informera – inte ge er en diagnos",
			{
				text: "Studier: ca 50 % i tech tros ha NPF, i spelutveckling ca 70 %",
				subtext: "ADHD, autism, dyslexi, OCD, med mera",
			},
			"Anpassningar för NPF hjälper ofta alla – tydligare och mer strukturerat",
		],
		callout: "Fråga mig gärna senare",
		speakerNotes: `Tack för mig. Det här är främst för att informera – jag är inte ute efter att ge er en diagnos.

Det finns studier där man tror att cirka 50 % i tech har någon typ av NPF – alltså ADHD, autism, dyslexi, OCD, och så vidare. I spelutveckling ligger siffran på cirka 70 %.

Arbetsplatser som gör anpassningar för NPF gör det också lättare för personer utan NPF att fungera bättre, när saker blir tydligare och mer strukturerat.

Har ni tankar kring det — fråga mig gärna senare, så kan jag prata mycket om det.

Tack för att ni lyssnade!`,
	},
];

/** Total slides: splash (0) + content slides */
export const npfSlideCount = 1 + npfContentSlides.length;
