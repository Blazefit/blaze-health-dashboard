import type { SnpReference, SnpCategory } from '@/lib/types';

export const SNP_DATABASE: SnpReference[] = [
  // ─── METHYLATION ────────────────────────────────────────────────────────────
  {
    rsid: 'rs1801133',
    gene: 'MTHFR',
    variant_name: 'MTHFR C677T',
    chromosome: '1',
    position: 11856378,
    category: 'methylation',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The C677T variant in the MTHFR gene encodes a thermolabile enzyme with significantly reduced activity. Homozygous TT individuals typically exhibit 70% loss of enzyme function, while heterozygous CT individuals show ~35% reduction, impairing the conversion of dietary folate to 5-methyltetrahydrofolate.',
    clinical_significance:
      'Reduced MTHFR activity leads to elevated homocysteine, impaired methylation capacity, and decreased SAM production. This is associated with increased cardiovascular risk, neural tube defects in offspring, mood dysregulation, and suboptimal DNA methylation across the genome.',
    actionable_recommendation:
      'Supplement with L-methylfolate (5-MTHF) rather than folic acid, which bypasses the impaired enzymatic step. Pair with methylcobalamin (B12) and riboflavin (B2) to support the methylation cycle. Monitor plasma homocysteine and aim to keep levels below 7 µmol/L.',
  },
  {
    rsid: 'rs1801131',
    gene: 'MTHFR',
    variant_name: 'MTHFR A1298C',
    chromosome: '1',
    position: 11854476,
    category: 'methylation',
    risk_allele: 'C',
    normal_genotype: 'AA',
    description:
      'The A1298C variant in MTHFR primarily affects the regulatory domain of the enzyme, impairing the synthesis of tetrahydrobiopterin (BH4), a critical cofactor for neurotransmitter production and nitric oxide synthesis. It tends to have a milder effect on homocysteine than C677T but significant downstream consequences for BH4-dependent pathways.',
    clinical_significance:
      'Reduced BH4 availability can impair serotonin, dopamine, and norepinephrine synthesis, contributing to mood disorders and neurological symptoms. When combined with the C677T variant (compound heterozygote), the clinical impact is substantially amplified, approaching that of homozygous C677T.',
    actionable_recommendation:
      'Supplement with methylfolate and methylcobalamin to support the methylation cycle. Consider BH4 precursor support (sapropterin if indicated) or cofactors that upregulate BH4 recycling. Avoid high-dose folic acid, which may competitively inhibit residual MTHFR function.',
  },
  {
    rsid: 'rs1801394',
    gene: 'MTRR',
    variant_name: 'MTRR A66G',
    chromosome: '5',
    position: 7870973,
    category: 'methylation',
    risk_allele: 'G',
    normal_genotype: 'AA',
    description:
      'The A66G variant in the methionine synthase reductase (MTRR) gene reduces the enzyme\'s ability to regenerate active methylcobalamin (methyl-B12), the cofactor required for methionine synthase (MTR) function. This creates a functional B12 deficiency even when serum B12 levels appear adequate.',
    clinical_significance:
      'Impaired MTRR activity leads to reduced remethylation of homocysteine to methionine, elevating homocysteine and decreasing SAM-dependent methylation reactions. Risk is compounded when co-occurring with MTHFR variants or low dietary B12 intake, and has been associated with neural tube defect risk and megaloblastic changes.',
    actionable_recommendation:
      'Supplement with methylcobalamin (not cyanocobalamin) at adequate doses to compensate for impaired recycling. Sublingual or injectable forms improve bioavailability when GI absorption is suboptimal. Monitor serum B12, methylmalonic acid, and homocysteine as functional markers of B12 status.',
  },
  {
    rsid: 'rs1805087',
    gene: 'MTR',
    variant_name: 'MTR A2756G',
    chromosome: '1',
    position: 236952310,
    category: 'methylation',
    risk_allele: 'G',
    normal_genotype: 'AA',
    description:
      'The A2756G variant in the methionine synthase (MTR) gene affects the B12-binding domain of the enzyme, which catalyzes the remethylation of homocysteine to methionine using 5-methyltetrahydrofolate as the methyl donor. This variant can alter enzyme kinetics and increase B12 demand.',
    clinical_significance:
      'Reduced MTR efficiency impairs the folate–B12 interaction central to the methylation cycle, potentially elevating homocysteine and reducing methionine and SAM availability. The variant is also associated with increased cancer risk in some populations, particularly in the context of low folate or B12 status.',
    actionable_recommendation:
      'Ensure adequate intake of methylcobalamin and methylfolate to support MTR activity. Regular monitoring of homocysteine, B12, and folate levels is recommended. Dietary sources of B12 (organ meats, shellfish) or high-quality supplementation should be prioritized.',
  },
  {
    rsid: 'rs234706',
    gene: 'CBS',
    variant_name: 'CBS C699T',
    chromosome: '21',
    position: 43054294,
    category: 'methylation',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The CBS (cystathionine beta-synthase) rs234706 variant is associated with upregulation of the transsulfuration pathway, which diverts homocysteine toward cystathionine and ultimately taurine and sulfate. This "CBS upregulation" increases flux away from remethylation, potentially depleting SAM and downstream methylation capacity.',
    clinical_significance:
      'Upregulated CBS activity can lead to excess ammonia and sulfate production, reduced SAM levels, and depletion of cofactors needed for other methylation-cycle enzymes. Symptoms may include fatigue, brain fog, and sensitivity to sulfur-containing foods. It is often considered in the context of compound methylation pathway variants.',
    actionable_recommendation:
      'Monitor homocysteine levels, as CBS upregulation can paradoxically keep homocysteine low while depleting SAM. Consider temporarily reducing high-sulfur foods if symptomatic. Support with B6 (P5P form), which is a cofactor for CBS, and ensure overall methylation cycle support with methylfolate and methylcobalamin.',
  },
  {
    rsid: 'rs2236225',
    gene: 'MTHFD1',
    variant_name: 'MTHFD1 G1958A',
    chromosome: '14',
    position: 64806627,
    category: 'methylation',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The G1958A variant in MTHFD1 (methylenetetrahydrofolate dehydrogenase 1) affects a trifunctional enzyme involved in folate interconversion within the cytoplasm, impacting the synthesis of formyl-THF and methylene-THF needed for purine synthesis, thymidylate synthesis, and methylation.',
    clinical_significance:
      'Reduced MTHFD1 activity impairs the distribution of folate cofactors across multiple essential pathways including DNA synthesis and repair, amino acid metabolism, and the methylation cycle. This variant has been associated with increased neural tube defect risk, colorectal cancer susceptibility, and elevated homocysteine in low-folate states.',
    actionable_recommendation:
      'Supplement with folinic acid (5-formyl-THF), which enters the folate cycle downstream of MTHFD1 and can partially bypass the impaired step. A combination of methylfolate and folinic acid provides broader pathway support. Ensure adequate riboflavin and dietary folate from whole-food sources.',
  },

  // ─── CARDIOVASCULAR ─────────────────────────────────────────────────────────
  {
    rsid: 'rs5186',
    gene: 'AGTR1',
    variant_name: 'AGTR1 A1166C',
    chromosome: '3',
    position: 148459988,
    category: 'cardiovascular',
    risk_allele: 'C',
    normal_genotype: 'AA',
    description:
      'The A1166C variant in the angiotensin II type 1 receptor (AGTR1) gene is located in the 3\'UTR and increases receptor expression and sensitivity to angiotensin II. This leads to enhanced vasoconstriction, aldosterone secretion, and sodium retention, resulting in elevated blood pressure.',
    clinical_significance:
      'Carriers of the C allele show exaggerated vascular responses to angiotensin II, increasing lifetime hypertension risk by approximately 30%. The variant also interacts with dietary sodium intake and has been associated with increased risk of myocardial infarction, left ventricular hypertrophy, and preeclampsia.',
    actionable_recommendation:
      'Monitor blood pressure regularly and reduce dietary sodium to below 1,500 mg/day. Dietary approaches emphasizing potassium-rich foods, magnesium, and the DASH diet can help mitigate the vascular effects. ACE inhibitor or ARB medications, if prescribed, may be particularly effective in this genotype.',
  },
  {
    rsid: 'rs429358',
    gene: 'APOE',
    variant_name: 'APOE rs429358',
    chromosome: '19',
    position: 44908684,
    category: 'cardiovascular',
    risk_allele: 'C',
    normal_genotype: 'TT',
    description:
      'rs429358 is one of two defining SNPs of the APOE haplotype system. The C allele at this position, combined with rs7412, defines the APOE ε4 allele. APOE ε4 encodes a protein variant with arginine at position 112, altering receptor binding affinity and lipid metabolism efficiency compared to the more common ε3 allele.',
    clinical_significance:
      'The APOE ε4 allele (defined by C at rs429358) is the strongest known genetic risk factor for late-onset Alzheimer\'s disease and is also associated with elevated LDL cholesterol, impaired postprandial lipid clearance, and increased cardiovascular disease risk. Homozygous ε4/ε4 individuals carry the highest risk, while heterozygous ε3/ε4 individuals carry intermediate risk.',
    actionable_recommendation:
      'Monitor fasting lipid panel including LDL particle size, apolipoprotein B, and Lp(a). Adhere to a low-saturated-fat diet and consider Mediterranean dietary patterns, which have shown benefit in APOE ε4 carriers. Regular aerobic exercise is particularly important for lipid management and cognitive protection in this genotype.',
  },
  {
    rsid: 'rs7412',
    gene: 'APOE',
    variant_name: 'APOE rs7412',
    chromosome: '19',
    position: 44908822,
    category: 'cardiovascular',
    risk_allele: 'C',
    normal_genotype: 'CC',
    description:
      'rs7412 is the second defining SNP of the APOE haplotype. The T allele at this position, combined with rs429358 T, defines the APOE ε2 allele, which is associated with reduced cardiovascular risk and, paradoxically, a small increase in type III hyperlipoproteinemia risk in rare homozygotes. The C allele (wild type at this locus) in combination with rs429358 C defines ε4.',
    clinical_significance:
      'The APOE ε2 allele (T at rs7412) is generally cardioprotective and associated with lower LDL cholesterol levels and reduced Alzheimer\'s disease risk compared to ε3 and ε4. However, ε2/ε2 homozygotes are at increased risk for type III hyperlipoproteinemia and hypertriglyceridemia in the presence of other metabolic stressors.',
    actionable_recommendation:
      'Haplotype determination requires genotyping both rs429358 and rs7412 together; neither SNP is interpretable in isolation. Monitor a comprehensive lipid panel and triglycerides regularly. Dietary fat quality is important across all APOE genotypes, with saturated and trans fats warranting particular attention.',
  },
  {
    rsid: 'rs4646994',
    gene: 'ACE',
    variant_name: 'ACE I/D',
    chromosome: '17',
    position: 63488530,
    category: 'cardiovascular',
    risk_allele: 'D',
    normal_genotype: 'II',
    description:
      'The ACE insertion/deletion (I/D) polymorphism involves a 287-bp Alu repeat element in intron 16 of the angiotensin-converting enzyme gene. The deletion (D) allele is associated with significantly higher serum and tissue ACE activity, leading to greater conversion of angiotensin I to angiotensin II and faster degradation of bradykinin.',
    clinical_significance:
      'The DD genotype is associated with approximately twice the serum ACE activity compared to II, conferring increased risk of hypertension, myocardial infarction, diabetic nephropathy, and exercise-induced left ventricular hypertrophy. The D allele is also associated with a potentially favorable response to ACE inhibitor therapy. Some data suggest DD carriers show performance benefits in power sports due to enhanced muscle angiogenesis.',
    actionable_recommendation:
      'Monitor blood pressure and cardiovascular risk markers regularly. The DD genotype may warrant earlier initiation of preventive cardiovascular strategies including aerobic exercise, sodium restriction, and weight management. ACE inhibitors may be especially effective if antihypertensive therapy is indicated.',
  },

  // ─── DETOX ──────────────────────────────────────────────────────────────────
  {
    rsid: 'rs4680',
    gene: 'COMT',
    variant_name: 'COMT Val158Met',
    chromosome: '22',
    position: 19951271,
    category: 'detox',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The Val158Met variant in catechol-O-methyltransferase (COMT) substitutes valine with methionine at position 158, reducing enzyme thermostability and activity by 3–4-fold. COMT is the primary enzyme responsible for degradation of catecholamines (dopamine, epinephrine, norepinephrine) and catechol estrogens via methylation.',
    clinical_significance:
      'The slow-COMT AA genotype results in higher synaptic dopamine levels in the prefrontal cortex, associated with better baseline working memory and executive function but heightened vulnerability to stress, anxiety, and pain sensitization. This variant also impairs estrogen detoxification, potentially increasing breast cancer risk. It is commonly called the "warrior/worrier" SNP.',
    actionable_recommendation:
      'Avoid excessive methylation supplementation (high-dose SAM-e or methyl donors), which can over-drive COMT in slow metabolizers, potentially worsening anxiety. Magnesium is a natural COMT cofactor and helps regulate catecholamine balance. Stress management, adequate sleep, and limiting high-catecholamine foods (fermented foods, aged cheese) are particularly important.',
  },
  {
    rsid: 'rs1695',
    gene: 'GSTP1',
    variant_name: 'GSTP1 Ile105Val',
    chromosome: '11',
    position: 67352689,
    category: 'detox',
    risk_allele: 'G',
    normal_genotype: 'AA',
    description:
      'The Ile105Val variant in GSTP1 (glutathione S-transferase pi 1) reduces the catalytic efficiency of this phase II detoxification enzyme, which conjugates glutathione to electrophilic compounds, carcinogens, and reactive oxygen species to facilitate urinary excretion.',
    clinical_significance:
      'Reduced GSTP1 activity impairs the detoxification of polycyclic aromatic hydrocarbons, acrolein, and other carcinogens, increasing cancer susceptibility, particularly for lung, breast, and colorectal cancers. The variant also reduces the cell\'s capacity to handle oxidative stress, making carriers more sensitive to environmental toxicant exposures.',
    actionable_recommendation:
      'Increase dietary intake of cruciferous vegetables (broccoli, Brussels sprouts, cauliflower), which contain sulforaphane and indole-3-carbinol that upregulate glutathione synthesis and compensatory phase II enzymes. N-acetylcysteine (NAC) and lipoic acid supplementation can help maintain glutathione levels. Minimize exposure to environmental toxicants and smoke.',
  },
  {
    rsid: 'rs1800566',
    gene: 'NQO1',
    variant_name: 'NQO1 Pro187Ser',
    chromosome: '16',
    position: 69711242,
    category: 'detox',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The Pro187Ser variant in NQO1 (NAD(P)H quinone oxidoreductase 1) dramatically reduces enzyme stability and activity; homozygous TT individuals have virtually no NQO1 activity. NQO1 catalyzes the two-electron reduction of quinones to hydroquinones, preventing the generation of semiquinone radicals and protecting against oxidative damage.',
    clinical_significance:
      'Loss of NQO1 activity impairs the detoxification of quinones (including ubiquinone intermediates and benzene metabolites), increases susceptibility to oxidative stress, and has been associated with elevated risk of leukemia, particularly in benzene-exposed individuals. NQO1 also plays a role in CoQ10 recycling and the stabilization of tumor suppressor proteins including p53.',
    actionable_recommendation:
      'Supplement with CoQ10 (ubiquinol form preferred) to compensate for impaired quinone recycling. Antioxidant support with vitamins C and E, lipoic acid, and resveratrol can help offset increased oxidative burden. Minimize occupational and environmental exposure to benzene, quinone-generating chemicals, and tobacco smoke.',
  },
  {
    rsid: 'rs762551',
    gene: 'CYP1A2',
    variant_name: 'CYP1A2 -163C>A',
    chromosome: '15',
    position: 75041917,
    category: 'detox',
    risk_allele: 'C',
    normal_genotype: 'AA',
    description:
      'The rs762551 variant in the CYP1A2 gene promoter region determines the inducibility of CYP1A2, the primary enzyme responsible for caffeine metabolism (accounting for ~95% of caffeine clearance). The C allele is associated with the slow-metabolizer phenotype, reducing CYP1A2 inducibility by cigarette smoke and other inducers.',
    clinical_significance:
      'Slow CYP1A2 metabolizers (CC genotype) have significantly prolonged caffeine half-life, meaning caffeine consumed even in the afternoon can still affect sleep quality at night. Studies have shown that slow metabolizers who consume moderate to high caffeine have increased myocardial infarction risk, whereas fast metabolizers (AA) do not. CYP1A2 also metabolizes several medications and procarcinogens.',
    actionable_recommendation:
      'Limit caffeine consumption to the morning hours and to no more than 100–200 mg per day. Choose low-caffeine alternatives for afternoon beverages. Be aware that CYP1A2 also metabolizes certain medications (theophylline, clozapine, olanzapine) and inform prescribers of this genotype where relevant.',
  },

  // ─── METABOLISM ─────────────────────────────────────────────────────────────
  {
    rsid: 'rs9939609',
    gene: 'FTO',
    variant_name: 'FTO rs9939609',
    chromosome: '16',
    position: 53820527,
    category: 'metabolism',
    risk_allele: 'A',
    normal_genotype: 'TT',
    description:
      'The rs9939609 variant in the FTO (fat mass and obesity-associated) gene is the most replicated common genetic variant associated with BMI and obesity risk in humans. The A risk allele appears to regulate expression of nearby genes IRX3 and IRX5, which influence adipocyte differentiation toward energy-storing white fat rather than thermogenic beige fat.',
    clinical_significance:
      'Each A allele increases average body weight by approximately 1.2 kg and BMI by 0.4 kg/m², with homozygous AA individuals showing a 1.67-fold increased obesity risk. The mechanism involves dysregulation of energy intake via impaired satiety signaling, increased ghrelin sensitivity, and altered food reward processing, making portion control particularly challenging.',
    actionable_recommendation:
      'Monitor caloric intake with structured portion awareness rather than relying solely on satiety cues. Protein-rich meals and high-fiber diets help counteract impaired satiety signaling. Regular aerobic exercise (150+ minutes/week) has been shown to nearly completely offset the FTO genotype effect on obesity risk. Avoid ultra-processed foods, which further dysregulate appetite hormones.',
  },
  {
    rsid: 'rs1801282',
    gene: 'PPARG',
    variant_name: 'PPARG Pro12Ala',
    chromosome: '3',
    position: 12393125,
    category: 'metabolism',
    risk_allele: 'G',
    normal_genotype: 'CC',
    description:
      'The Pro12Ala variant in PPARG (peroxisome proliferator-activated receptor gamma), encoded by the G allele, reduces PPARG transcriptional activity by approximately 20–30%. PPARG is the master regulator of adipogenesis and a key modulator of insulin sensitivity, controlling the expression of hundreds of genes involved in lipid storage and glucose metabolism.',
    clinical_significance:
      'Somewhat paradoxically, the Ala (G) allele is associated with improved insulin sensitivity and modest protection against type 2 diabetes in most populations. However, the reduced adipogenic signaling can alter fat distribution and lipid metabolism in ways that interact significantly with dietary fat composition and exercise status.',
    actionable_recommendation:
      'This variant is associated with favorable metabolic response to regular exercise, particularly resistance training. A diet lower in saturated fat and higher in polyunsaturated fats (especially omega-3s) helps optimize PPARG signaling. Maintain a healthy body weight as PPARG sensitivity is significantly impaired by adipose tissue expansion and chronic inflammation.',
  },
  {
    rsid: 'rs1042713',
    gene: 'ADRB2',
    variant_name: 'ADRB2 Arg16Gly',
    chromosome: '5',
    position: 148206440,
    category: 'metabolism',
    risk_allele: 'G',
    normal_genotype: 'AA',
    description:
      'The Arg16Gly variant in the beta-2 adrenergic receptor (ADRB2) gene affects receptor downregulation in response to agonist exposure. The Gly (G) allele is associated with enhanced agonist-promoted downregulation, meaning the receptor is more rapidly internalized after catecholamine stimulation, blunting the lipolytic and bronchodilatory response.',
    clinical_significance:
      'Carriers of the G allele show attenuated fat mobilization in response to sympathetic stimulation during exercise and stress, potentially making weight loss more challenging and requiring higher exercise intensity to achieve equivalent lipolytic effects. The variant also affects bronchodilator response to albuterol, with Gly/Gly homozygotes showing paradoxical bronchoconstriction with long-term albuterol use.',
    actionable_recommendation:
      'Higher-intensity exercise protocols (HIIT, circuit training) may be needed to achieve adequate lipolytic response. Avoid over-reliance on adrenergic stimulants for fat loss. A structured periodized training program with progressive overload tends to be more effective for this genotype than steady-state moderate-intensity exercise alone.',
  },
  {
    rsid: 'rs4988235',
    gene: 'MCM6',
    variant_name: 'LCT/MCM6 -13910C>T',
    chromosome: '2',
    position: 136616754,
    category: 'metabolism',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The rs4988235 variant in the MCM6 gene, located ~14 kb upstream of the lactase (LCT) gene, acts as a cis-regulatory element controlling LCT expression in adulthood. The T allele is associated with lactase persistence — continued high lactase expression into adulthood — while the ancestral CC genotype is associated with lactase non-persistence (lactose intolerance).',
    clinical_significance:
      'Individuals with the CC (lactase non-persistent) genotype progressively lose lactase expression after weaning, resulting in maldigestion of lactose, which is fermented by colonic bacteria causing bloating, gas, diarrhea, and abdominal discomfort. This represents the ancestral human phenotype; lactase persistence evolved independently in dairying populations in Europe, East Africa, and the Arabian Peninsula.',
    actionable_recommendation:
      'CC genotype individuals should reduce or eliminate regular consumption of high-lactose dairy products (milk, soft cheeses, ice cream). Aged hard cheeses and fermented dairy (yogurt, kefir) are substantially lower in lactose and often tolerated. Supplemental lactase enzymes (e.g., Lactaid) can be taken with dairy-containing meals. Ensure adequate calcium intake from non-dairy sources.',
  },
  {
    rsid: 'rs174547',
    gene: 'FADS1',
    variant_name: 'FADS1 rs174547',
    chromosome: '11',
    position: 61552680,
    category: 'metabolism',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The rs174547 variant in FADS1 (fatty acid desaturase 1) reduces the activity of delta-5 desaturase, the rate-limiting enzyme in the conversion of dietary precursor fatty acids (ALA, LA) to their long-chain polyunsaturated metabolites (EPA, DHA, arachidonic acid). This is a strong cis-acting variant with large effect size on plasma PUFA profiles.',
    clinical_significance:
      'T allele carriers show significantly reduced plasma EPA and DHA levels even on diets adequate in precursor fatty acids (ALA from flaxseed, walnuts), as the conversion pathway is impaired. This translates to reduced omega-3 anti-inflammatory signaling, altered cell membrane composition, and potentially impaired neurodevelopmental outcomes. The variant is also associated with altered arachidonic acid metabolism and inflammatory tone.',
    actionable_recommendation:
      'Direct supplementation with preformed EPA and DHA (marine-source fish oil, algal oil) is essential for this genotype, as the body cannot efficiently synthesize these from plant-based precursors. Target supplemental EPA+DHA of 2–3 g/day and verify sufficiency with an omega-3 index blood test (target >8%). ALA-rich plant sources alone are insufficient.',
  },

  // ─── INFLAMMATION ───────────────────────────────────────────────────────────
  {
    rsid: 'rs1800629',
    gene: 'TNF',
    variant_name: 'TNF-alpha -308G>A',
    chromosome: '6',
    position: 31575254,
    category: 'inflammation',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The -308G>A promoter variant in the TNF gene (encoding tumor necrosis factor alpha) increases transcriptional activity of the TNF promoter, resulting in constitutively higher TNF-alpha production in response to immune stimulation. TNF-alpha is a master pro-inflammatory cytokine regulating the NF-κB pathway, fever, and acute-phase responses.',
    clinical_significance:
      'The A allele is associated with elevated baseline and stimulus-induced TNF-alpha levels, contributing to increased susceptibility to septic shock, autoimmune conditions (rheumatoid arthritis, IBD, psoriasis), asthma, and metabolic inflammation. Carriers show exaggerated inflammatory responses to infections, dietary insults, and environmental stressors, and may progress more rapidly toward chronic inflammatory conditions.',
    actionable_recommendation:
      'Adopt a comprehensive anti-inflammatory dietary protocol emphasizing omega-3 fatty acids, polyphenol-rich foods (berries, olive oil, green tea), turmeric/curcumin, and minimization of ultra-processed foods and refined carbohydrates. Regular moderate aerobic exercise reduces TNF-alpha production. Monitor high-sensitivity CRP and other inflammatory markers annually.',
  },
  {
    rsid: 'rs1800795',
    gene: 'IL6',
    variant_name: 'IL-6 -174G>C',
    chromosome: '7',
    position: 22766645,
    category: 'inflammation',
    risk_allele: 'C',
    normal_genotype: 'GG',
    description:
      'The -174G>C promoter variant in the IL6 gene alters the transcriptional regulation of interleukin-6, a pleiotropic cytokine with both pro- and anti-inflammatory roles. The C allele is associated with lower basal IL-6 transcription in most cell types, though paradoxically some studies report altered responses in acute stress and exercise contexts.',
    clinical_significance:
      'The C allele has been associated with altered risk of several IL-6-mediated conditions including cardiovascular disease, type 2 diabetes (via effects on insulin resistance), rheumatoid arthritis, and some cancers. IL-6 signaling also affects the acute-phase response, and this variant influences the magnitude of CRP elevation in response to inflammatory triggers. The clinical direction (risk vs. protective) can vary by condition and context.',
    actionable_recommendation:
      'Monitor high-sensitivity CRP and IL-6 levels as part of an annual inflammatory panel. Lifestyle factors including aerobic exercise, weight management, and omega-3 fatty acid intake significantly modulate IL-6 expression independent of genotype. Dietary patterns high in refined carbohydrates and saturated fat are particularly potent IL-6 inducers in susceptible individuals.',
  },
  {
    rsid: 'rs1800896',
    gene: 'IL10',
    variant_name: 'IL-10 -1082G>A',
    chromosome: '1',
    position: 206773552,
    category: 'inflammation',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The -1082G>A variant in the IL10 promoter reduces transcriptional activity of interleukin-10, the primary anti-inflammatory and immunosuppressive cytokine that counter-regulates pro-inflammatory pathways. Reduced IL-10 impairs the body\'s ability to resolve inflammation and return to immune homeostasis after an inflammatory stimulus.',
    clinical_significance:
      'The AA genotype is associated with lower IL-10 production, predisposing carriers to exaggerated and prolonged inflammatory responses, increased susceptibility to autoimmune conditions (lupus, IBD, rheumatoid arthritis), and impaired wound healing. In the context of infection, reduced IL-10 can paradoxically worsen tissue damage via uncontrolled inflammation despite adequate pathogen clearance.',
    actionable_recommendation:
      'Prioritize anti-inflammatory interventions that naturally boost IL-10 production: omega-3 fatty acids (EPA/DHA) and curcumin are among the most evidence-supported IL-10 inducers. Probiotics (particularly Lactobacillus strains) have been shown to upregulate IL-10 in the gut. Minimize chronic stress and sleep deprivation, both of which suppress IL-10 while amplifying pro-inflammatory cytokines.',
  },

  // ─── NUTRIENT ───────────────────────────────────────────────────────────────
  {
    rsid: 'rs2228570',
    gene: 'VDR',
    variant_name: 'VDR Fok1',
    chromosome: '12',
    position: 47879112,
    category: 'nutrient',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The Fok1 variant (rs2228570) in the vitamin D receptor (VDR) gene occurs in the translation start codon, resulting in a three-amino-acid-longer isoform with reduced transcriptional efficiency. VDR mediates essentially all genomic actions of 1,25-dihydroxyvitamin D3, regulating over 2,000 genes involved in calcium metabolism, immune function, and cell differentiation.',
    clinical_significance:
      'The A (f) allele encodes the less efficient VDR isoform, meaning higher circulating 25(OH)D levels are required to achieve equivalent transcriptional activity compared to the G (F) allele. This translates to effectively reduced vitamin D signaling at any given serum level, affecting bone mineral density, immune regulation, cancer protection, and cardiovascular health.',
    actionable_recommendation:
      'Target a higher serum 25(OH)D level than standard recommendations — aim for 50–80 ng/mL rather than the conventional 30 ng/mL threshold. Supplementation with vitamin D3 at 3,000–5,000 IU/day is typically needed; always co-supplement with vitamin K2 (MK-7) to direct calcium appropriately. Retest 25(OH)D after 3 months to titrate dose.',
  },
  {
    rsid: 'rs1544410',
    gene: 'VDR',
    variant_name: 'VDR Bsm1',
    chromosome: '12',
    position: 47844974,
    category: 'nutrient',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The Bsm1 variant (rs1544410) in the 3\'UTR of the VDR gene is thought to affect mRNA stability and receptor expression levels. While located in a non-coding region, it is in strong linkage disequilibrium with multiple other VDR functional variants and serves as a tag SNP for a haplotype associated with altered vitamin D receptor signaling.',
    clinical_significance:
      'The A allele at Bsm1 has been associated with reduced bone mineral density, increased fracture risk, impaired calcium absorption efficiency, and altered immune responses to vitamin D. Meta-analyses implicate this variant in susceptibility to tuberculosis, type 1 diabetes, prostate cancer risk, and rheumatoid arthritis — reflecting the broad genomic reach of VDR signaling.',
    actionable_recommendation:
      'Monitor serum 25(OH)D levels at least twice yearly (winter nadir and summer peak) and maintain in the 50–70 ng/mL range. Calcium intake from dietary sources should be sufficient (1,000–1,200 mg/day) alongside adequate vitamin D to maximize absorption efficiency. DXA bone density scans every 2–5 years are advisable to track skeletal response.',
  },
  {
    rsid: 'rs1800562',
    gene: 'HFE',
    variant_name: 'HFE C282Y',
    chromosome: '6',
    position: 26093141,
    category: 'nutrient',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The C282Y variant (rs1800562) in the HFE gene is the primary causative mutation for hereditary hemochromatosis type 1, the most common autosomal recessive genetic disorder in Northern European populations. The A allele (Tyr282) disrupts HFE protein folding and its interaction with beta-2 microglobulin, preventing normal surface expression and its role in hepcidin regulation.',
    clinical_significance:
      'Homozygous C282Y/C282Y individuals have severely impaired hepcidin signaling, resulting in unrestricted intestinal iron absorption and progressive iron accumulation in the liver, heart, pancreas, joints, and pituitary gland. Untreated, this leads to cirrhosis, cardiomyopathy, diabetes ("bronze diabetes"), arthropathy, and hypogonadism. Heterozygous carriers generally have mildly elevated iron stores without organ damage.',
    actionable_recommendation:
      'Monitor serum ferritin and transferrin saturation annually; refer to a hematologist if ferritin exceeds 200 ng/mL (women) or 300 ng/mL (men). Homozygous individuals require therapeutic phlebotomy. Avoid supplemental iron and vitamin C megadoses (enhances iron absorption). Limit alcohol, which potentiates hepatic iron toxicity. First-degree relatives should be offered genetic testing.',
  },
  {
    rsid: 'rs1799945',
    gene: 'HFE',
    variant_name: 'HFE H63D',
    chromosome: '6',
    position: 26090951,
    category: 'nutrient',
    risk_allele: 'G',
    normal_genotype: 'CC',
    description:
      'The H63D variant (rs1799945) in HFE is the second most common hemochromatosis-associated mutation, resulting in histidine-to-aspartate substitution at position 63. Unlike C282Y, it does not prevent HFE surface expression but subtly alters its interaction with the transferrin receptor, mildly increasing iron absorption efficiency.',
    clinical_significance:
      'Homozygous H63D individuals and C282Y/H63D compound heterozygotes have mildly elevated iron stores; full hemochromatosis is uncommon but can occur especially in the presence of additional metabolic stressors (alcohol, metabolic syndrome, hepatitis C). The variant also modifies iron status enough to interact with other conditions sensitive to iron levels, including porphyria and certain anemias.',
    actionable_recommendation:
      'Monitor ferritin and transferrin saturation annually. Avoid supplemental iron unless deficiency is confirmed by labs. Moderate dietary iron — emphasizing heme-iron restraint from red meat while maintaining vegetable iron sources. Alcohol moderation is important to prevent additive hepatic iron loading. If ferritin trends upward over time, consultation with a hematologist is warranted.',
  },
  {
    rsid: 'rs4880',
    gene: 'SOD2',
    variant_name: 'SOD2 Ala16Val',
    chromosome: '6',
    position: 160113872,
    category: 'nutrient',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The Ala16Val variant (rs4880) in the mitochondrial manganese superoxide dismutase (SOD2) gene affects the mitochondrial targeting sequence, altering the efficiency of protein import into the mitochondrial matrix. The T (Val) allele results in a less efficient targeting sequence and reduced mitochondrial SOD2 activity, impairing the primary antioxidant defense against mitochondrial superoxide.',
    clinical_significance:
      'Reduced SOD2 activity leads to increased mitochondrial oxidative stress, impaired electron transport chain function, and accelerated mitochondrial DNA damage. This is associated with elevated risk of several cancers (breast, prostate, ovarian), cardiovascular disease, and age-related mitochondrial dysfunction. The variant may also affect exercise recovery and susceptibility to exercise-induced muscle damage.',
    actionable_recommendation:
      'Support mitochondrial antioxidant capacity with manganese-rich foods (whole grains, legumes, nuts) as Mn is the SOD2 cofactor. Supplement with CoQ10 (ubiquinol), lipoic acid, and NAC to reduce mitochondrial oxidative burden. Avoid mitochondrial stressors including prolonged high-dose acetaminophen, excessive alcohol, and chronic sleep deprivation. Regular aerobic exercise upregulates endogenous antioxidant enzyme expression.',
  },
  {
    rsid: 'rs602662',
    gene: 'FUT2',
    variant_name: 'FUT2 rs602662',
    chromosome: '19',
    position: 49206172,
    category: 'nutrient',
    risk_allele: 'A',
    normal_genotype: 'GG',
    description:
      'The rs602662 variant in FUT2 (fucosyltransferase 2) is strongly associated with secretor status, which determines whether ABO blood group antigens and certain other glycoconjugates are secreted into bodily fluids. The A allele is associated with non-secretor or reduced-secretor status, which alters the intestinal glycocalyx and affects both microbial attachment and intrinsic factor binding to cobalamin.',
    clinical_significance:
      'FUT2 non-secretors have impaired vitamin B12 absorption due to altered intrinsic factor-B12 complex processing in the terminal ileum, placing them at higher risk for B12 deficiency even with adequate dietary intake. Non-secretors also have an altered gut microbiome composition (reduced Bifidobacterium species) and altered susceptibility to certain pathogens (reduced Helicobacter pylori and norovirus attachment, but increased Candida risk).',
    actionable_recommendation:
      'Supplement with methylcobalamin in sublingual or injectable forms to bypass the impaired ileal absorption mechanism. Monitor serum B12 and methylmalonic acid levels annually — serum B12 may appear normal while functional deficiency (elevated MMA) is present. Bifidobacterium-containing probiotics may help restore microbiome balance associated with this variant.',
  },

  // ─── SLEEP ──────────────────────────────────────────────────────────────────
  {
    rsid: 'rs1801260',
    gene: 'CLOCK',
    variant_name: 'CLOCK 3111T>C',
    chromosome: '4',
    position: 56292983,
    category: 'sleep',
    risk_allele: 'C',
    normal_genotype: 'TT',
    description:
      'The 3111T>C variant in the 3\'UTR of the CLOCK gene (Circadian Locomotor Output Cycles Kaput) is one of the most studied variants affecting circadian rhythm periodicity. CLOCK forms a core component of the molecular clock transcription-translation feedback loop. The C allele is associated with longer intrinsic circadian period and delayed phase preference.',
    clinical_significance:
      'Carriers of the C allele show a preference for later sleep and wake times (evening chronotype), increased total sleep time on free schedules, and greater difficulty functioning on early social schedules (social jetlag). This variant has been associated with seasonal affective disorder susceptibility, bipolar disorder, binge eating in obesity, and metabolic consequences of circadian misalignment.',
    actionable_recommendation:
      'Align lifestyle schedules with natural chronotype where possible, prioritizing consistent sleep timing over forcing early rising. Bright light therapy in the morning (10,000 lux for 20–30 minutes) can help advance the circadian phase if an earlier schedule is necessary. Avoid bright artificial light (especially blue light) after 9 PM. Melatonin taken 1–2 hours before desired sleep time can assist phase shifting.',
  },
  {
    rsid: 'rs6265',
    gene: 'BDNF',
    variant_name: 'BDNF Val66Met',
    chromosome: '11',
    position: 27658369,
    category: 'sleep',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The Val66Met variant (rs6265) in the BDNF gene substitutes valine with methionine at position 66 in the prodomain of brain-derived neurotrophic factor. This substitution impairs the activity-dependent secretion of BDNF from neurons (reducing secretion by ~30%) without affecting constitutive secretion, resulting in lower synaptic BDNF availability during neuronal activity.',
    clinical_significance:
      'Reduced activity-dependent BDNF secretion is associated with impaired hippocampal neuroplasticity, reduced episodic memory, increased anxiety and depression vulnerability, poorer cognitive resilience to stress, and reduced response to antidepressant treatments. Relevant to sleep, lower BDNF signaling is associated with impaired slow-wave sleep quality and reduced hippocampal memory consolidation during sleep.',
    actionable_recommendation:
      'Aerobic exercise is the most potent known inducer of BDNF expression and can significantly upregulate brain BDNF even in Met allele carriers. Omega-3 fatty acids (DHA in particular) support BDNF synthesis and signaling. Intermittent fasting protocols have also shown BDNF-boosting effects. Prioritize sleep quality (7–9 hours with adequate deep sleep) as BDNF is critical for memory consolidation.',
  },
  {
    rsid: 'rs1800544',
    gene: 'ADRA2A',
    variant_name: 'ADRA2A -1291C>G',
    chromosome: '10',
    position: 112837290,
    category: 'sleep',
    risk_allele: 'C',
    normal_genotype: 'GG',
    description:
      'The -1291C>G promoter variant in ADRA2A (alpha-2A adrenergic receptor) affects receptor expression levels. The C allele is associated with higher ADRA2A promoter activity and increased receptor density on presynaptic neurons, which enhances autoinhibition of norepinephrine release from the locus coeruleus, the brain\'s primary noradrenergic nucleus governing arousal.',
    clinical_significance:
      'Altered norepinephrine autoinhibition via ADRA2A affects vigilance, attention, and sleep architecture. The variant has been associated with ADHD susceptibility (altered prefrontal noradrenergic tone), insomnia, and differential response to alpha-2 agonist medications (e.g., guanfacine, clonidine used for ADHD and sleep). It also affects stress response magnitude and recovery.',
    actionable_recommendation:
      'Establish a consistent pre-sleep routine that reduces adrenergic arousal: dim lighting 2 hours before bed, cool sleeping environment (65–68°F), avoidance of stimulating activities and screens. Magnesium glycinate at bedtime supports neurological relaxation by antagonizing NMDA receptors and reducing noradrenergic tone. Stress management practices (meditation, yoga, HRV biofeedback) are particularly beneficial.',
  },

  // ─── FITNESS ────────────────────────────────────────────────────────────────
  {
    rsid: 'rs1815739',
    gene: 'ACTN3',
    variant_name: 'ACTN3 R577X',
    chromosome: '11',
    position: 66560624,
    category: 'fitness',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The R577X variant (rs1815739) in ACTN3 introduces a premature stop codon, abolishing alpha-actinin-3 protein expression in homozygous XX individuals. Alpha-actinin-3 is exclusively expressed in fast-twitch (type IIx) muscle fibers and plays a structural role in the sarcomeric Z-disk, essential for the high-force, high-speed contractions characteristic of power and sprint performance.',
    clinical_significance:
      'Homozygous XX individuals lack functional alpha-actinin-3, resulting in a shift toward slower, more oxidative fiber type characteristics — enhanced aerobic endurance capacity but reduced peak power output. XX individuals are significantly underrepresented among elite power and sprint athletes. However, they show metabolic advantages including more efficient energy utilization at submaximal intensities and superior resistance to muscle damage from endurance exercise.',
    actionable_recommendation:
      'Training programs should embrace higher volume, endurance-oriented protocols with progressive overload rather than pure power or explosive speed development. Recovery between high-intensity sessions is typically faster. Resistance training remains important but consider emphasizing metabolic conditioning, muscular endurance rep ranges (12–20 reps), and aerobic base development. This genotype often excels in long-duration sports.',
  },
  {
    rsid: 'rs2802292',
    gene: 'FOXO3',
    variant_name: 'FOXO3 rs2802292',
    chromosome: '6',
    position: 108882952,
    category: 'fitness',
    risk_allele: 'T',
    normal_genotype: 'GG',
    description:
      'The rs2802292 variant in FOXO3 (forkhead box O3), a transcription factor in the FOXO family downstream of the insulin/IGF-1/PI3K/Akt signaling pathway, has been repeatedly associated with human longevity in multiple independent centenarian studies across diverse ethnic populations. The T allele is the longevity-associated variant, though the mechanistic explanation is still under investigation.',
    clinical_significance:
      'FOXO3 regulates a broad transcriptional program including oxidative stress resistance (via SOD2, catalase upregulation), DNA damage repair, apoptosis, cell cycle arrest, and autophagy. The longevity-associated T allele is thought to be more resistant to Akt-mediated nuclear export, maintaining FOXO3 transcriptional activity and cellular stress resilience. Carriers show associations with reduced cardiovascular disease and overall mortality.',
    actionable_recommendation:
      'Lifestyle factors that activate FOXO3 signaling align with longevity best practices: caloric restriction or intermittent fasting, regular aerobic exercise, and minimizing chronic hyperinsulinemia. Resveratrol and other SIRT1 activators can synergize with FOXO3 pathways. Prioritize recovery and sleep quality, as FOXO3-mediated repair processes are most active during sleep and low-insulin states.',
  },

  // ─── IMMUNE ─────────────────────────────────────────────────────────────────
  {
    rsid: 'rs10156191',
    gene: 'AOC1',
    variant_name: 'DAO rs10156191',
    chromosome: '7',
    position: 95766635,
    category: 'immune',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The rs10156191 variant in AOC1 (amine oxidase copper-containing 1, encoding diamine oxidase / DAO) reduces the expression or activity of DAO, the primary enzyme responsible for extracellular histamine catabolism in the intestinal mucosa. DAO breaks down ingested histamine in the gut before it can enter systemic circulation.',
    clinical_significance:
      'Reduced DAO activity impairs histamine clearance from the gut, allowing elevated luminal and systemic histamine levels after consumption of histamine-rich foods. This manifests as histamine intolerance — a syndrome including flushing, headache, rhinitis, urticaria, tachycardia, abdominal pain, and diarrhea. The condition is often misdiagnosed as food allergy or IBS.',
    actionable_recommendation:
      'Follow a low-histamine diet, avoiding aged cheeses, fermented foods, wine, cured meats, and spinach. Supplemental DAO enzyme (from porcine kidney extract) taken before histamine-rich meals can significantly reduce symptoms. Vitamin B6 (P5P), vitamin C, and copper are DAO cofactors and should be maintained at adequate levels. Antihistamines (H1 blockers) provide symptomatic relief for breakthrough reactions.',
  },
  {
    rsid: 'rs1049793',
    gene: 'AOC1',
    variant_name: 'DAO rs1049793',
    chromosome: '7',
    position: 95764387,
    category: 'immune',
    risk_allele: 'C',
    normal_genotype: 'GG',
    description:
      'The rs1049793 variant in AOC1 (DAO gene) is a second functionally impactful variant in the DAO locus, independently associated with reduced diamine oxidase enzyme activity. When co-inherited with rs10156191, the two variants compound the reduction in DAO capacity, substantially worsening histamine clearance from the intestinal epithelium.',
    clinical_significance:
      'Reduced DAO activity from this variant increases susceptibility to histamine accumulation after dietary exposure. Symptoms of histamine intolerance can affect multiple organ systems including dermatological (hives, eczema), respiratory (rhinitis, asthma-like symptoms), gastrointestinal (bloating, diarrhea), and neurological (migraine, brain fog). Many individuals go years without a correct diagnosis.',
    actionable_recommendation:
      'In addition to dietary histamine restriction, identify and avoid DAO-blocking compounds including alcohol (particularly wine and beer), certain medications (NSAIDs, metoclopramide, verapamil), and high doses of histamine-liberating foods (shellfish, strawberries, tomatoes). Keep a detailed food-symptom diary to identify personal threshold levels. Gut inflammation worsens DAO activity and should be addressed.',
  },
  {
    rsid: 'rs1050891',
    gene: 'HNMT',
    variant_name: 'HNMT Thr105Ile',
    chromosome: '2',
    position: 138476031,
    category: 'immune',
    risk_allele: 'T',
    normal_genotype: 'CC',
    description:
      'The Thr105Ile variant (rs1050891) in HNMT (histamine N-methyltransferase) reduces the enzyme\'s catalytic efficiency for intracellular histamine methylation, the primary pathway for histamine degradation within cells (as opposed to DAO\'s extracellular role). HNMT methylates histamine to 1-methylhistamine using SAM as the methyl donor, enabling urinary excretion.',
    clinical_significance:
      'Reduced HNMT activity impairs intracellular histamine clearance, particularly in the brain (where DAO expression is minimal and HNMT is the dominant histamine-degrading enzyme), airways, kidneys, and blood cells. This can elevate neurological histamine exposure, contributing to neurological symptoms of histamine intolerance including migraine, impaired cognitive function, sleep disturbance, and mood effects. The variant also interacts with methylation pathway status.',
    actionable_recommendation:
      'Support HNMT function through adequate SAM availability — which requires optimal methylation pathway support (methylfolate, methylcobalamin). Avoid histamine triggers including alcohol, which competitively inhibits HNMT. Low-histamine dietary approaches and DAO supplementation before meals reduce the histamine burden entering the intracellular environment. Monitor for neurological histamine symptoms particularly in the evening when histamine peaks.',
  },
];

export function getSnpByRsid(rsid: string): SnpReference | undefined {
  return SNP_DATABASE.find((snp) => snp.rsid.toLowerCase() === rsid.toLowerCase());
}

export function getSnpsByCategory(category: SnpCategory): SnpReference[] {
  return SNP_DATABASE.filter((snp) => snp.category === category);
}
