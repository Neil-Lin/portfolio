---
title: Who Forces Websites to Be Accessible? A Comparison of Web Accessibility Regimes Across 16 Jurisdictions
description:  What started as a simple effort to collect each country’s marks, regulations, and testing criteria turned into something bigger — halfway through, I realized I first needed to understand each country’s policy.
date: 2026-06-09
tags:
  - Accessibility
  - A11Y
  - AccessibilityBadge
draft: false
---

I’ve recently been working on adding a “certification mark” feature to my Accesserty Signal extension (a Google Chrome extension that flags, right in Google/Bing search results, which websites carry an accessibility mark, an accessibility statement, or a Lighthouse score). What started as a simple effort to collect each country’s marks, regulations, and testing criteria turned into something bigger: halfway through, I realized I first needed to understand each country’s policy. So I began compiling it by hand — but with so many countries and so much detail, I had to enlist AI to help organize and analyze it, and I’m sharing the result here.

The information below may contain errors; corrections from experts are very welcome. The next article will analyze each country’s certification marks.

For that reason, this article lays the institutional groundwork first. It surveys the web accessibility regimes of 16 jurisdictions: Taiwan, the United States, the United Kingdom, Australia, South Korea, Japan, and India, plus — within the EU framework — Germany, France, Spain, Portugal, Austria, Belgium, and the Netherlands, as well as non-EU Switzerland.

The focus is not on “which version of WCAG” (the technical standard has converged almost universally on WCAG 2.1/2.2 AA), but on a more fundamental question: what force actually makes a website become accessible? Is it the government issuing a certificate, sending inspectors to audit periodically, levying a fine — or waiting for a person with a disability to sue? The answers differ far more than you might expect.

### 1. The Framework: Separate Public from Private First, Then Look at the Tool

The most common mistake in comparing countries is treating each one as a single “cell.” In reality, almost every jurisdiction governs the public sector and the private sector with two different laws, two different enforcers, and two different consequences:

- The EU uses two separate directives — the WAD (public sector) and the EAA (private sector).
- Germany’s public sector (BITV) carries no penalty, yet its private sector (BFSG) can be fined up to €100,000.
- Taiwan legally requires government sites to obtain a mark, but imposes virtually nothing on the private sector.

This article therefore uses a two-axis analysis: first separate “public vs. private,” then use a shared vocabulary of mechanisms to locate where each jurisdiction falls.

#### Six Regulatory Tools (the Mechanism Vocabulary)

① Mandatory certification (gates ex ante) — Government or designated bodies test and certify; the law requires certain entities to obtain it.  

② Self-declaration + government monitoring (continuous) — Regulated parties self-assess and publish an accessibility statement; government samples and re-checks, plus a complaints channel.

③ Procurement / supply-chain leverage (gates at entry) — “Government only buys accessible products” / “non-compliance loses you the contract.”

④ Market surveillance + fines (ex post) — A market-surveillance authority audits, orders remediation, imposes fines, or even pulls the service.

⑤ Anti-discrimination litigation (ex post) — No prior certification; driven by individual complaints, civil litigation, and administrative remedies.

⑥ Soft law / duty to make efforts — No binding threshold or penalty; relies on administrative guidance and reputational pressure.

#### 2. Jurisdiction-by-Jurisdiction Review (Grouped by Dominant Model)

##### Group A — Government Mandatory-Certification Model (East Asia + India)

What these jurisdictions share: the government (or a government-designated body) acts as the certifier, and “obtaining certification” is written into law or policy.

- Taiwan. The parent law — Article 52–2 of the People with Disabilities Rights Protection Act — explicitly requires government agencies and schools to have their websites “pass accessibility testing at Priority 1 (Level A) or above, and obtain the certification mark.” The Ministry of Digital Affairs runs the platform, combining self-testing, automated testing, and human testing (including testers with disabilities). The standard is based on WCAG 2.1 AA, with an upgrade to 2.2 planned for end-2026. Mandatory for the public sector; unregulated for the private sector.

- South Korea. Centered on Article 21 of the Anti-Discrimination Against and Remedies for Persons with Disabilities Act, the Ministry of Science and ICT (MSIT) designates three certification bodies to issue an official quality mark, under the KWCAG 2.2 standard. Penalties are relatively hard — malicious discrimination can mean up to 3 years’ imprisonment or a fine up to KRW 30 million, plus administrative fines and loss of eligibility for government contracts. Public sector via certification; private sector compelled (in phases) by anti-discrimination law.

- India. Built on the Rights of Persons with Disabilities Act (RPwD 2016). STQC — an official body under MeitY — tests and issues the CQW certification (bundling accessibility, cybersecurity, and usability together), under the GIGW 3.0 standard (WCAG 2.1 AA). Penalties run from ₹10,000 for a first offense to up to ₹5 lakh for repeat offenses. A 2025 SEBI circular extended mandatory accessibility to the financial sector for the first time — India is expanding from the public sector into the private.

##### Group B — Anti-Discrimination, Litigation-Driven Model (Common Law + Japan)  

These jurisdictions set no government pre-certification; they frame accessibility as “anti-discrimination / equal rights” and drive it through complaints and lawsuits.

- United States. A dual track — the ADA (anti-discrimination: Title II for state/local government, Title III for the private sector) plus Section 508 (federal procurement). The standard must be layered: ADA Title II’s 2024 rule adopts WCAG 2.1 AA; Section 508 still references WCAG 2.0 AA; Title III has no statutory technical standard and relies on case law. The classic “litigation-driven” country, with thousands of website lawsuits a year.

- United Kingdom. Public sector under the Public Sector Bodies Accessibility Regulations 2018 (PSBAR, transposing the WAD), monitored by GDS and enforced by the EHRC; private sector under the Equality Act 2010, which requires “reasonable adjustments,” with disabled users able to claim in the County Court. The standard tracks “WCAG as amended” (currently 2.2 AA). Post-Brexit, the UK has not transposed the EAA, so the private sector relies solely on the Equality Act.

- Australia. The Disability Discrimination Act 1992 (DDA) covers both public and private sectors, but with no statutory technical standard and no administrative fines; the AHRC receives complaints → conciliation → the Federal Court, which can award damages and order remediation (the landmark case being Maguire v SOCOG, 2000). The federal government separately requires the latest WCAG (now 2.2 AA) via the DTA’s Digital Service Standard 2.0. In April 2025 the AHRC updated its recommended standard to WCAG 2.2 AA.

- Japan. The Act on the Elimination of Discrimination against Persons with Disabilities — Article 7 (government) and Article 8 (private) — with the standard JIS X 8341–3:2016 (corresponding to WCAG 2.0, moving toward 2.1 in practice). As of 1 April 2024, the private-sector duty of “reasonable accommodation” was upgraded from a duty-to-make-efforts to a legal obligation, yet web accessibility itself remains more of an aspirational target with virtually no direct penalty (the only fine, up to ¥200,000, targets refusal to cooperate with government investigations or filing false reports). A textbook case of “soft law.”

##### Group C — EU Dual-Directive Model (WAD for Public, EAA for Private)

These countries are highly uniform in structure: the public sector derives from the WAD (2016/2102) and runs on self-declaration + government monitoring; the private sector derives from the EAA (2019/882, applicable from 28 June 2025) and runs on market surveillance + fines. The differences lie in “how much bite the monitoring has” and “how large the fines are.” The standard is uniformly EN 301 549 → WCAG 2.1 AA.

- Germany. Three layers — BGG (parent law) + BITV 2.0 (public sector) + BFSG (private sector). The public sector carries no penalty, relying on collective litigation (Verbandsklage); the private sector is handled by the federal states’ joint market-surveillance body (seated in Magdeburg), with fines up to €100,000.

- France. Article 47 of Law №2005–102 + RGAA 4.1.2, with DINUM setting the standard. What’s distinctive: since 2023, ARCOM has real sanctioning power even over the public sector — €25,000 for failing declaration duties, €50,000 for accessibility non-conformity, renewable annually if uncorrected. The private sector (EAA) is overseen by the DGCCRF’s market surveillance, with aggregate fines reaching €250,000. France is one of the few EU countries that gave its public-sector monitoring real teeth.

- Spain. Public sector under RD 1112/2018 + monitoring by the Web Accessibility Observatory; private sector under RDL 11/2023. Fines split by regime — public-sector oversight around €3,000–100,000, while the private-sector/EAA tiers can reach €1,000,000 (very serious), among the highest ceilings in the EU. No official mark; AENOR and Ilunion are private voluntary certifications.

- Portugal. Public sector under DL 83/2018, with AMA monitoring and operating the government-run but voluntary “Usability and Accessibility Seal” (Selo: gold/silver/bronze); private sector under DL 82/2022, audited by multiple sectoral regulators (ANACOM, ASAE, etc.), with corporate fines up to roughly €44,892.

- Austria. Public sector under the WZG, monitored by the FFG (Research Promotion Agency); private sector under the BaFG (2025), with the Social Ministry Service (Sozialministeriumservice) as market-surveillance authority, fines up to €80,000. WACA is a private voluntary mark.

- Belgium. Its federal structure fragments the legal basis — one federal law (19 July 2018) plus several regional decrees; the Digital Accessibility Office under BOSA monitors and coordinates. The private-sector EAA is enforced by the federal economy ministry, among others. AnySurfer is a private voluntary mark.

- Netherlands. Public sector under the Temporary Decree on Digital Accessibility for Government, using a comply-or-explain approach + Logius checking statements + a public dashboard, with no fines; the private-sector Implementation Act is supervised by the Authority for Consumers and Markets (ACM), with fines up to €90,000 and the power to ban a non-compliant service. Drempelvrij/Digital Inclusive is a private voluntary mark.

##### Group D — Non-EU, Its Own System

- Switzerland. The Disability Equality Act (BehiG, 2004) + the eCH-0059 standard (WCAG 2.1 AA). It currently applies only to the federal administration, with no fines, relying on individuals asserting their rights. Non-EU, so the EAA does not apply. A revision is underway, expected no earlier than 1 January 2027, to extend the obligation to private online services.

#### 3. The Public × Private × Mechanism Matrix

::figure
  ![Web Accessibility Regimes](/images/blog/49.webp)
  ::figcaption
    Web Accessibility Regimes — Public × Private Mechanism Matrix. Each jurisdiction is placed on both axes; ①–⑥ refer to the six mechanisms defined in Section 1.
    [Is Closing the Web Accessibility Design/Development Gap a Bridge Too Far?](https://www.deque.com/blog/is-closing-the-web-accessibility-design-development-gap-a-bridge-too-far/ "Open new window"){target="_blank"}
  ::
::

#### Four Structural Facts the Matrix Reveals

1. The public sector clusters around “certification/monitoring”; the private sector splits into two paths. The public column is always ① or ②; the private column fractures into two legal traditions — common-law countries (US, UK, AU) plus East Asian anti-discrimination regimes (JP, KR) rely on ⑤ litigation, while the EU relies on ④ market surveillance + fines.

2. The “private sector” cell was long the weakest, only filled in during 2024–2025. Taiwan’s private sector is still nearly blank, Japan only hardened in 2024, both the EU’s EAA and India’s SEBI rule arrived in 2025, and Switzerland won’t until 2027. The center of gravity of accessibility enforcement is spilling over from the public sector into the private.

3. The same ② “monitoring” mechanism has very different bite. Most EU countries’ public sectors have no fines (Germany, Netherlands, Belgium, Austria, Portugal), relying on transparency and collective litigation; France is the outlier, with ARCOM able to fine the public sector up to €50k and “name and shame”; the UK has no fines but the EHRC holds investigative and litigation powers.

4. Private-sector (EAA) fine ceilings vary enormously. Portugal ~€45k, Austria €80k, Netherlands €90k, Germany €100k, France aggregate €250k, Spain up to €1M. The same EAA, “priced” wildly differently across countries.

### 4. Pros and Cons of Each Mechanism

#### A. Common Public-Sector Mechanisms

① Mandatory certification — (Taiwan, Korea, India)  

✅ Uniform standard; clear pass/fail; publicly verifiable; strongest effect on government sites; naturally produces an “official mark” people can trust.  

⚠️ High administrative cost; tends to freeze at the moment of certification; hard to scale; quality can regress after passing (a one-off gate).  

② Self-declaration + monitoring — (EU public sector, UK)

✅ Low barrier; can cover a vast number of sites; continuous monitoring reflects the current state; no need for a huge certification apparatus.  

⚠️ Self-assessment has low credibility; monitoring is only sampled; becomes a formality when penalties are weak (a beautiful statement on an inaccessible site).  

③ Procurement / supply-chain leverage — (US Section 508)

✅ Drives many suppliers without needing new penalties; strong demonstration effect; clear chain of responsibility.  

⚠️ Only reaches those who transact with government; easily gamed by inflated “self-declarations” (VPATs).  

> The public sector’s shared weakness: however strong, its boundary stops at the government itself. Taiwan’s and India’s mandatory certification has no spillover to the private sector; the EU’s monitoring model has broad coverage but shallow depth, and most countries impose no fines on the public sector at all (France being a rare exception).  

#### B. Common Private-Sector Mechanisms  

④ Market surveillance + fines — (EU private sector, India SEBI)

✅ Strong economic deterrence; clearly covers the private sector; clear attribution of responsibility; can pull or ban a service.  

⚠️ Ex post (the harm is already done); limited enforcement capacity; heavy burden on SMEs; easily dodged via exemptions; ceilings vary widely and it only launched in 2025, so effectiveness is yet to be seen.  

⑤ Anti-discrimination litigation — (US, UK, Australia, Korea)

✅ Empowers the affected individual; case law can raise the bar quickly; no need for a large ex-ante apparatus.  

⚠️ Highly uncertain; standards form in a fragmented way through the courts; litigation costs get passed on; prone to “predatory lawsuits”; the vulnerable may not be able to afford to sue.  

⑥ Soft law / duty to make efforts — (Japan, Taiwan private, Switzerland private until 2027)

✅ Low resistance to adoption; useful as a transitional step; can build consensus before hardening.  

⚠️ Almost no binding force; degenerates into a declaration; improvement depends heavily on corporate goodwill and reputational pressure.  

> The private sector’s shared dilemma: it is either ex post (fines and lawsuits both come after the harm) or toothless (soft law). No country applies “ex-ante mandatory certification” to the private sector — which is precisely why official marks grow almost exclusively in the public sector. 

#### Cross-Group Observations

- There is no single best solution; mature jurisdictions all “stack” tools. The US = procurement (③) + litigation (⑤); EU countries = monitoring (②) + market surveillance (④), plus individual litigation. A strong regime layers multiple tools that back each other up, rather than betting on one.
- The presence or size of fines doesn’t equal effectiveness. The Netherlands has no public-sector fines yet sustains transparency pressure via comply-or-explain + a public dashboard; Spain fines the private sector up to €1M, but actual enforcement capacity remains a question mark. The real difference lies in enforcement density, not just the numbers in the statute.

### 5. Overall Observations and Trends

1. The technical standard is converging globally, while regulatory tools diverge sharply. Everyone is converging on EN 301 549 / WCAG 2.1 (moving to 2.2) AA; the real differences are all in “who enforces, and how.”

2. The center of gravity is shifting from “public-sector soft law / ex-ante certification” toward “private-sector market surveillance + fundamental rights.” 2024–2025 is the watershed: the EU’s EAA, Japan’s reasonable-accommodation duty, India’s 2025 Supreme Court ruling and SEBI circular all push accessibility from an “aspirational target” toward a penalizable, litigable right. Switzerland in 2027 will be next.

3. “Whether there’s an official mark” ≠ “how strong the regime is.” Taiwan, Korea, and India have mandatory official marks; but Germany, Spain, and the Netherlands — countries with complete regimes — deliberately issue no official mark, opting instead for self-declaration + monitoring and leaving marks to a private, voluntary market. Portugal’s Selo, though government-run, is still merely a voluntary excellence award rather than a compliance gate.

### Reference

#### International / Framework

[W3C WAI, Web Accessibility Laws & Policies](https://www.w3.org/WAI/policies/ "Open new window"){target="_blank"}

[EU Web Accessibility Directive 2016/2102](https://eur-lex.europa.eu/eli/dir/2016/2102/oj "Open new window"){target="_blank"}

[European Accessibility Act, Directive 2019/882](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en "Open new window"){target="_blank"}

[EN 301 549（Accessible EU Centre）](https://accessible-eu-centre.ec.europa.eu/ "Open new window"){target="_blank"}

#### Taiwan

[People with Disabilities Rights Protection Act, Art. 52–2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?Pcode=D0050046&FLNO=52-2 "Open new window"){target="_blank"}

[Ministry of Digital Affairs, Website Accessibility Guidelines](https://accessibility.moda.gov.tw/ "Open new window"){target="_blank"}

#### United States

[ADA](https://www.ada.gov/law-and-regs/ada/ "Open new window"){target="_blank"}

[Section 508](https://www.section508.gov/ "Open new window"){target="_blank"}

[ADA Title II 2024 rule vs. Section 508 (Level Access)](https://www.levelaccess.com/blog/ada-vs-section-508-whats-the-difference/ "Open new window"){target="_blank"}

#### United Kingdom

[PSBAR 2018](https://www.legislation.gov.uk/uksi/2018/952/contents "Open new window"){target="_blank"}

[Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents "Open new window"){target="_blank"}

[Public-sector accessibility requirements (GOV.UK)](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps "Open new window"){target="_blank"}

#### Australia

[Disability Discrimination Act 1992](https://www.legislation.gov.au/C2004A04426/latest "Open new window"){target="_blank"}

[AHRC, World Wide Web Access: DDA Advisory Notes](https://humanrights.gov.au/our-work/disability-rights/world-wide-web-access-disability-discrimination-act-advisory-notes-ver "Open new window"){target="_blank"}

#### South Korea

[Act on Prohibition of Discrimination against Persons with Disabilities(KLRI English)](https://elaw.klri.re.kr/eng_mobile/viewer.do?hseq=55535&type=part&key=38 "Open new window"){target="_blank"}

[Seoul, Web Accessibility Quality Mark](https://english.seoul.go.kr/web-accessibility-quality-mark/ "Open new window"){target="_blank"}

#### Japan

[Act on the Elimination of Discrimination against Persons with Disabilities (Cabinet Office)](https://www8.cao.go.jp/shougai/suishin/law_h25-65.html "Open new window"){target="_blank"}

[1 April 2024 reasonable-accommodation duty (Anderson Mōri & Tomotsune) ](https://www.amt-law.com/asset/pdf/bulletins9_pdf/LELB63.pdf "Open new window"){target="_blank"}

#### India

[RPwD Act 2016](https://niepvd.nic.in/the-rights-of-persons-with-disabilities-rpwd-act-2016/ "Open new window"){target="_blank"}

[GIGW 3.0](https://guidelines.india.gov.in/ "Open new window"){target="_blank"}

[STQC CQW](https://www.stqc.gov.in/website-quality-certification-0 "Open new window"){target="_blank"}

[SEBI 2025 digital accessibility (Deque)](https://www.deque.com/blog/sebi-sets-a-new-standard-for-digital-accessibility-in-finance-in-india/ "Open new window"){target="_blank"}

#### Germany

[BGG / BITV 2.0 / BFSG](https://www.gesetze-im-internet.de/bfsg/ "Open new window"){target="_blank"}

[States’ joint market-surveillance body (Magdeburg)](https://ms.sachsen-anhalt.de/themen/menschen-mit-behinderungen/aktuelles/marktueberwachungsstelle-der-laender-fuer-die-barrierefreiheit-von-produkten-und-dienstleistungen "Open new window"){target="_blank"}

#### France

[Loi 2005-102, art. 47](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000037388867/ "Open new window"){target="_blank"}

[RGAA 4.1](https://accessibilite.numerique.gouv.fr/ "Open new window"){target="_blank"}

[ARCOM oversight ](https://www.arcom.fr/nous-connaitre/nos-missions/garantir-le-pluralisme-et-la-cohesion-sociale/les-droits-des-personnes-handicapees/accessibilite-des-sites-et-des-services-numeriques "Open new window"){target="_blank"}

#### Spain

[RD 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699 "Open new window"){target="_blank"}

[RDL 11/2023](https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022 "Open new window"){target="_blank"}

#### Portugal

[DL 83/2018](https://www.acessibilidade.gov.pt/mudanca/dl-n-o-83-2018/ "Open new window"){target="_blank"}

[DL 82/2022（EAA 轉化）AMA / acessibilidade.gov.pt](https://www.acessibilidade.gov.pt/ "Open new window"){target="_blank"}

#### Austria

[WZG（RIS）](https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010727 "Open new window"){target="_blank"}

[FFG Monitoring and Complaints Office](https://ffg.at/barrierefreiheit/WZG-Anwendbarkeit "Open new window"){target="_blank"}

[Digital Barrierefrei](https://www.digitalbarrierefrei.at/en/ "Open new window"){target="_blank"}

#### Belgium

[Law of 19 July 2018 (BOSA)](https://bosa.belgium.be/fr/regulations/loi-du-19-juillet-2018-accessibilite "Open new window"){target="_blank"}

[Belgian Web Accessibility (monitoring & complaints)](https://accessibility.belgium.be/fr/missions-et-plaintes "Open new window"){target="_blank"}

#### Netherlands

[DigiToegankelijk (policy)](https://www.digitoegankelijk.nl/wetgeving/beleid-nederland-en-europa "Open new window"){target="_blank"}

[Netherlands Digital Accessibility Laws（Level Access）](https://www.levelaccess.com/wp-content/uploads/2025/06/Netherlands-Digital-Accessibility-Laws.pdf "Open new window"){target="_blank"}

#### Switzerland

[BehiG / Accessibility in the federal administration (bit.admin.ch)](https://www.bit.admin.ch/en/accessibility-in-the-federal-administration "Open new window"){target="_blank"}

[BehiG revision draft (2027, Härting)](https://haerting.ch/en/insights/accessible-websites-and-apps-new-obligations-under-the-draft-of-the-new-swiss-disability-discrimination-act-behig/ "Open new window"){target="_blank"}

--

Information compiled as of June 2026; it may contain errors, and corrections are welcome. The next article will analyze each country’s certification marks.
