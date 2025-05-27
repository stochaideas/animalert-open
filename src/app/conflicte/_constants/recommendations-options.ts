// Data structure
export type SectionItem = string | { text: string; sublist: string[] };

type Section = {
  title?: string;
  items: SectionItem[];
};

type AnimalRecommendation = {
  emoji: string;
  name: string;
  scientificName: string;
  sections: Section[];
};

export const recommendationsOptions: AnimalRecommendation[] = [
  {
    emoji: "🦊",
    name: "Vulpe",
    scientificName: "Vulpes vulpes",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Vulpile au devenit din ce în ce mai prezente în proximitatea localităților umane din cauza reducerii și fragmentării habitatelor naturale. Zona urbană oferă acces ușor la hrană sub formă de resturi alimentare, păsări de curte, ouă sau chiar animale mici. Dacă sunt hrănite în mod repetat de oameni, își pierd frica naturală și pot reveni des, dezvoltând o rutină de vizitare a gospodăriilor.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Sunt animale de obicei nocturne, foarte inteligente și adaptabile.",
          "Evită în mod natural oamenii, dar pot părea îndrăznețe dacă sunt obișnuite cu prezența umană.",
          "Pot deveni defensive dacă sunt încolțite, bolnave (ex. rabie) sau dacă au pui.",
          "Contribuie la menținerea echilibrului ecologic prin controlul populației de rozătoare.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu le hrăni niciodată – vor reveni și vor asocia oamenii cu hrana.",
          "Nu le alunga cu obiecte sau prin metode violente.",
          "Nu folosi capcane, otravă sau alte metode letale – constituie braconaj și e sancționat penal.",
          "Nu încerca să le prinzi sau să le duci în altă parte – nu se adaptează ușor și pot reveni.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Păstrează distanța, dar nu fugi – stai în picioare, fă-te vizibil, menține contactul vizual.",
          "Ridică mâinile, strigă, fă zgomot – fluier, bătăi din palme, obiecte care zdrăngăne.",
          "Poți stropi animalul cu apă (furtun, sticlă) pentru a-l îndepărta.",
          "Asigură-te că nu se ascunde în curte sau sub construcții temporare.",
          "Contactează echipa AnimAlert dacă observi comportament anormal (ex. mers în cerc, letargie, agresivitate).",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Montează tomberoane cu capac închis ermetic (model anti-urs).",
          "Împrejmuiește zona păsărilor cu gard solid, verifică să nu existe spărturi.",
          "Instalează lumini cu senzor de mișcare în zonele sensibile.",
          "Ține animalele gospodărești în adăposturi bine protejate, mai ales noaptea.",
          "Poți utiliza sperietori (figuri umane improvizate) sau aparate sonore.",
          "Câinii și măgarii sperie vulpile în mod natural.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Capturarea, rănirea, otrăvirea sau sperierea violentă a animalelor sălbatice este interzisă.",
          "Legea 205/2004 privind protecția animalelor și OUG 57/2007 privind protecția mediului interzic aceste practici.",
          "Vulpile nu sunt considerate „dăunători” în sensul legal.",
          "Braconajul se pedepsește cu amendă sau chiar închisoare.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "Poliția – Direcția pentru Protecția Animalelor.",
          "Primăria și fondul de vânătoare limitrof.",
          "Raportează în aplicația AnimAlert pentru urmărirea cazului.",
        ],
      },
    ],
  },
  {
    emoji: "🦌",
    name: "Căprioară",
    scientificName: "Capreolus capreolus",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Căprioarele pot fi observate în apropierea localităților, în special în zonele cu păduri sau pășuni învecinate. Se apropie de grădini și livezi, mai ales în perioadele cu hrană redusă (secetă, iarnă). Mănâncă frunzele, scoarța, lăstarii, arbuștii ornamentali și pot distruge grădini întregi.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Sunt animale extrem de sperioase și evită contactul cu omul.",
          "Pot intra accidental în curți dacă se simt încolțite sau dacă gardurile sunt joase.",
          "Activitate mai intensă la apus și în zori.",
          "Puii de căprioară sunt adesea abandonați de oameni fără motiv – mama este aproape și revine după ce oamenii pleacă.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu te apropia de pui, chiar dacă par abandonați.",
          "Nu urmări căprioarele cu intenția de a le alunga – pot fugi și se pot răni.",
          "Nu hrăni căprioarele sălbatice – se vor obișnui și vor reveni constant.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Rămâi calm și tăcut.",
          "Nu te apropia – retrage-te ușor.",
          "Dacă intră într-o grădină, nu o bloca – lasă poarta deschisă și creează un spațiu de retragere.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Instalează gard de cel puțin 1,5 metri în jurul grădinilor.",
          "Plasează lumini cu senzor în zonele afectate.",
          "Câinii pot fi o descurajare eficientă (atenție să nu fie liberi, căprioarele pot muri de frică).",
          "Plantează gard viu dens, greu de traversat.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Este interzisă capturarea sau rănirea căprioarelor.",
          "Legea vânătorii (Legea 407/2006) reglementează strict orice intervenție.",
          "Nu este permisă relocarea fără autorizație de la autoritățile competente.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "Fondul de vânătoare din zonă.",
          "Garda Forestieră / Poliția Animalelor.",
          "Echipa AnimAlert – mai ales dacă animalul e rănit.",
        ],
      },
    ],
  },
  {
    emoji: "🐍",
    name: "Șarpe",
    scientificName: "Natrix natrix",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Șerpii ajung frecvent în zonele locuite de oameni deoarece caută hrană (rozătoare mici, broaște). Așezările umane, mai ales cele de la marginea pădurilor, le oferă adesea adăposturi și surse de hrană, cum ar fi șoproane, grămezi de lemne sau grădini. Panica apare din cauza lipsei de informare – cei mai mulți șerpi din România sunt complet inofensivi.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Neveninoși, timizi, evită omul.",
          "Nu atacă decât în situații extreme, când sunt călcați sau strânși.",
          "Se apără prin mușcătură rară, secreție urât mirositoare sau mimarea morții.",
          "Prezența lor e benefică: controlează populația de șoareci, șobolani, insecte.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu-i omorî – sunt protejați prin lege!",
          "Nu încerca să-i prinzi sau să-i „alungi” cu bățul – se pot apăra.",
          "Nu arunca cu obiecte, nu-i închide în recipiente.",
          "Nu folosi substanțe toxice în curte – afectează și fauna utilă.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Păstrează distanța – în mod normal se retrage singur.",
          "Dacă a intrat într-o anexă, lasă ușile deschise pentru retragere.",
          "Dacă nu iese, cheamă echipa AnimAlert – știm să-i capturăm fără daune.",
          "Nu te panica – nu reprezintă un pericol real.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Menține curățenia în curte, fără grămezi de lemne sau compost neacoperit.",
          "Ține iarba tunsă și verifică șoproanele des.",
          "Plasează plasă de sârmă la baza gardurilor.",
          "Asigură-te că nu există adăposturi de rozătoare (hrană pentru șerpi).",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Conform OUG 57/2007 și anexelor privind protecția biodiversității, mai multe specii de șerpi sunt protejate.",
          "Uciderea, capturarea, distrugerea habitatului – infracțiune.",
          "Amenzile pot depăși 3000 lei pentru fapte minore.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "Platforma AnimAlert pentru relocare umană.",
          "Garda de Mediu, dacă este specie protejată.",
          "ONG-uri locale de conservare herpetologică.",
        ],
      },
    ],
  },
  {
    emoji: "🦇",
    name: "Liliac",
    scientificName: "Myotis myotis, Nyctalus noctula",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Liliecii se adăpostesc în poduri, mansarde, clădiri abandonate sau chiar în spatele jaluzelelor. Aparenta lor „invazie” este adesea sezonieră, legată de perioadele de reproducere sau hibernare. Frica provine din mituri și lipsă de cunoaștere – nu se prind în păr, nu sug sânge și nu atacă.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Nocturni, insectivori – extrem de utili pentru om (mănâncă țânțari și alte insecte).",
          "Foarte sensibili la stres și la lumină.",
          "Comunică prin ultrasunete.",
          "Pot transmite boli doar dacă sunt manipulați direct și fără mănuși.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu atinge liliecii cu mâinile goale – mușcă și pot transmite rabie.",
          "Nu înlătura cu mătura sau cu obiecte – le poți rupe aripile.",
          "Nu-i evacua în timpul hibernării – pot muri.",
          "Nu bloca ieșirile dacă sunt activi – pot rămâne prinși.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Dacă este singur într-o cameră, deschide geamul larg și stinge lumina.",
          "Dacă nu iese, acoperă-l cu o cutie și cheamă specialiștii.",
          "Dacă e iarnă și hibernează în pod, nu-l deranja – astupă intrarea abia după plecare.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Montează plase la geamuri și aerisiri.",
          "Ține ferestrele închise noaptea în zonele frecventate.",
          "După plecarea coloniilor, astupă găurile de acces.",
          "Poți instala adăposturi speciale în afara casei.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Toate speciile de lilieci din România sunt protejate.",
          "Legea 49/2011 privind protecția habitatelor și Directiva Habitate UE impun interdicția deranjării acestora.",
          "Amenzile pot fi severe, iar ONG-urile de protecție monitorizează cazurile.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "AnimAlert sau ONG-uri specializate (ex: Milvus, Bat Conservation Romania).",
          "Garda de Mediu – pentru colonii mari sau în clădiri publice.",
        ],
      },
    ],
  },
  {
    emoji: "🐝",
    name: "Viespe",
    scientificName: "Vespula germanica, Vespula vulgaris",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Viespile devin un pericol în special vara, când își construiesc cuiburi în poduri, sub acoperișuri, în guri de aerisire sau în sol. Se apropie de oameni pentru hrană (fructe, sucuri, carne) și pot deveni agresive în apărarea cuibului.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Sunt teritoriale și pot înțepa în grup dacă simt pericolul.",
          "Spre deosebire de albine, pot înțepa de mai multe ori.",
          "Foarte atrase de zahăr și proteine.",
          "Nu atacă fără motiv – dar un gest brusc poate declanșa apărarea.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu arunca cu apă sau fum în cuib – le irită și le face agresive.",
          "Nu încerca să îndepărtezi cuibul fără protecție.",
          "Nu folosi foc, benzină, spray-uri improvizate – risc de incendiu și accident grav.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Dacă o viespe zboară în jurul tău, nu face mișcări bruște.",
          "Dacă ai un cuib aproape de casă, stai departe și evită zona.",
          "Apelează o firmă specializată în dezinsecție sau o echipă AnimAlert cu experiență.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Montează plase la geamuri, mai ales în bucătărie și mansardă.",
          "Nu lăsa mâncare afară, în special fructe coapte sau carne.",
          "Sigilează găurile și spațiile în care pot construi cuiburi.",
          "Verifică podul și anexa casei în fiecare vară.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Viespile nu sunt specie protejată.",
          "Totuși, intervențiile se fac doar dacă nu există risc pentru siguranță publică.",
          "În școli, spitale, instituții – trebuie notificată primăria sau DSP.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "Serviciul public de dezinsecție local.",
          "Platforma AnimAlert – putem interveni sau orienta către firme autorizate.",
        ],
      },
    ],
  },
  {
    emoji: "🐻",
    name: "Urs",
    scientificName: "Ursus arctos",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Creșterea numărului de conflicte cu urșii este strâns legată de accesul acestora la surse de hrană antropică: deșeuri menajere, resturi alimentare, hrănire intenționată. Urbanizarea și extinderea în zone de munte au redus habitatele naturale, forțând urșii să caute hrană aproape de localități. Zonele turistice, în special cele cu cabane, pubele deschise și grătare, atrag frecvent exemplare.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Ursul este în mod natural retras și evită omul.",
          "Poate deveni agresiv dacă e surprins, încolțit sau dacă își apără puii.",
          "Obiceiul de a reveni în locurile unde a găsit mâncare este greu de dezvățat.",
          "Poate parcurge kilometri zilnic în căutarea hranei.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu hrăni urșii sub nicio formă!",
          "Nu păstra mâncare afară, neacoperită.",
          "Nu face poze de aproape – nu e previzibil.",
          "Nu-l fugări sau încerca să-l sperii.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Nu fugi – declanșează instinctul de prădător.",
          "Stai calm, vorbește ferm și încearcă să te retragi încet.",
          "Fă-te mare, ridică brațele, nu întoarce spatele.",
          "Dacă ai spray pentru urși – folosește-l doar la distanță mică și cu vântul în spate.",
          "Sună imediat la 112 și marchează locul pe AnimAlert.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Tomberoane anti-urs (cu capac special).",
          "Garduri electrice pentru gospodării expuse.",
          "Nu lăsa resturi de grătar, pește, fructe.",
          "Câini bine dresați pot avertiza sau speria ursul (cazuri limitate).",
          "Grupuri în drumeții și zgomot constant (fluier, clopoței) pot preveni întâlnirea.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Ursul brun este specie strict protejată (anexa I OUG 57/2007).",
          "Este interzisă hărțuirea, hrănirea, alungarea, uciderea fără aviz de la Ministerul Mediului.",
          "Excepțiile se aplică doar în condiții de urgență, cu echipe specializate.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "112 pentru cazuri urgente.",
          "Garda de Mediu, Jandarmeria, Primăria.",
          "Echipa AnimAlert pentru documentare, informare, sprijin logistic.",
        ],
      },
    ],
  },
  {
    emoji: "🦡",
    name: "Bursuc",
    scientificName: "Meles meles",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Bursucii sunt mamifere omnivore care pot apărea în grădini sau curți de la marginea pădurii. Sunt atrași de compost, grămezi de resturi, mâncare pentru câini/pisici lăsată afară. Construiesc vizuini extinse și pot deranja grădinile sau terenurile agricole.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Nocturn, solitar, discret.",
          "Nu este agresiv, dar poate mușca dacă este prins.",
          "Se adaptează rapid la condiții urbane.",
          "Are rol important în aerarea solului, controlul insectelor și echilibrul ecosistemului.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu introduce obiecte în vizuină pentru a-l goni.",
          "Nu-l scoate forțat dintr-o ascunzătoare.",
          "Nu închide deschiderile în care se află fără o cale de ieșire.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Retrage-te ușor – nu va ataca.",
          "Dacă îl găsești rănit sau blocat, contactează echipele AnimAlert.",
          "Dacă sapă în locuri incomode, consultă experți pentru soluții umane.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Compostul trebuie păstrat în recipiente închise.",
          "Tomberoane sigilate.",
          "Garduri joase de sârmă îngropate 20 cm în sol împiedică accesul.",
          "Nu lăsa hrană afară peste noapte.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Specie protejată parțial.",
          "Nu se poate captura sau reloca fără aprobare.",
          "Legea 407/2006 și OUG 57/2007 oferă protecție parțială.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "Direcția Silvică sau Garda de Mediu.",
          "Platforma AnimAlert pentru raportare și consiliere.",
        ],
      },
    ],
  },
  {
    emoji: "🐗",
    name: "Mistreț",
    scientificName: "Sus scrofa",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Mistreții coboară frecvent în orașe, sate, cartiere mărginașe sau terenuri agricole, mai ales noaptea. Aceste incursiuni sunt determinate de lipsa hranei, secetă sau obiceiul de a fi hrăniți. Poate provoca distrugeri masive la culturile agricole și grădini.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Poate deveni periculos dacă este rănit, încolțit sau dacă are purcei.",
          "Are miros și auz bune, dar vederea este slabă.",
          "Se adaptează foarte bine în zone semiurbane.",
          "Poate fi prezent chiar și în parcuri urbane mari.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu te apropia – poate ataca în viteză.",
          "Nu-l hrăni – devine dependent.",
          "Nu-l speria – poate produce pagube în fugă.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Păstrează distanța.",
          "Urcă pe un obiect înalt sau ascunde-te în spatele unui copac sau obstacol.",
          "Evită zgomotele bruște.",
          "Nu alerga – poate reacționa agresiv.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Garduri solide în zonele agricole.",
          "Tunuri cu gaz (emisii sonore programate).",
          "Câini bine antrenați pentru supraveghere.",
          "Păstrarea gunoiului în containere închise.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Vânătoarea se face doar în sezon și cu autorizație.",
          "Intervenția în intravilan se face doar cu aprobarea autorităților.",
          "Braconajul este sancționat penal.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "Fondul de vânătoare, Garda Forestieră.",
          "Primăria locală.",
          "Echipa AnimAlert pentru consiliere și raportare.",
        ],
      },
    ],
  },
  {
    emoji: "🐾",
    name: "Nevăstuică, dihor, jder, vidră",
    scientificName: "Familia Mustelidae",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Mustelidele sunt carnivore mici, adaptabile, care trăiesc aproape de așezări umane din cauza declinului habitatului și a ușurinței cu care pot găsi hrană (pui de găină, ouă, resturi alimentare). Pot pătrunde în poduri, grajduri, cuști de păsări sau șoproane, lăsând urme de miros și uneori provocând daune.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Nocturne, teritoriale, solitare.",
          "Foarte agile, pot escalada pereți sau garduri.",
          "Nevăstuica – cea mai mică și feroce; jderul – frecvent în poduri; vidra – strict acvatică.",
          "Joacă un rol vital în echilibrul natural, reducând rozătoarele și șoarecii.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu le captura cu capcane artizanale – este ilegal.",
          "Nu bloca găurile de acces dacă sunt în interior – se pot închide înăuntru.",
          "Nu încerca să le omori – unele sunt strict protejate (ex: vidra).",
        ],
      },
      {
        title: "✅ Ce să faci în caz de întâlnire",
        items: [
          "Ascultă zgomote de tip „ronțăit” sau „fâșâit” în poduri – pot indica un jder.",
          "Dacă ai găini atacate noaptea, montează camere și protejează-le.",
          "Apelează la experți (AnimAlert) pentru relocare.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Sigilează podurile, acoperișurile și beciurile.",
          "Folosește plase metalice la cuști.",
          "Întărește colțurile gardului.",
          "Nu lăsa hrană de animale peste noapte afară.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Vidra și jderul de pădure sunt specii protejate (anexele OUG 57/2007).",
          "Capturarea sau uciderea lor este infracțiune.",
          "Relocarea necesită aviz special.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "AnimAlert – relocare umană și consultanță.",
          "Garda de Mediu, Direcția Silvică pentru cazuri grave.",
        ],
      },
    ],
  },
  {
    emoji: "🐦",
    name: "Rândunică, lăstun",
    scientificName: "Hirundo rustica, Delichon urbicum",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Rândunicile își fac cuiburi sub streșinile caselor, blocurilor, balcoanelor. Excrementele produse pot deranja vizual sau olfactiv vecinii, iar distrugerea cuiburilor a devenit un conflict social frecvent.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Migratoare, sosesc primăvara și stau până toamna.",
          "Își refolosesc cuiburile ani la rând.",
          "Extrem de utile – consumă zilnic sute de insecte zburătoare.",
          "Specii strict protejate în România.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu dărâma cuiburile – este infracțiune!",
          "Nu monta plase sau țepi în timpul sezonului de cuibărit.",
          "Nu deranja păsările la cuib – pot abandona ouăle sau puii.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de disconfort",
        items: [
          "Instalează tăvițe de colectare sub cuiburi.",
          "Curăță zona cu apă și săpun după sezon.",
          "Educă vecinii asupra importanței lor ecologice.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Montează panouri de protecție sau tavă absorbantă sub cuib.",
          "Aplică vopsea lavabilă ușor de curățat în zona de sub cuib.",
          "În afara sezonului, poți astupa găurile care oferă acces.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Strict protejate (Legea 13/1993 și OUG 57/2007).",
          "Amenzile pentru distrugerea cuiburilor pot depăși 5000 lei.",
        ],
      },
      {
        title: "📢 Cui să te adresezi",
        items: [
          "AnimAlert – informare, materiale educative.",
          "Garda de Mediu pentru cazuri de distrugere.",
        ],
      },
    ],
  },
  {
    emoji: "🐦",
    name: "Cioară, stăncuță, corb",
    scientificName: "Corvus spp.",
    sections: [
      {
        title: "📍 Contextul conflictelor",
        items: [
          "Specii foarte inteligente, gregare, care formează colonii în orașe și se hrănesc din tomberoane sau de pe câmpuri. Pot face gălăgie, pot ataca coșuri de gunoi și pot apărea în parcuri sau pe acoperișuri.",
        ],
      },
      {
        title: "🔍 Comportament și particularități",
        items: [
          "Ciorile și stăncuțele sunt adaptate urbanului.",
          "Corbii sunt mai retrași, preferând marginea pădurii.",
          "Formează cupluri stabile și își apără teritoriul.",
        ],
      },
      {
        title: "⚠️ Ce să NU faci",
        items: [
          "Nu arunca cu obiecte în cuiburi – sunt protejate.",
          "Nu le hrăni deliberat – pot deveni dependente.",
        ],
      },
      {
        title: "✅ Ce să faci în caz de disconfort",
        items: [
          "Folosește metode acustice (zgomote neplăcute, sisteme cu ultrasunete).",
          "Reorientează sursele de hrană.",
          "Dacă e cazul, consultă autorități pentru îndepărtare legală a cuiburilor după sezon.",
        ],
      },
      {
        title: "🛠️ Prevenirea conflictelor",
        items: [
          "Tomberoane închise.",
          "Curățenie în parcuri și piețe.",
          "Control asupra surselor de hrană.",
        ],
      },
      {
        title: "⚖️ Aspecte legale",
        items: [
          "Protejate în afara sezonului de vânătoare (anexa II).",
          "Cuiburile active nu pot fi distruse fără aviz.",
        ],
      },
    ],
  },
  {
    emoji: "🕊️",
    name: "Porumbel de oraș",
    scientificName: "Columba livia domestică",
    sections: [
      {
        items: ["Produce murdărie și poate transmite boli."],
      },
      {
        items: ["Nu distruge cuiburile active!"],
      },
      {
        items: [
          "Plasează plase de protecție, țepi și nu lăsa resturi alimentare în balcoane.",
        ],
      },
      {
        items: ["Protecție legală redusă, dar necesită tratament uman."],
      },
    ],
  },
  {
    emoji: "🦉",
    name: "Huhurez, ciuf de pădure, bufniță",
    scientificName: "Strix aluco, Asio otus etc.",
    sections: [
      {
        items: ["Nocturni, cuibăresc în poduri sau arbori din curți."],
      },
      {
        items: [
          "Provoacă zgomot noaptea, dar sunt foarte utili (hrănesc cu șoareci).",
        ],
      },
      {
        items: ["Protejați integral."],
      },
      {
        items: [
          "Nu deranjați – apelăm la echipe specializate pentru relocare doar în cazuri extreme.",
        ],
      },
    ],
  },
  {
    emoji: "🐦‍⬛",
    name: "Barză",
    scientificName: "Ciconia ciconia",
    sections: [
      {
        items: ["Cuibărește pe stâlpi, acoperișuri."],
      },
      {
        items: ["Cuibul mare poate deranja prin excremente, vegetație cărată."],
      },
      {
        items: [
          "Nu se distruge fără aviz de la Mediu + firma de transport energie (Electrica)!",
        ],
      },
      {
        items: ["Poți cere montarea unui suport de cuib."],
      },
    ],
  },
  {
    emoji: "🐦",
    name: "Pescăruș, corcodel mic",
    scientificName: "Larus spp., Tachybaptus ruficollis",
    sections: [
      {
        items: ["Cuibăresc în zone lacustre sau pe acoperișuri."],
      },
      {
        items: ["Gălăgioși, uneori agresivi în apărarea cuiburilor."],
      },
      {
        items: ["Nu se ating – sunt protejați integral."],
      },
      {
        items: ["Sfat: informare, educare, observare pasivă."],
      },
    ],
  },
];
