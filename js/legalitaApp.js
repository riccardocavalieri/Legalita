var app = angular.module('legalitaGameApp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", { templateUrl: "views/home.html" })
    .when("/tema", { templateUrl: "views/tema.html" })
    .when("/temaIntro", { templateUrl: "views/tema-intro.html" })
    .when("/avatar", { templateUrl: "views/avatar.html" })
    .when("/gioco", { templateUrl: "views/gioco.html" })
    .when("/fine", { templateUrl: "views/fine.html" })
    ;

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});


app.config([
		'$compileProvider',
		function ($compileProvider) {
		    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|mailto|chrome-extension):/);
		    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob|mailto|chrome-extension):/);
		}
]);


app.service('UserProfileService', UserProfileService);




function UserProfileService() {

    var profile;

    if (!profile) {
        profile = {
            lives: 5,
            points: 0,
            avatar: null,
            currentTema: null,
            domandaCorrente: null,
            domandePrecedenti: [],
            prossimaDomanda: null,
            decreaseLives: function () { if (this.lives > 0) this.lives--; },
            addPoint: function () { this.points++; },
            reset: function () {
                this.lives = 5;
                this.points = 0;
                this.avatar = null;
                this.currentTema = null;
                this.domandaCorrente = null;
                this.domandePrecedenti = [];
                this.prossimaDomanda = null;
            }
        }
    };

    return profile;
}

app.controller('HomeController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {

        $scope.Profile = UserProfileService;
        $scope.Profile.reset();
    }]);


app.controller('AvatarController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {

        $scope.Profile = UserProfileService;

        $scope.AvatarDisponibili = avatars;

        $scope.setAvatar = function (avatarId) {
            $scope.Profile.avatar = $scope.AvatarDisponibili[avatarId - 1];
        };
}]);

app.controller('TemaController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {

        $scope.Profile = UserProfileService;

        $scope.temiDisponibili = temi;

        $scope.setTema = function (temaId) {
            $scope.Profile.currentTema = $scope.temiDisponibili[temaId - 1];
        };
    }]);

app.controller('TemaIntroController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {

        $scope.Profile = UserProfileService;

    }]);

app.controller('QuizController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {
        $scope.HaRisposto = false;
        $scope.HaRispostoCorrettamente = false;
        $scope.Approfondimento = "";
        $scope.ProssimaPagina = "";
        

        $scope.GetCssVita = function (index) {
            return (index <= $scope.Profile.lives) ? "vivo" : "morto";
        };

        $scope.Rispondi = function (risposta) {
            $scope.HaRisposto = true;
            $scope.Profile.domandePrecedenti.push($scope.Profile.domandaCorrente.id);
            $scope.HaRispostoCorrettamente = (risposta == $scope.Profile.domandaCorrente.rispostaCorretta);
            if (!$scope.HaRispostoCorrettamente) {
                $scope.Profile.decreaseLives();
            }
            else {
                $scope.Profile.addPoint();
            }
        };

        $scope.Reload = function () {

            if ($scope.Profile.lives == 0) {
                $scope.ProssimaPagina = "/fine";
                return;
            }
            
            $scope.Profile.domandaCorrente = GetDomandaCorrente($scope.Profile);
            if ($scope.Profile.domandaCorrente || $scope.Profile.currentTema.id != $scope.Profile.domandaCorrente.temaId) {
                $scope.Profile.currentTema = temi[$scope.Profile.domandaCorrente.temaId - 1];
            }
            $scope.Profile.prossimaDomanda = GetProssimaDomanda($scope.Profile);
            $scope.HaRisposto = false;
            $scope.HaRispostoCorrettamente = false;
            $scope.Approfondimento = $scope.Profile.domandaCorrente.linkApprofondimento != null && $scope.Profile.domandaCorrente.linkApprofondimento != "";
            $scope.ProssimaPagina = (!$scope.Profile.prossimaDomanda || $scope.Profile.lives == 0) ? "/fine" : "/gioco";
        };

        $scope.Profile = UserProfileService;
        $scope.Reload();
    }]);

app.controller('FineController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {

        $scope.Profile = UserProfileService;

        $scope.GetCssVita = function (index) {
            return (index <= $scope.Profile.lives) ? "vivo" : "morto";
        };

        $scope.Commento = function () {
            if ($scope.Profile.points <= 5)
                return "Peggio di cos\u00ec era difficile!";

            if ($scope.Profile.points <= 10)
                return "Potevi fare meglio!";

            if ($scope.Profile.points <= 15)
                return "Bravo, ma puoi migliorare!";

            if ($scope.Profile.points <= 20)
                return "Complimenti. Molto bene!";

            if ($scope.Profile.points <= 25)
                return "Bravissimo!";

            return "";
        };
    }]);


function GetDomandaCorrente(profile) {
    if (!profile.domandaCorrente || !profile.domandaCorrente.id) {
        return domande.filter(function (obj) { return (obj.temaId == profile.currentTema.id); })[0];
    }
    else {
        return GetProssimaDomanda(profile);
    }
}

function GetProssimaDomanda(profile) {
    if (!profile.domandaCorrente || !profile.domandaCorrente.id) {
        return;
        // dovrebbe tirare un eccezione
    }

    // se non ci sono altre domande mi fermo
    if (domande.length == profile.domandaCorrente.id && domande.length == profile.domandePrecedenti.length)
        return null;

    // se sono all'ultima domanda ma non ho iniziato dal primo tema
    if (domande.length == profile.domandaCorrente.id && domande.length > profile.domandePrecedenti.length)
        return domande[0];

    return domande.filter(function (obj) { return (obj.id == profile.domandaCorrente.id + 1); })[0];
}

var domande = [
    /* SCUOLA */
    {
        id: 1,
        temaId: 1,
        domanda: "Scopri che alle elezioni dei rappresentanti di classe vengono manipolati i voti, cosa decidi di fare?",
        img: "img/foto-1.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "Se l'esito mi aggrada non faccio nulla." },
            { id: "B", risposta: "Mi rivolgo agli insegnanti." },
            { id: "C", risposta: "Lancio il cancellino contro i compagni eletti." },
            { id: "D", risposta: "Cerco di capire chi \u00e8 stato." }
        ]
    },
    {
        id: 2,
        temaId: 1,
        domanda: "All'interno della tua scuola trovi un muro crepato, che nessuno ha intenzione di riparare: come agisci?",
        img: "img/foto-2.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "Comunico la situazione al preside attraverso il comitato studenti." },
            { id: "B", risposta: "Lascio perdere, non vorrei pagare io i costi di riparazione o prendermi la colpa!" },
            { id: "C", risposta: "Cerco di far commissionare il lavoro a un'impresa di miei parenti." },
            { id: "D", risposta: "Rompo ulteriormente il muro." }
        ]
    },
    {
        id: 3,
        temaId: 1,
        domanda: "Un ragazzo viene accusato e punito per un graffito sulla facciata della scuola. Tu per\u00f2 vieni a sapere che \u00e8 stato un tuo amico: come ti comporti?",
        img: "img/foto-3.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "C",
        risposte: [
            { id: "A", risposta: "Apprezzo il graffito, perch\u00e9 mi piace l'arte illegale." },
            { id: "B", risposta: "Non faccio nulla, gli amici prima di tutto." },
            { id: "C", risposta: "Parlo con il mio amico per farlo confessare e poi con gli insegnanti." },
            { id: "D", risposta: "Parlo direttamente con gli insegnati denunciando l'accaduto." }
        ]
    },
    {
        id: 4,
        temaId: 1,
        domanda: "Se vedi un tuo compagno di classe che usa violenza contro un ragazzino pi\u00f9 piccolo, che cosa fai?",
        img: "img/foto-4.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "Uso violenza anche io perch\u00e9 faccio parte del branco." },
            { id: "B", risposta: "Lo fermo o chiamo un insegnante." },
            { id: "C", risposta: "Lo incito." },
            { id: "D", risposta: "Riprendo il tutto con il cellulare e lo metto su Internet." }
        ]
    },
    {
        id: 5,
        temaId: 1,
        domanda: "A scuola scopri che un tuo compagno sta facendo girare su WhatsApp una foto ridicola di un altro alunno senza il suo consenso: che cosa fai?",
        img: "img/foto-5.jpg",
        linkApprofondimento: "http://scuola.regione.emilia-romagna.it/qualificazione-scolastica/educazione-alla-cittadinanza-attiva/sicurezza-e-legalita",
        rispostaCorretta: "C",
        risposte: [
            { id: "A", risposta: "Ti disinteressi, non \u00e8 tuo amico." },
            { id: "B", risposta: "Fai girare anche tu quella foto." },
            { id: "C", risposta: "Segnali che si tratta di un reato." },
            { id: "D", risposta: "Ne salvi una copia sul telefono." }
        ]
    },

    /* SOCIAL NETWORK */
    {
        id: 6,
        temaId: 2,
        domanda: "Ho fatto una foto assieme a una mia amica e la pubblico senza chiederle il permesso:",
        img: "img/foto-6.jpg",
        linkApprofondimento: "http://www.dirittierisposte.it/Schede/Tutela-della-privacy/Diritti/la_privacy_nei_social_media_id1129494_art.aspx",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "rischio una denuncia" },
            { id: "B", risposta: "non mi succede nulla... tanto \u00e8 solo una foto!" },
            { id: "C", risposta: "\u00e8 sufficiente non taggarla" },
            { id: "D", risposta: "le faccio passare l'arrabbiatura mostrandole i like ottenuti" }
        ]
    },
    {
        id: 7,
        temaId: 2,
        domanda: "Se mio fratello crea un profilo falso per rimorchiare online spacciandosi per qualcun altro, in cosa si imbatte?",
        img: "img/foto-7.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "trova un sacco di belle ragazze, quasi quasi ne apro uno anche io!" },
            { id: "B", risposta: "rischia una denuncia per sostituzione di persona." },
            { id: "C", risposta: "qualcuno potrebbe scoprirlo e umiliarlo." },
            { id: "D", risposta: "la situazione potrebbe scappargli di mano." }
        ]
    },
    {
        id: 8,
        temaId: 2,
        domanda: "Qual \u00e8 l'et\u00e1 minima per poter aprire un profilo sui principali social network?",
        img: "img/foto-8.jpg",
        linkApprofondimento: "C",
        rispostaCorretta: "",
        risposte: [
            { id: "A", risposta: "35/40 anni" },
            { id: "B", risposta: "8/10 anni" },
            { id: "C", risposta: "13/14 anni" },
            { id: "D", risposta: "18 anni" }
        ]
    },
    {
        id: 9,
        temaId: 2,
        domanda: "Tua cugina continua a ricevere messaggi da uno sconosciuto con domande personali, che cosa le consigli?",
        img: "img/foto-9.jpg",
        linkApprofondimento: "https://www.commissariatodips.it/approfondimenti/social-network/approfondimenti-normativi.html",
        rispostaCorretta: "D",
        risposte: [
            { id: "A", risposta: "Smettere di usare Internet" },
            { id: "B", risposta: "Rispondere con informazioni false" },
            { id: "C", risposta: "Continuare a parlargli e fissare un appuntamento" },
            { id: "D", risposta: "Bloccare il contatto e segnalarlo" }
        ]
    },
    {
        id: 10,
        temaId: 2,
        domanda: "Se pubblichi su Snapchat un contenuto offensivo NON sei perseguibile dalla legge.",
        img: "img/foto-10.jpg",
        linkApprofondimento: "https://docs.google.com/viewer?a=v&pid=sites&srcid=ZGVmYXVsdGRvbWFpbnxhZ2VwaWFjZW56YTR8Z3g6MTUwYTQ3NTg0ZGFhMWYwMg",
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "\u00e8 vero" },
            { id: "B", risposta: "Falso, sono perseguibile penalmente" },
            { id: "C", risposta: "Dipende da chi offendo" },
            { id: "D", risposta: "Sono perseguibile solo mentre il contenuto \u00e8 online" }
        ]
    },


    /* MAFIA */
    {
        id: 11,
        temaId: 3,
        domanda: "L'Isis \u00e8 una mafia?",
        img: "img/foto-11.jpg",
        linkApprofondimento: "http://www.sapere.it/sapere/strumenti/domande-risposte/storia-civilta/che-cosa-e-isis.html",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "No, perch\u00e9 a differenza della mafia usa pretesti di stampo religioso." },
            { id: "B", risposta: "S\u00ec, \u00e8 una mafia perch\u00e9 protegge tutte le persone in cambio di denaro e benessere." },
            { id: "C", risposta: "S\u00ec, perch\u00e9 ha le stesse origini delle altre mafie." },
            { id: "D", risposta: "S\u00ec, perch\u00e9 diffonde terrore." }
        ]
    },
    {
        id: 12,
        temaId: 3,
        domanda: "Perch\u00e9 i cittadini non si ribellano alla mafia?",
        img: "img/foto-12.jpg",
        linkApprofondimento: "http://www.cortocircuito.re.it/",
        rispostaCorretta: "C",
        risposte: [
            { id: "A", risposta: "Perch\u00e9 hanno paura della polizia." },
            { id: "B", risposta: "Perch\u00e9 vorrebbero che la mafia continuasse a vivere." },
            { id: "C", risposta: "Non \u00e8 vero che non si ribellano, una parte di loro si ribella per rivendicare la propria libert\u00e1." },
            { id: "D", risposta: "Perch\u00e9 ci guadagnano." }
        ]
    },
    {
        id: 13,
        temaId: 3,
        domanda: "Quali tra questi comportamenti pu\u00f2 essere ritenuto mafioso?",
        img: "img/foto-13.jpg",
        linkApprofondimento: "http://www.addiopizzo.org/",
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "Rubare la ragazza o il ragazzo a qualcuno." },
            { id: "B", risposta: "Prendere la merenda a un ragazzo pi\u00f9 piccolo dopo averlo minacciato." },
            { id: "C", risposta: "Fare la spia o denunciare un fatto grave." },
            { id: "D", risposta: "Violare la privacy di un'altra persona." }
        ]
    },
    {
        id: 14,
        temaId: 3,
        domanda: "A che et\u00e1 un giovane entra nella mafia?",
        img: "img/foto-14.jpg",
        linkApprofondimento: "http://www.libera.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/1",
        rispostaCorretta: "C",
        risposte: [
            { id: "A", risposta: "A 11 anni." },
            { id: "B", risposta: "A 18 anni." },
            { id: "C", risposta: "Non c'\u00e8 un'et\u00e1." },
            { id: "D", risposta: "A 30 anni." }
        ]
    },
    {
        id: 15,
        temaId: 3,
        domanda: "Come si pu\u00f2 coinvolgere una persona nelle attivit\u00e1 mafiose?",
        img: "img/foto-15.jpg",
        linkApprofondimento: "http://www.regione.emilia-romagna.it/notizie/2016/ottobre/legalita-il-testo-unico-regionale-e-legge-lemilia-romagna-rafforza-la-lotta-alle-mafie-e-il-sostegno-alle-vittime",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "Promettendo soldi facili in cambio di favori." },
            { id: "B", risposta: "Attraverso una campagna di adesione volontaria." },
            { id: "C", risposta: "Approfittando del suo malessere o della sua solitudine." },
            { id: "D", risposta: "Si selezionano i pi\u00f9 meritevoli e li si invita." }
        ]
    },


    /* GIOCO D'AZZARDO */
    {
        id: 16,
        temaId: 4,
        domanda: "Che cos'\u00e8 il gioco d'azzardo?",
        img: "img/foto-16.jpg",
        linkApprofondimento: "http://www.harmoniamentis.it/cont/ludopatia-e-gioco-patologico/3279/definizione-gioco-azzardo-patologico.asp",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "Un'attivit\u00e1 in cui rischi di perdere beni e denaro." },
            { id: "B", risposta: "Un modo per guadagnare facilmente." },
            { id: "C", risposta: "Un gioco individuale contro la solitudine." },
            { id: "D", risposta: "Un'attivit\u00e1 che educa alla vita." }
        ]
    },
    {
        id: 17,
        temaId: 4,
        domanda: "Quale impatto ha il gioco d'azzardo sulla famiglia?",
        img: "img/foto-17.jpg",
        linkApprofondimento: "http://www.benessere.com/psicologia/arg00/dipendenza_gioco_azzardo.htm",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "Porta problemi emotivi, economici, sociali e di salute." },
            { id: "B", risposta: "Porta benefici e soldi extra." },
            { id: "C", risposta: "Solitamente non ha alcun effetto." },
            { id: "D", risposta: "Un consolidamento dei rapporti umani." }
        ]
    },
    {
        id: 18,
        temaId: 4,
        domanda: "Nel gioco d'azzardo, quando si supera il limite tra passione e dipendenza?",
        img: "img/foto-18.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "D",
        risposte: [
            { id: "A", risposta: "Quando finisce il divertimento." },
            { id: "B", risposta: "Quando ti costringono." },
            { id: "C", risposta: "Quando lo vorresti fare tutti i giorni." },
            { id: "D", risposta: "Quando si perde la capacit\u00e1 di autocontrollo." }
        ]
    },
    {
        id: 19,
        temaId: 4,
        domanda: "Quale di queste motivazioni non porta al gioco d'azzardo?",
        img: "img/foto-19.jpg",
        linkApprofondimento: "http://www.avvisopubblico.it/home/documentazione/gioco-dazzardo/sintesi-della-normativa-in-materia-di-gioco-dazzardo-e-ludopatia/",
        rispostaCorretta: "D",
        risposte: [
            { id: "A", risposta: "La sete di guadagno." },
            { id: "B", risposta: "Conoscere nuove persone." },
            { id: "C", risposta: "La voglia di affrontare la depressione." },
            { id: "D", risposta: "La voglia di divertirsi e socializzare senza fini di lucro." }
        ]
    },
    {
        id: 20,
        temaId: 4,
        domanda: "Quale di questi comportamenti \u00e8 lecito per un minorenne?",
        img: "img/foto-20.jpg",
        linkApprofondimento: "http://www.andinrete.it/portale/index.php?page=40&sid=6aee58421ff639c556ae77e3077f73e3",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "Informarsi sui rischi del gioco d'azzardo." },
            { id: "B", risposta: "Entrare nelle aree destinate a slot machine e lotterie." },
            { id: "C", risposta: "Accedere a una sala scommesse o a un casin\u00f2." },
            { id: "D", risposta: "Partecipare a giochi con vincite in denaro." }
        ]
    },

    /* FAMIGLIA */
    {
        id: 21,
        temaId: 5,
        domanda: "\u00e8 giusto che i genitori pubblichino cose private dei figli su internet? ",
        img: "img/foto-21.jpg",
        linkApprofondimento: "http://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/4231738",
        rispostaCorretta: "D",
        risposte: [
            { id: "A", risposta: "No, raccolgono like senza meritarli." },
            { id: "B", risposta: "S\u00ec, al figlio fa sicuramente piacere." },
            { id: "C", risposta: "S\u00ec, ha la patria potest\u00e1 e pu\u00f2 decidere per il figlio." },
            { id: "D", risposta: "No, violerebbe la privacy del minore." }
        ]
    },
    {
        id: 22,
        temaId: 5,
        domanda: "Si pu\u00f2 far lavorare un figlio prima che compia 15 anni?",
        img: "img/foto-22.jpg",
        linkApprofondimento: "http://www.anfos.it/sicurezza/tutela-lavoro-minorile/",
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "S\u00ec, per di piccoli lavoretti se il figlio non vuole studiare." },
            { id: "B", risposta: "No, la normativa fissa a 15 anni l'et\u00e1 per accedere al mondo del lavoro." },
            { id: "C", risposta: "S\u00ec, ne ha la patria potest\u00e1 e quindi sa che cosa \u00e8 bene per lui." },
            { id: "D", risposta: "No, non ha le caratteristiche per affrontare qualsiasi tipo di lavoro." }
        ]
    },
    {
        id: 23,
        temaId: 5,
        domanda: "\u00e8 giusto che i genitori impongano il proprio credo religioso e/o politico e/o alimentare (es: vegano) ai figli?",
        img: "img/foto-23.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "A",
        risposte: [
            { id: "A", risposta: "No, ognuno \u00e8 libero di fare le proprie scelte, senza compromettere la salute." },
            { id: "B", risposta: "S\u00ec, finch\u00e9 sono minorenni." },
            { id: "C", risposta: "S\u00ec, ogni famiglia deve rispettare le proprie tradizioni. " },
            { id: "D", risposta: "No, la religione e la dieta sono regolate dalla legge." }
        ]
    },
    {
        id: 24,
        temaId: 5,
        domanda: "\u00e8 lecito costringere i propri figli minorenni a chiedere l'elemosina?",
        img: "img/foto-24.jpg",
        linkApprofondimento: "",
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "S\u00ec, ma solo se sono molto bravi a raccogliere denaro." },
            { id: "B", risposta: "No, si commette il reato di impiego di minori nell'accattonaggio." },
            { id: "C", risposta: "S\u00ec, quando i genitori sono in difficolt\u00e1 economica." },
            { id: "D", risposta: "No, ma i figli possono farlo di spontanea volont\u00e1." }
        ]
    },
    {
        id: 25,
        temaId: 5,
        domanda: "\u00e8 giusto che i genitori impongano ai propri bambini le loro decisioni su istruzione, lavoro e scelte di vita?",
        img: "img/foto-25.jpg",
        linkApprofondimento: "http://www.garanteinfanzia.org/diritti ",
        rispostaCorretta: "D",
        risposte: [
            { id: "A", risposta: "No, ogni bambino \u00e8 in grado di decidere per s\u00e9." },
            { id: "B", risposta: "S\u00ec, i genitori sono tenuti a dare consigli ai propri figli." },
            { id: "C", risposta: "S\u00ec, i genitori hanno il diritto di decidere al posto dei figli perch\u00e9 sono pi\u00f9 saggi." },
            { id: "D", risposta: "No, imporre la propria volont\u00e1 sui figli senza tener conto dei loro bisogni \u00e8 contro i diritti dell'infanzia." }
        ]
    }
];

var temi = [
    { id: "1", nome: "Scuola", img: "img/tema-1.png" },
    { id: "2", nome: "Social Network", img: "img/tema-2.png" },
    { id: "3", nome: "Mafia", img: "img/tema-3.png" },
    { id: "4", nome: "Giochi", img: "img/tema-4.png" },
    { id: "5", nome: "Famiglia", img: "img/tema-5.png" }
];

var avatars = [
    { id: "1", img: "img/avatar-1.png" },
    { id: "2", img: "img/avatar-2.png" },
    { id: "3", img: "img/avatar-3.png" },
    { id: "4", img: "img/avatar-4.png" },
    { id: "5", img: "img/avatar-5.png" },
    { id: "6", img: "img/avatar-6.png" },
    { id: "7", img: "img/avatar-7.png" },
    { id: "8", img: "img/avatar-8.png" }
];