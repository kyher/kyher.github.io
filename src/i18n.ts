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
      profile:
        "A diligent, driven software engineer with a passion for improving processes and providing value. Experienced in planning, designing, developing and deploying web applications across a multitude of technologies.",
      contact: {
        email: "Email me",
      },
      projects: {
        currentTitle: "Current Project",
        otherTitle: "Previous Projects",
        couplemdb:
          "A movie database app for couples to compare their reviewed movies",
        icanttypefrench:
          "Basic react app for copying french keyboard characters to clipboard",
        trackstats: "A web app for voting for the best F1 track",
        emojichat:
          "A chat application that uses emojis as the primary means of communication",
        recetterie: "A recipe management application to post and save recipes",
        budgetr:
          "A budgeting application that helps users manage their finances",
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
      profile:
        "Un ingénieur logiciel diligent et motivé, passionné par l'amélioration des processus et la création de valeur. Expérimenté dans la planification, la conception, le développement et le déploiement d'applications web à travers une multitude de technologies.",
      contact: {
        email: "Envoyez-moi un email",
      },
      projects: {
        currentTitle: "Projet actuel",
        otherTitle: "Projets précédents",
        couplemdb:
          "Une application de base de données de films pour les couples afin de comparer leurs films évalués",
        icanttypefrench:
          "Application React basique pour copier des caractères de clavier français dans le presse-papiers",
        trackstats:
          "Une application web pour le vote en direct pour le meilleur circuit de F1",
        emojichat:
          "Une application de chat qui utilise des emojis comme principal moyen de communication",
        recetterie:
          "Une application de gestion de recettes pour publier et enregistrer des recettes",
        budgetr:
          "Une application de budgétisation qui aide les utilisateurs à gérer leurs finances",
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
