---
title: "Who Forces Websites to Be Accessible? (Part 2): Eight More Jurisdictions, and the Gray Zone Between 'Organizing' and 'Certifying'"
description: The previous article surveyed 16 jurisdictions and I meant to go straight into a deep comparison of certification marks — but while collecting data on Hong Kong and Qatar, I found that many 'government marks' I'd assumed were official are actually run by private bodies, with the government merely co-organizing. So I widened the map to 24 jurisdictions to finish the institutional groundwork first.
date: 2026-07-17
tags:
  - Accessibility
  - A11Y
  - AccessibilityBadge
draft: false
---

In the previous article, [Who Forces Websites to Be Accessible? A Comparison of Web Accessibility Regimes Across 16 Jurisdictions](/blog/a11y-world-rules/), I promised the next piece would dive straight into comparing certification marks. But the moment I started collecting mark data for Hong Kong and Qatar, I got stuck on a more basic question: who exactly issues these marks?

Take Hong Kong's DARS. I first assumed it was an official certification run by a government body; only after checking did I find that the real organizer is the Hong Kong Internet Registration Corporation (HKIRC, a non-governmental company), with the Digital Policy Office (DPO) merely "co-organizing" and the Equal Opportunities Commission (EOC) only in an "advisory" role. Qatar's Mada is similar — it describes itself as a "private institution for public benefit," not a government agency, yet it issues what is effectively the most complete list of accessibility certifications for Qatari websites.

This gray zone — where the government appears to be involved but the actual issuer is a private body — makes it easy, in a mark-comparison article, to lump together two things of completely different natures unless you first pin down each country's institutional foundation. So this article widens the map by eight more jurisdictions — Hong Kong, Italy, Qatar, Norway, Denmark, Poland, Ireland, and Finland — bringing the groundwork up to 24 jurisdictions, and along the way introduces the "organizer / co-organizer / advisor" distinction I stumbled onto, before moving on to the marks. As before, the information below may contain errors; corrections from experts are very welcome.

### 1. The Same Mechanism Vocabulary, With One Added Caveat

Reusing the six regulatory tools from the previous article: ① mandatory certification, ② self-declaration + government monitoring, ③ procurement / supply-chain leverage, ④ market surveillance + fines, ⑤ anti-discrimination litigation, ⑥ soft law / duty to make efforts.

Among these eight new jurisdictions, five (Italy, Denmark, Poland, Ireland, Finland) continue the previous article's "Group C — EU Dual-Directive Model" formula: the public sector runs on the WAD (② self-declaration + monitoring), the private sector on the EAA (④ market surveillance + fines, formally applicable from 28 June 2025). One (Norway) continues "Group D — Non-EU, Its Own System." The remaining two (Hong Kong, Qatar) are an entirely new type — no dedicated law, standards drawn from policy or private bodies, and marks issued by someone other than the government itself. That is exactly the extra caveat this article adds: **"government co-organized" is not "government certified."** To judge a mark's authority, first work out who the organizer, the co-organizer, and the advisor each are.

### 2. Jurisdiction-by-Jurisdiction Review (Continuing the Earlier Grouping)

#### Group C Extended: EU Dual-Directive Model (Five More)

These five are structurally identical to the previous article's Germany, France, Spain, Portugal, Austria, Belgium, and the Netherlands: the public sector derives from the WAD and runs on ② self-declaration + monitoring; the private sector derives from the EAA and runs on ④ market surveillance + fines, applicable from 28 June 2025. The differences again lie in the bite of the monitoring and the size of the fines — this time with a first look at how enforcement was actually divided up once the EAA took effect.

- Italy. The parent law is Legge 4/2004 (the "Stanca Act"); the WAD was transposed by D.Lgs. 106/2018 and the EAA by D.Lgs. 82/2022, while Article 29 of DL 76/2020 (converted into L. 120/2020) extended the obligation to private entities with annual turnover above €500 million. The standard is UNI CEI EN 301 549 → WCAG 2.1 AA (50 Level A/AA criteria); AgID's formal guidelines of 4 March 2026 (Determinazione n. 38) still lock in 2.1, because the harmonized standard EN 301 549 v3.2.1 has not yet been formally cited for 2.2 at EU level. There is no certification-mark scheme; the output is a self-published accessibility statement (using AgID's official Allegato 1 template, due each year by 23 September). The monitoring split is finer than I expected — on the **services** side AgID is responsible (simplified monitoring runs automated tests each quarter on 31 of the 50 criteria using the CNR-developed MAUVE++, with in-depth monitoring by human sampling), while on the **products** side MIMIT (Ministero delle Imprese e del Made in Italy, renamed from MISE in 2022) handles market surveillance — a products/services dual track the previous article didn't mention. EAA penalties run €5,000–40,000, rising to up to 5% of turnover for entities above €500 million.

- Denmark. The Web Accessibility Act (webtilgængelighedsloven) transposes the WAD — originally LOV nr 692/2018, now the consolidated LOV nr 429/2021. The standard is EN 301 549 v3.2.1. The competent authority, Digitaliseringsstyrelsen (the Agency for Digital Government), only monitors and supervises; it issues no certificate. Its official terms are precisely "simplified monitoring" (forenklet monitorering, automated testing of 15 WCAG 2.1-related requirements) and "in-depth monitoring" (dybdegående monitorering, measured against the full EN 301 549 v3.2.1, with apps assessed by humans only). There are no fines; the mechanism is the "order" (påbud) — in 2024 it issued 231 orders and 76 recommendations, of which 140 concerned statement-format issues, with a public list of unresolved orders. Accessibility statements must be produced with the official WAS-Tool, which private entities are expressly barred from using. Denmark's private-sector EAA transposition details I did not verify in depth this time; noted as to-be-completed.

- Poland. Two laws — the Act of 4 April 2019 on the Digital Accessibility of Websites and Mobile Applications of Public Entities (in force 23 May 2019; amended 9 March 2023 to strengthen accountability and remove the disproportionate-burden exemption list), and the Act of 26 April 2024 transposing the EAA on accessibility requirements for certain products and services (the "Polish Accessibility Act," published in 2024 but actually in force from 28 June 2025). The standard follows the EU WAD / EN 301 549 / WCAG 2.1 AA, with the Ministry of Digital Affairs (Ministerstwo Cyfryzacji) as competent authority. I had previously assumed Poland had no concrete penalties; on checking, it does — under the 2019 law, public entities that repeatedly fail to remediate can be fined up to PLN 10,000 for website/app problems and up to PLN 5,000 for a missing statement (imposed by the minister); under the 2024 EAA law, economic operators can be fined up to 10 times the average wage (roughly PLN 80,000–90,000), capped at 10% of annual turnover — but the imposing body is the president of PFRON (the State Fund for Rehabilitation of Disabled Persons), not the Ministry of Digital Affairs. The public and private sides are enforced by two different agencies.

- Ireland. The European Union (Accessibility of Websites and Mobile Applications of Public Sector Bodies) Regulations 2020 (S.I. No. 358/2020, in force 23 September 2020, transposing the WAD). The Disability Act 2005 is not the parent law but a legal basis cited (alongside the Equal Status Act 2000) when the accessibility statement links to complaint/redress channels. The standard applies the POUR principles mapped to EN 301 549, which the NDA officially states corresponds to WCAG 2.1 AA, with statements using the EU 2018/1523 template. The National Disability Authority (NDA) is the statutory monitoring body under Regulation 8(1), reporting directly to the minister (not to the parent department); Regulation 8(7) expressly states that monitoring reports need not include the list of monitored bodies, so an official list is hard to obtain from outside. I found no official mark or third-party testing-body scheme. On the private side, the European Union (Accessibility Requirements of Products and Services) Regulations 2023 transpose the EAA, likewise in force from 28 June 2025, with enforcement spread across six bodies by product/service category — the CCPC (the market-surveillance authority), ComReg, Coimisiún na Meán, the Irish Aviation Authority, the National Transport Authority, and the Central Bank of Ireland — the NDA being merely advisory here. Penalties are explicit and heavy: on summary conviction, up to a €5,000 fine or 6 months' imprisonment; on conviction on indictment, up to a €60,000 fine or 18 months' imprisonment, with company officers individually liable, and consumers and groups granted a private right of action before the courts — the heaviest private-sector penalties among this batch of new jurisdictions.

- Finland. The Act on the Provision of Digital Services 306/2019 (in force 1 April 2019, transposing the WAD). Per Traficom's supervision pages the standard is EN 301 549 + WCAG 2.1. Beyond the public sector, the scope also covers private-sector digital services that receive over 50% public funding, as well as specific private services such as electronic identification/payment and utilities, transport, and postal services. The EAA transposition law's correct number is the Act on Accessibility Requirements for Certain Products 102/2023, with implementing decree 179/2023, in force from 20 February 2023 and applicable from 28 June 2025 (the "568/2023" often seen online is a wrong number — I note this specifically to stop the error from spreading). The competent authority is now the digital accessibility supervision unit of Traficom (the Finnish Transport and Communications Agency) — but this power was only consolidated and transferred over from the Regional State Administrative Agency for Southern Finland (AVI) on 1 January 2025, a piece of history the previous article missed. There is no official mark scheme; the penalties are not "unclear" either, but a clear last resort — after administrative guidance fails, Traficom can impose a case-by-case uhkasakko (conditional fine) under the Act on Conditional Fines (Uhkasakkolaki), and for the EAA part there are additional, stricter powers such as prohibition orders and mandatory audits.

#### Group D Extended: Non-EU / EEA, Its Own System (One More)

- Norway. Using the Equality and Anti-Discrimination Act (Act No. 51 of 2017) together with the Regulations on Universal Design of ICT to implement the concept of "universell utforming av IKT," the public sector is subject to 48 requirements and the private sector to 35, all as minimum requirements — and both sectors use the same set of rules, rather than splitting into WAD/EAA tracks like the EU. The competent authority is the Authority for Universal Design of ICT (Tilsynet for universell utforming av ikt), under the Norwegian Digitalisation Agency (Digdir). There is no third-party testing-body scheme and no official mark; the authority samples and checks directly (manual + semi-automated + automated). The penalty mechanism is tvangsmulkt (a coercive fine calculated per day) — its legal basis is actually Section 36 of the parent act itself, not §6/§7 of the subordinate rules; the correct process is to first issue a corrective order (pålegg) under §18 (universal-design duty) and §19a (documentation duty) of the rules, and only impose tvangsmulkt under Section 36 of the parent act if remediation misses the deadline — the section numbers in the previous article need correcting. Public-sector website statements have been mandatory on uustatus.no (Digdir's centralized platform) since 1 February 2023, while the deadline for app statements is 1 February 2026 — which, as of today, has only just taken effect. As an EEA member, whether Norway will move toward WAD/EAA alignment is worth watching.

#### Group E (New): Policy-Guided + Private-Mark Model (No Dedicated Law)

This group is the real new discovery this time — there is no dedicated law like Taiwan's Article 52-2 of the People with Disabilities Rights Protection Act that "explicitly requires obtaining a certification mark." Web accessibility obligations come from a general anti-discrimination law or a policy document; and the marks you can find on the market are issued by private or semi-official bodies, not the government itself.

- Hong Kong. There is no dedicated web accessibility law; the legal basis is the Disability Discrimination Ordinance (Cap. 487). The WCAG 2.0 AA requirement for government websites and mobile apps comes from administrative policy, not legislation, and has no binding force on the private sector. The competent authority is the Digital Policy Office (DPO, established 25 July 2024 from the merger of the former Office of the Government Chief Information Officer, OGCIO, and the Efficiency Office), while the EOC enforces the Disability Discrimination Ordinance. What really needs correcting is the organizing structure of the DARS (Digital Accessibility Recognition Scheme — formerly the "Web Accessibility Recognition Scheme," WARS, renamed and broadened by official announcement on 29 December 2023) recognition program: it is not "co-run by DPO and EOC." The official wording is that HKIRC (the Hong Kong Internet Registration Corporation) has been the organizer since 2018, with the DPO / former OGCIO merely co-organizing and the EOC only advising. The grading is also finer than the original data: Bronze (10 assessment criteria) → Silver (17) → Gold (27), with Triple Gold awarded for three consecutive years of Gold, plus a Friendly Website award (4 criteria) and an Elderly-friendly Design Award (13 criteria), and a new Designer Award category added from the 2024-2025 edition. Government sites that fail to meet the policy face no separate statutory penalty; the private sector is not penalized for not joining DARS, but if a person with a disability is denied service because of a website accessibility problem, they can still complain to the EOC or sue for damages under the Disability Discrimination Ordinance — a path that runs on ⑤ anti-discrimination litigation, an entirely separate mechanism from the DARS mark itself.

- Qatar. I had originally assumed Qatar's parent-law status was "not publicly confirmed"; on checking, that description is out of date — the previously applicable Law No. 2 of 2004 on the Rights of Persons with Disabilities was repealed and replaced by Law No. 22 of 2025, signed by the Emir on 5 October 2025 and in force from 19 November 2025. Article 23(2) expressly requires banks and financial institutions to provide accessible digital services, with violations punishable by a QAR 50,000 fine; other violations up to QAR 100,000; and, where a serious case results in death, up to QAR 500,000 and/or up to 5 years' imprisonment, enforced by the Ministry of Social Development and Family (MSDF) — the only case among these eight jurisdictions to newly add statutory penalties in 2025, worth flagging. As for the mark issuer, the Mada Assistive Technology Center Qatar is explicitly a "private institution for public benefit," not a government body; its website-accessibility certification comes in three public lists — Accredited Websites / Mobile Apps / Kiosks & ATMs. Two standard tracks need separating here: Qatar's own government digital services require WCAG 2.0 under the Government Website & e-Services Framework, while Mada's own certification uses WCAG 2.1 — the original data only noted "WCAG 2.1 as the main standard clue," missing the government-policy standard.

### 3. The Public × Private × Mechanism Matrix (Eight New Jurisdictions)

Continuing the previous article's matrix codes: ① mandatory certification, ② self-declaration + monitoring, ③ procurement / supply-chain leverage, ④ market surveillance + fines, ⑤ anti-discrimination litigation, ⑥ soft law / duty to make efforts.

| Jurisdiction | Public-Sector Mechanism | Private-Sector Mechanism |
|---|---|---|
| Hong Kong | ⑥ Policy requirement (not legislated) | ⑥ Voluntary mark (organized by HKIRC) / ⑤ anti-discrimination complaint available case-by-case |
| Qatar | ⑥ Policy requirement (WCAG 2.0) | Private voluntary certification (Mada) + ④ emerging mandatory penalties for finance (2025) |
| Italy | ② AgID monitoring (services) / MIMIT (products) | ④ EAA (€5k–40k; up to 5% of turnover above €500M) |
| Norway | ②④ Single rule set; Tilsynet spot-checks + daily tvangsmulkt | ②④ Same as left (public and private regulated together) |
| Denmark | ② Digitaliseringsstyrelsen monitoring (no fines, orders only) | To be completed (EAA details not verified this time) |
| Poland | ② Ministry of Digital Affairs monitoring (up to PLN 10k) | ④ EAA (imposed by PFRON; up to 10% of annual turnover) |
| Ireland | ② NDA statutory monitoring (no direct fines) | ④⑤ EAA (six-body split; up to 18 months' imprisonment + private right of action) |
| Finland | ② Traficom supervision (since 2025; formerly AVI) | ④ EAA (recurring uhkasakko + prohibition orders) |

### 4. The Biggest Misconception This Time: "Organizing" ≠ "Certifying"

The previous article's Observation 4 noted that "whether there's an official mark ≠ how strong the regime is." After collecting the Hong Kong and Qatar data, I want to add a further layer: **a mark that looks government-backed doesn't mean the government is the issuer.**

On Hong Kong's DARS pages you'll see the DPO's name, making it easy to mistake it for an official, government-run certification; but the actual organizer is HKIRC, with the DPO merely co-organizing and the EOC only advising. Qatar's Mada certification likewise carries a seemingly official domain and brand image, yet its legal status is a "private institution for public benefit." This is a completely different level of authority from Taiwan's Article 52-2 mandatory certification ("government agencies must obtain the certification mark by law"), or Korea's MSIT designating three bodies to issue an official quality mark — not that private marks have no value; the assessment mechanisms and public lists that DARS and Mada have built up are actually quite solid. It's just that, when judging a mark's force, the first step should be to clearly distinguish "who organizes, who co-organizes, and who is merely a named advisor," rather than treating the appearance of a government body's name as a statutory certification. This is also the first field I'll confirm when the next article takes each country's marks apart one by one.

### 5. The First Wave of Market-Surveillance Samples After the EAA Took Effect

28 June 2025 was the formal application date of the EAA's private-sector obligations, and Italy, Poland, Ireland, and Finland — collected this time — happen to be the first batch of jurisdictions with concrete enforcement detail available. The penalty gaps are again enormous: Poland looks to up to 10% of annual turnover; Italy fines enterprises with turnover above €500M up to 5% of turnover; Ireland takes the criminal route (up to 18 months' imprisonment, with company officers individually liable); and Finland uses a case-by-case, uncapped uhkasakko. The same EAA directive, transposed into four completely different "sets of teeth" by four countries — consistent with the gaps observed for Germany, France, Spain, the Netherlands, Austria, and Belgium in the previous article. The EU harmonized only the standard (EN 301 549 → WCAG 2.1 AA), not the intensity of enforcement.

### 6. Updated Observations and Trends

Stacking the eight new jurisdictions onto the previous article's sixteen, three more points can be added:

- **"No dedicated law" does not mean "no pressure."** Neither Hong Kong nor Qatar has a dedicated web accessibility law, yet Hong Kong has the Disability Discrimination Ordinance for suing for damages, and Qatar's 2025 law directly imposes criminal liability and heavy fines on the financial sector — no mark scheme does not mean no legal risk.
- **The nature of the organizer determines the tier of a mark's evidentiary force.** Government mandatory certification (Taiwan, Korea, India) > government policy requirement + private voluntary mark (Hong Kong, Qatar) > pure private voluntary mark (WACA, AENOR, and the like in Germany, Spain, the Netherlands, etc.). All three can look like "official recognition," but their legal force is worlds apart.
- **The EAA took effect on 28 June 2025, and the first enforcement differences have already surfaced.** Poland, Italy, Ireland, and Finland took four different penalty routes, showing that "the same EU directive" will grow into at least four-plus enforcement versions across the twenty-seven member states — a gap likely to keep widening as more countries' enforcement records become public.

### Next Article Preview: Taking Each Mark Apart

This article widened the institutional map to 24 jurisdictions, and in passing produced a method for judging a mark's credibility — first look at who organizes, co-organizes, and advises; then look at the standard version; and finally look at whether there's a publicly searchable list and an expiry date. The next article will finally return to the original plan: laying out DARS, Mada, WACA, AnySurfer, AENOR, Ilunion, Access for all, Drempelvrij, and Selo one by one, comparing whether each is a mandatory gate or a voluntary award, how many tiers it has, whether it has an expiry date, whether a complete list is searchable, and what its design looks like.

### Reference

#### Hong Kong

[Digital Policy Office established today (HKSAR Government press release)](https://www.info.gov.hk/gia/general/202407/25/P2024072400394.htm "Open new window"){target="_blank"}

[Digital Policy Office — About Us](https://www.digitalpolicy.gov.hk/en/about_us/ "Open new window"){target="_blank"}

[HKIRC — Digital Accessibility Recognition Scheme 2024-2025 open for applications (includes organizer / co-organizer / advisor wording)](https://www.hkirc.hk/en/news-insights/press-release/dars/ "Open new window"){target="_blank"}

[HKIRC — Digital Accessibility Recognition Scheme official page](https://www.hkirc.hk/en/public-mission/dars/dars/ "Open new window"){target="_blank"}

[DARS 2024-2025 Guide to Application (PDF, assessment-tier criteria)](https://www.digital-accessibility.hk/wp-content/uploads/2024/01/DARS_Application_Guide-1.pdf "Open new window"){target="_blank"}

#### Qatar

[Mada Digital Accessibility Portal — Accredited Websites](https://ictaccess.mada.org.qa/en/accredited-websites/ "Open new window"){target="_blank"}

[Mada — Policy page (government Framework requires WCAG 2.0)](https://mada.org.qa/policy-advocacy/ "Open new window"){target="_blank"}

[Crowell & Moring — Qatar Enacts Law No. (22) of 2025 on Persons with Disabilities](https://www.crowell.com/en/insights/client-alerts/qatar-enacts-law-no-22-of-2025-on-persons-with-disabilities "Open new window"){target="_blank"}

[MSDF — His Highness the Amir Issues Law No. (22) of 2025 on Persons with Disabilities](https://msdf.gov.qa/en/media-center/news-list/his-highness-amir-issues-law-no-22-2025-persons-disabilities "Open new window"){target="_blank"}

[Qatar National e-Accessibility Policy 2011 (PDF, MCIT)](https://www.mcit.gov.qa/sites/default/files/qatar_eaccessibility_policy_en_v4.pdf "Open new window"){target="_blank"}

#### Italy

[D.Lgs. 82/2022 (EAA transposition)](https://www.gazzettaufficiale.it/eli/id/2022/07/01/22G00089/SG "Open new window"){target="_blank"}

[D.Lgs. 106/2018 (WAD transposition)](https://www.gazzettaufficiale.it/eli/id/2018/09/11/18G00133/sg "Open new window"){target="_blank"}

[AgID Linee Guida accessibilità dei servizi (EAA, March 2026)](https://www.agid.gov.it/sites/agid/files/2026-03/Linee_Guida_accessibilit%C3%A0_dei_servizi_(EAA).pdf "Open new window"){target="_blank"}

[AgID — accessibility-statement template Allegato 1](https://www.agid.gov.it/sites/agid/files/2025-04/Allegato%201%20-%20Modello_di_dichiarazione_accessibilit%C3%A0.pdf "Open new window"){target="_blank"}

[CNR — MAUVE monitoring tool](https://www.cnr.it/it/news/11847/monitoraggio-nazionale-automatico-dell-accessibilita-dei-siti-web-delle-pubbliche-amministrazioni-con-mauve "Open new window"){target="_blank"}

[AgID simplified-monitoring platform](https://monitoraggio.accessibilita.agid.gov.it/monitoraggio-semplificato "Open new window"){target="_blank"}

[MIMIT — product safety and market surveillance](https://www.mimit.gov.it/it/mercato-e-consumatori/sicurezza-prodotti "Open new window"){target="_blank"}

#### Norway

[Likestillings- og diskrimineringsloven (parent act, full text incl. §36)](https://lovdata.no/dokument/NL/lov/2017-06-16-51 "Open new window"){target="_blank"}

[Forskrift om universell utforming av IKT-løsninger](https://lovdata.no/dokument/SF/forskrift/2013-06-21-732 "Open new window"){target="_blank"}

[uutilsynet.no — official supervisory authority](https://www.uutilsynet.no/ "Open new window"){target="_blank"}

[uutilsynet — how a missing statement can lead to a daily fine](https://www.uutilsynet.no/tilgjengelighetserklaering/manglende-tilgjengelighetserklaering-kan-fore-til-dagmulkt/1673 "Open new window"){target="_blank"}

[uustatus.no — central accessibility-statement platform](https://uustatus.no/nb "Open new window"){target="_blank"}

#### Denmark

[Digitaliseringsstyrelsen — in-depth monitoring](https://digst.dk/tilsyn/webtilgaengelighed/monitorering-og-tilsyn/dybdegaaende-monitoreringer/ "Open new window"){target="_blank"}

[Digitaliseringsstyrelsen — simplified monitoring](https://digst.dk/tilsyn/webtilgaengelighed/monitorering-og-tilsyn/forenklede-monitoreringer/ "Open new window"){target="_blank"}

[Digitaliseringsstyrelsen — list of unresolved orders](https://digst.dk/tilsyn/webtilgaengelighed/resultater/udestaaende-paabud/ "Open new window"){target="_blank"}

[LOV nr 429 af 16/03/2021 (current consolidated version)](https://www.retsinformation.dk/eli/lta/2021/429 "Open new window"){target="_blank"}

[WAS-Tool official portal](https://edit.was.digst.dk/da-DK "Open new window"){target="_blank"}

#### Poland

[Ustawa z dnia 4 kwietnia 2019 r. (ISAP)](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20190000848 "Open new window"){target="_blank"}

[Ustawa z dnia 26 kwietnia 2024 r. (Polish Accessibility Act / EAA transposition, ISAP)](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000731 "Open new window"){target="_blank"}

[PFRON — Accessibility Act explainer (EAA imposing authority)](https://www.pfron.org.pl/aktualnosci/szczegoly-aktualnosci/news/ustawa-o-dostepnosci/ "Open new window"){target="_blank"}

[Poland Ministry of Digital Affairs — digital accessibility](https://www.gov.pl/web/cyfryzacja/dostepnosc-cyfrowa "Open new window"){target="_blank"}

#### Ireland

[S.I. No. 358/2020](https://www.irishstatutebook.ie/eli/2020/si/358/made/en/print "Open new window"){target="_blank"}

[NDA — EU Web Accessibility Directive monitoring](https://nda.ie/monitoring/eu-web-accessibility-directive "Open new window"){target="_blank"}

[Mason Hayes & Curran — European Accessibility Act implemented into Irish law](https://www.mhc.ie/latest/insights/european-accessibility-act-implemented-into-irish-law "Open new window"){target="_blank"}

[DLA Piper — Irish accessibility regulations penalty detail](https://www.dlapiper.com/en-us/insights/publications/2025/10/navigating-the-irish-accessibility-regulations "Open new window"){target="_blank"}

#### Finland

[Traficom — supervisory-authority tasks (incl. uhkasakko)](https://www.saavutettavuusvaatimukset.fi/en/tasks-supervisory-authority-0 "Open new window"){target="_blank"}

[Laki digitaalisten palvelujen tarjoamisesta 306/2019](https://www.saavutettavuusvaatimukset.fi/en/requirements-act-provision-digital-services/requirements-act-provision-digital-services "Open new window"){target="_blank"}

[Finlex — 102/2023 (correct EAA Finnish transposition number)](https://finlex.fi/en/legislation/collection/2023/102 "Open new window"){target="_blank"}

[Traficom — new accessibility requirements](https://www.traficom.fi/en/traficom/accessibility/new-accessibility-requirements "Open new window"){target="_blank"}

--

Information compiled as of July 2026; it may contain errors, and corrections are welcome. The next article will take each country's certification marks apart one by one.
