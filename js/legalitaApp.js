var app = angular.module('legalitaGameApp', []);
app.factory('UserProfileService', UserProfileService);

function UserProfileService() {
    
    function decreaseLives() {
        if (profile.lives > 0) {
            profile.lives--;
        }
    }

    function addPoint() {
        profile.points++;
    }
    /*
    var profile = {
        lives: 5,
        points: 0,
        avatar: null,
        currentTema: null,
        currentQuestion: null
    };
    */
    var profile = {
        lives:3,
        points: 10,
        avatar: { id: "3", img: "img/avatar-3.png" },
        currentTema: { id: "1", nome: "Scuola", img: "img/tema-1.png" },
        domandaCorrente: domande[4]
    };

    return profile;
}


app.controller('AvatarController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {
    
        var avatars = this;
        avatars.current = null;
        avatars.available = [
          { id: "1", img: "img/avatar-1.png" },
          { id: "2", img: "img/avatar-2.png" },
          { id: "3", img: "img/avatar-3.png" },
          { id: "4", img: "img/avatar-4.png" },
          { id: "5", img: "img/avatar-5.png" },
          { id: "6", img: "img/avatar-6.png" },
          { id: "7", img: "img/avatar-7.png" },
          { id: "8", img: "img/avatar-8.png" }
        ];

        $scope.Profile = UserProfileService;

        $scope.setAvatar = function(index) {
            $scope.Profile.avatar = avatars.available[index - 1];
        };
}]);

app.controller('TemiController', function () {
    var temi = this;
    temi.available = [
        { id: "1", nome: "Scuola", img: "img/tema-1.png" },
        { id: "2", nome: "Social Network", img: "img/tema-2.png" },
        { id: "3", nome: "Mafia", img: "img/tema-3.png" },
        { id: "4", nome: "Giochi", img: "img/tema-4.png" },
        { id: "5", nome: "Famiglia", img: "img/tema-5.png" }
    ];
});

app.controller('QuizController', ['$scope', 'UserProfileService',
    function ($scope, UserProfileService) {
        $scope.Profile = UserProfileService;
        $scope.HaRisposto = false;
        $scope.HaRispostoCorrettamente = false;

        $scope.GetCssVita = function (index) {
            return (index <= $scope.Profile.lives) ? "vivo" : "morto";
        };

        $scope.Rispondi = function (risposta) {
            $scope.HaRisposto = true;
            $scope.HaRispostoCorrettamente = (risposta == $scope.Profile.domandaCorrente.rispostaCorretta);
        };
    }]);


var domande = [
    {
        id: 1,
        domanda: "Scopri che alle elezioni dei rappresentanti di classe vengono manipolati i voti, cosa decidi di fare?",
        img: "img/foto-1.jpg",
        linkApprofondimento: null,
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "Se l’esito mi aggrada non faccio nulla." },
            { id: "B", risposta: "Mi rivolgo agli insegnanti." },
            { id: "C", risposta: "Lancio il cancellino contro i compagni eletti." },
            { id: "D", risposta: "Cerco di capire chi è stato." }
        ]
    },
    {
        id: 2,
        domanda: "All’interno della tua scuola trovi un muro crepato, che nessuno ha intenzione di riparare: come agisci?",
        img: "img/foto-2.jpg",
        linkApprofondimento: null,
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
        domanda: "Un ragazzo viene accusato e punito per un graffito sulla facciata della scuola. Tu però vieni a sapere che è stato un tuo amico: come ti comporti?",
        img: "img/foto-3.jpg",
        linkApprofondimento: null,
        rispostaCorretta: "C",
        risposte: [
            { id: "A", risposta: "Apprezzo il graffito, perché mi piace l’arte illegale." },
            { id: "B", risposta: "Non faccio nulla, gli amici prima di tutto." },
            { id: "C", risposta: "Parlo con il mio amico per farlo confessare e poi con gli insegnanti." },
            { id: "D", risposta: "Parlo direttamente con gli insegnati denunciando l’accaduto." }
        ]
    },
    {
        id: 4,
        domanda: "Se vedi un tuo compagno di classe che usa violenza contro un ragazzino più piccolo, che cosa fai?",
        img: "img/foto-4.jpg",
        linkApprofondimento: null,
        rispostaCorretta: "B",
        risposte: [
            { id: "A", risposta: "Uso violenza anche io perché faccio parte del branco." },
            { id: "B", risposta: "Lo fermo o chiamo un insegnante." },
            { id: "C", risposta: "Lo incito." },
            { id: "D", risposta: "Riprendo il tutto con il cellulare e lo metto su Internet." }
        ]
    },
    {
        id: 5,
        domanda: "A scuola scopri che un tuo compagno sta facendo girare su WhatsApp una foto ridicola di un altro alunno senza il suo consenso: che cosa fai?",
        img: "img/foto-5.jpg",
        linkApprofondimento: "http://scuola.regione.emilia-romagna.it/qualificazione-scolastica/educazione-alla-cittadinanza-attiva/sicurezza-e-legalita",
        rispostaCorretta: "C",
        risposte: [
            { id: "A", risposta: "Ti disinteressi, non è tuo amico." },
            { id: "B", risposta: "Fai girare anche tu quella foto." },
            { id: "C", risposta: "Segnali che si tratta di un reato." },
            { id: "D", risposta: "Ne salvi una copia sul telefono." }
        ]
    }
];