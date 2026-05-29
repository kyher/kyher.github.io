import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        contact: "Contact",
        projects: "Projects",
      },
      profile: {
        title: "// profile",
        description:
          "A diligent, driven senior software engineer with a passion for improving processes and providing value. Experienced in planning, designing, developing and deploying web applications across a multitude of technologies. An advocate for AI-assisted development and leveraging modern tooling to ship better software, faster.",
      },
      skills: {
        title: "// skills",
      },
      contact: {
        email: "Email me",
      },
      projects: {
        currentTitle: "// current side project",
        otherTitle: "// previous side projects",
        couplemdb:
          "A movie database app for couples to compare their reviewed movies",
        icanttypefrench:
          "Basic react app for copying french keyboard characters to clipboard",
        trackstats: "A web app for voting for the best F1 track",
        emojichat:
          "A chat application that uses emojis as the primary means of communication",
budgetr:
          "A budgeting application that helps users manage their finances",
        healthdash:
          "A health dashboard application for tracking health appointments",
        standupr: "A standup meeting application for remote teams",
        myhours: "App for showing your working hours",
        "cest-moi-le-chef": "An application for managing recipes",
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        contact: "Contact",
        projects: "Projets",
      },
      profile: {
        title: "// profil",
        description:
          "Un ingénieur logiciel senior diligent et motivé, passionné par l'amélioration des processus et la création de valeur. Expérimenté dans la planification, la conception, le développement et le déploiement d'applications web à travers une multitude de technologies. Partisan du développement assisté par IA et de l'utilisation d'outils modernes pour livrer de meilleurs logiciels, plus rapidement.",
      },
      skills: {
        title: "// compétences",
      },
      contact: {
        email: "Envoyez-moi un email",
      },
      projects: {
        currentTitle: "// projet personnel actuel",
        otherTitle: "// projets personnels précédents",
        couplemdb:
          "Une application de base de données de films pour les couples afin de comparer leurs films évalués",
        icanttypefrench:
          "Application React basique pour copier des caractères de clavier français dans le presse-papiers",
        trackstats:
          "Une application web pour le vote en direct pour le meilleur circuit de F1",
        emojichat:
          "Une application de chat qui utilise des emojis comme principal moyen de communication",
budgetr:
          "Une application de budgétisation qui aide les utilisateurs à gérer leurs finances",
        healthdash:
          "Une application de tableau de bord de santé pour le suivi des rendez-vous de santé",
        standupr:
          "Une application de réunion debout pour les équipes à distance",
        myhours: "Une application pour afficher vos heures de travail",
        "cest-moi-le-chef": "Une application pour gérer les recettes",
      },
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
