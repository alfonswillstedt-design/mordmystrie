# Mordmysterium — Ramverk v1.0

Den fasta motorn. Allt som genereras utgår härifrån, oavsett tema, antal spelare eller speltid.
Temat är kostymen. Det här är skelettet.

---

## 1. Grundprinciper

Fem lagar som aldrig bryts. Om en genererad produkt bryter mot någon av dem är den underkänd.

**1. Ingen vet lösningen.** Inte värden, inte mördaren. Alla spelare är lika ovetande. Sanningen ligger i bevisen och avslöjas först i sista kuvertet. Det betyder att ingen behöver ljuga i roll — man spelar en person med hemligheter, inte en person som vet att den är skyldig.

**2. Lösningen ska gå att räkna ut, aldrig gissas.** En uppmärksam grupp ska kunna peka ut rätt person med motivering. En ouppmärksam grupp ska gissa fel. Skillnaden mellan dem ska vara resonemang, inte tur.

**3. Varje spelare har något att dölja.** Om bara en person beter sig undvikande är den skyldig uppenbar. Alla sex har en hemlighet de ogärna erkänner — bara en av dem är mord.

**4. Struktur före improvisation.** Spelet drivs av numrerade kuvert och tydliga instruktioner, inte av spelarnas förmåga att hitta på. En blyg grupp ska kunna spela lika bra som en högljudd.

**5. Det övernaturliga är alltid inramning, aldrig förklaring.** Legenden, förbannelsen, seansen — allt skapar stämning. Mördaren är alltid en människa med ett begripligt motiv.

---

## 2. Spelets arkitektur

Standardlängd 120 minuter. Skalas proportionerligt vid 90 eller 150.

| Fas | Tid | Vad som händer |
|---|---|---|
| **Prolog** | 15 min | Värden läser upp öppningstexten. Alla läser sitt eget karaktärshäfte. Presentationsrunda i roll. |
| **Runda 1 — Bakgrunden** | 25 min | Kuvert 1 öppnas. Motiv etableras. Alla har skäl att vilja offret död. |
| **Runda 2 — Sprickan** | 30 min | Kuvert 2 öppnas. Tidslinjen klarnar. Ett alibi brister. Två spelare får privata avslöjanden. |
| **Runda 3 — Beviset** | 30 min | Kuvert 3 öppnas. Fysiska bevis. Två falska spår motbevisas aktivt. |
| **Domen** | 20 min | Anklagelser. Alla röstar skriftligt med motivering. Kuvert 4 öppnas: lösningen. |

**Kuvertens roll.** Varje kuvert innehåller (a) en text som läses högt, (b) ledtrådskort som delas ut, (c) i förekommande fall privata lappar märkta med karaktärsnamn. Kuverten är förseglade och numrerade. Instruktionen på framsidan säger exakt när det öppnas.

**Rundornas inre rytm.** Varje runda: läs kuvertet högt (3 min) → fri utfrågning (majoriteten av tiden) → kort sammanfattning där varje spelare säger vem de misstänker just nu (5 min). Den sista biten är viktig — den tvingar fram resonemang och gör att tysta spelare deltar.

---

## 3. Karaktärsarkitektur

Karaktärer definieras som **funktioner**, inte som personer. Temat fyller i namn, yrke och miljö.

### Offret
Spelas inte. Dör innan spelet börjar. Måste ha en dokumenterad konflikt med varenda spelare — det är motorn i hela intrigen. Offrets personlighet bör vara sådan att man förstår varför sex personer ville se hen borta, utan att hen blir en karikatyr.

### De sex kärnkaraktärerna

**F1 — Den skyldige.** Bevisen konvergerar hit. Spelaren vet inte om det. Häftet är skrivet så att personen framstår som misstänkt men inte mer än de andra. Deras hemlighet är den enda som direkt rör mordet — men den är formulerad så att spelaren själv inte inser vidden av den.

**F2 — Det starka falska spåret.** Ser mest skyldig ut i runda 1 och 2. Motbevisas definitivt i runda 3. Deras hemlighet är allvarlig men orelaterad (stöld, utpressning, dold identitet).

**F3 — Det andra falska spåret.** Blir misstänkt i runda 2 när något om deras förflutna framkommer. Motbevisas i runda 3.

**F4 — Hemlighetsbäraren.** Vägrar svara på vissa frågor, vilket ser skyldigt ut. Hemligheten är personlig och skamfylld men helt orelaterad till mordet (en affär, en skuld, ett svek).

**F5 — Vittnet.** Såg eller hörde något utan att förstå betydelsen. Deras häfte innehåller detaljen, men formulerad som en bagatell. Om gruppen frågar rätt person rätt sak faller en avgörande bit på plats.

**F6 — Insidern.** Känner platsen och offret bäst. Fungerar som gruppens informationskälla om miljön och historien. Har ett eget motiv men den svagaste kopplingen till gärningen.

### De två valfria (för 8 spelare)

**V1 och V2.** Fullständiga häften, lika detaljerade som kärnkaraktärerna — spelarna ska inte känna sig som statister. De har motiv och hemligheter.

**Absolut regel:** valfria karaktärer får tillföra *motiv* men aldrig *medel* eller *tillfälle*. De kan inte ha utfört mordet, och deras existens får aldrig ändra vilken slutsats bevisen pekar mot. Testet: om man tar bort dem helt ska lösningen fortfarande hålla ihop perfekt.

---

## 4. Relationsväven

Ett fast mönster som bara döps om per tema.

**Till offret:** varje karaktär har exakt en stark bindning. Fördela över: pengar, blod, kärlek, förräderi, arbete, hämnd. Ingen dubblering — sex karaktärer, sex olika typer av band.

**Mellan spelarna:** varje karaktär har en **allians** och en **konflikt** med två andra. Arrangeras som en ring så att ingen står isolerad, och så att varje spelare har minst två personer de omedelbart vill prata med.

**Kunskapsasymmetri:** varje karaktär vet en sak om en *annan* karaktär som den personen inte vet att de vet. Det här är vad som får utfrågningen att leva — spelare kan sätta press på varandra utan att värden behöver mata dem med frågor.

---

## 5. Lösningens logik

Lösningen vilar på tre pelare. Varje runda sållar på en axel.

| Runda | Axel | Effekt |
|---|---|---|
| 1 | **Motiv** | Alla sex har ett. Ingen elimineras. |
| 2 | **Tillfälle** | Tidslinjen utesluter två. |
| 3 | **Medel** | Fysiska bevis utesluter ytterligare två. |

Kvar står två — den skyldige och en till. Den sista distinktionen görs av **en detalj som kräver att två oberoende ledtrådar kombineras**, ofta en från ett ledtrådskort och en från en spelares häfte. Det är den punkten som skiljer en grupp som resonerar från en som gissar.

**Redundanskravet:** den skyldige ska kunna identifieras via minst tre oberoende resonemangskedjor. Om en grupp missar en ledtråd helt ska de fortfarande kunna lösa fallet. Ingen enskild ledtråd får vara ensamt avgörande.

---

## 6. Ledtrådssystemet

**22 ledtrådar totalt.** Samma uppsättning oavsett om spelet körs med sex eller åtta spelare — de valfria karaktärerna påverkar inte bevismängden, bara antalet häften.

| Runda | Antal | Typer |
|---|---|---|
| 1 | 7 | Brottsplatsbeskrivning, offrets bakgrund, dokument som etablerar motiv, föremål |
| 2 | 8 | Tidslinje, vittnesmål, dokument som spricker ett alibi, fotografiskt bevis |
| 3 | 7 | Rättsteknisk detalj, det avgörande fysiska beviset, motbevis mot falska spår |
| Privata | 2 | Lappar till specifika spelare som öppnas i runda 2 |

**Ledtrådstyper att variera mellan** (temat avgör den konkreta formen): brev, kvitto, dagbokssida, tidningsurklipp, fotografi med beskrivning, telefonlista, testamente, kalendersida, kvitto, receptbok, loggbok, biljett, karta.

**Regler för formulering:**
- En ledtråd får aldrig kräva kunskap spelarna inte har fått i materialet
- En ledtråd får aldrig peka direkt ut någon — den ska begränsa, inte avslöja
- Varje ledtråd ska vara begriplig fristående, utan att man minns exakt vad som stod i föregående runda
- Minst fyra ledtrådar ska vara rena vilseledningar som *ser* betydelsefulla ut men inte är det
- Alla tidsangivelser måste vara internt konsekventa — bygg en fullständig tidslinje för samtliga karaktärer innan ledtrådarna skrivs

---

## 7. Skalning

**6 spelare:** kärnbesättningen F1–F6.

**8 spelare:** F1–F6 plus V1–V2. Speltiden ökar med cirka 20 minuter.

**Bevismängden är densamma i båda fallen.** De valfria karaktärerna kan förekomma i bevismaterialet som närvarande gäster även när de inte spelas — det som aldrig får hända är att lösningen kräver att någon *spelar* dem. Kontrollen är: kan fallet lösas om deras häften aldrig delas ut?

**Vid framtida 12-spelarversion:** kärnan förblir sex. Ytterligare valfria karaktärer läggs till enligt samma regel — motiv men aldrig medel eller tillfälle. Utöver det tillkommer dokumenttyper: gruppindelning för utfrågning, extra röstkort, utökad tidslinje.

---

## 8. Rättvisegarantier

Checklista som körs innan något levereras. Varje punkt måste kunna besvaras med ja.

- [ ] Kan den skyldige identifieras genom minst tre oberoende resonemangskedjor?
- [ ] Motbevisas båda de falska spåren aktivt i runda 3?
- [ ] Har varje spelare minst en hemlighet som gör dem undvikande?
- [ ] Är tidslinjen internt konsekvent för samtliga karaktärer?
- [ ] Finns det någon ledtråd som ensam avgör fallet? (Ska vara nej.)
- [ ] Kan spelet lösas utan kunskap som inte finns i materialet?
- [ ] Håller lösningen om de valfria karaktärerna tas bort?
- [ ] Har varje spelare minst tre meningsfulla saker att göra i varje runda?
- [ ] Är det övernaturliga enbart inramning?
- [ ] Är slutförklaringen begriplig för någon som gissade fel?

---

## 9. Temalagret

Det här byts ut per produkt. Allt ovanför förblir intakt.

| Variabel | Vad den styr |
|---|---|
| **Tema** | Övergripande värld och estetik |
| **Miljö** | Platsen. Måste motivera varför ingen kan lämna eller tillkalla hjälp |
| **Tidsperiod** | Språkbruk, teknologi, sociala konventioner |
| **Offret** | Identitet, yrke, varför alla ogillade hen |
| **Dödsorsak** | Bestämmer vilka fysiska bevis som är möjliga |
| **Atmosfärisk inramning** | Legenden, förbannelsen, det olösta försvinnandet |
| **Mörkerhalt** | Ton, våldsnivå, hur obehagligt det får bli |
| **Svårighetsgrad** | Hur många steg mellan ledtråd och slutsats |

**Isoleringskravet.** Varje miljö måste ge en trovärdig anledning till att gruppen är instängd och att ingen utomstående kan vara gärningsman. Snöstorm, ö, avstängd väg, bruten telefonlinje, ett hus utan täckning. Utan isolering faller hela premissen.

---

## 10. Dokumentpaketet

Varje produkt levereras med:

1. **Värdguide** — förberedelser, utskriftslista, tidsplan, vad som läses när, felsökning
2. **Karaktärshäften** — ett per spelare (2 sidor): offentlig identitet, privat bakgrund, hemlighet, relationer, vad man vet, tidsstyrda avslöjanden
3. **Ledtrådskort** — 22 stycken, formaterade för utklippning, var och en med sitt rundnummer i hörnet
4. **Kuvertetiketter** — numrerade, med instruktion om när de öppnas
5. **Namnbrickor** — vikbara bordsskyltar
6. **Röstkort** — ett per spelare: vem, varför, hur
7. **Lösningsblad** — hela upplösningen plus en genomgång av resonemanget
8. **Inbjudan** — redigerbar, skickas till gästerna i förväg

**Lösningsbladet måste vara en helt egen fil.** Det får aldrig ligga i samma dokument som värdguiden, eftersom värden instrueras att läsa guiden i förväg. Guiden ska uttryckligen säga att lösningen inte får läsas och att den viks oläst ner i sista kuvertet.

**Format:** US Letter och A4. Varje dokument i två varianter — full färg och bläcksnål.

---

## 10b. Regler för karaktärshäften

Utöver innehållet gäller tre konstruktionsregler som kommer ur testning:

**Rundinstruktioner måste peka på rätt runda.** Om ett häfte säger "erkänn i runda tre" måste kortet som utlöser erkännandet ligga i runda tre. Kontrollera varje instruktion mot kortets faktiska placering.

**Den skyldige måste instrueras att stå fast.** Den karaktär som bevisen fäller kommer att upptäcka sin egen motsägelse när beviset kommer fram. Utan instruktion backar spelaren och kedjan kollapsar. Häftet ska säga vad som får medges och vad som aldrig får medges.

**Ingen får bli klar för tidigt.** En karaktär som frias efter halva speltiden har fyrtio minuter utan insats. Var och en som frias tidigt ska få en ny uppgift i sista rundan — något de vet, något de såg, något de måste övertyga de andra om.

**Ledtrådar som ligger i häften måste ha en instruktion.** En detalj som en spelare "inte tänkte på" kommer aldrig fram av sig själv. Om motivkedjan behöver den, ska häftet säga när den ska sägas.

---

## 11. Tonguide

**Grundton:** Behärskad och atmosfärisk. Spänningen kommer från vad som antyds, inte från vad som beskrivs. Ingen splatter, inget kroppsligt äckel. En blodfläck på ett golv är läskigare än en kroppsbeskrivning.

**Språk:** Naturlig, samtida engelska. Inga svulstiga arkaismer om inte tidsperioden kräver det. Korta meningar i spända partier.

**Karaktärshäften skrivs i andra person** — "You arrived at the house on Thursday evening" — vilket drar in spelaren direkt.

**Mörkerhalt 1–5:**

1. Lekfullt. Ingen verklig fara, komiska motiv.
2. Lätt spänning. Allvarligt men tryggt.
3. Genuint spännande. Standardläge.
4. Mörkt. Verklig hotkänsla, obehagliga motiv.
5. Otäckt. Psykologiskt obehag, ingen tröst i slutet.

**Gäller alltid, oavsett nivå:** ingen sexualiserat våld, inga barn som offer, ingen detaljerad grymhet. Läskigt genom antydan.

---

## 12. Kvalitetskontroll före leverans

1. Bygg fullständig tidslinje för samtliga karaktärer — timme för timme
2. Kontrollera varje ledtråd mot tidslinjen
3. Spela igenom lösningen baklänges: håller varje steg?
4. Läs varje karaktärshäfte som om du vore den spelaren — har du något att göra?
5. Kör rättvisegarantierna i avsnitt 8
6. Kontrollera att inget häfte råkar avslöja lösningen
