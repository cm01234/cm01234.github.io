const SUPPORTED_LANGUAGES = ["en", "ru"];
const DEFAULT_LANGUAGE = "en";

const LANGUAGE_NAMES = {
  en: "English",
  ru: "Русский"
};

/**

Get a nested value from an object.

Example:

getValue(data, "hero.description")
*/
function getValue(object, path) {
  return path
    .split(".")
    .reduce((value, key) => value?.[key], object);
}

/**

Load the locale JSON file.
*/
async function loadLocale(language) {
  const response = await fetch(
    `./locales/${language}.json`
  );

  if (!response.ok) {
    throw new Error(
      `Could not load locale: ${language}`
    );
  }

  return response.json();
}

/**

Translate all elements with data-i18n.
*/
function translateText(locale) {
  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {

      const key = element.dataset.i18n;
      const value = getValue(locale, key);

      if (typeof value === "string") {
        element.textContent = value;
      }

    });
}

/**

Translate ARIA labels.
*/
function translateAriaLabels(locale) {
  document
    .querySelectorAll("[data-i18n-aria-label]")
    .forEach((element) => {

      const key =
        element.dataset.i18nAriaLabel;

      const value =
        getValue(locale, key);

      if (typeof value === "string") {
        element.setAttribute(
          "aria-label",
          value
        );
      }

    });
}

/**

Update the document language and title.
*/
function updateDocumentLanguage(
  language,
  locale
) {
  document.documentElement.lang = language;

  const title =
    getValue(locale, "meta.title");

  const description =
    getValue(locale, "meta.description");

  if (title) {
    document.title = title;
  }

  if (description) {
    const metaDescription =
      document.querySelector(
        "meta[name=\"description\"]"
      );

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description
      );
    }
  }
}

/**

Update language switcher state.
*/
function updateLanguageButtons(language) {
  document
    .querySelectorAll("[data-language]")
    .forEach((button) => {

      const buttonLanguage =
        button.dataset.language;

      const isCurrent =
        buttonLanguage === language;

      button.setAttribute(
        "aria-pressed",
        String(isCurrent)
      );

      if (isCurrent) {
        button.setAttribute(
          "aria-current",
          "true"
        );
      } else {
        button.removeAttribute(
          "aria-current"
        );
      }

    });
}

/**

Save selected language.
*/
function saveLanguage(language) {
  localStorage.setItem(
    "preferredLanguage",
    language
  );
}

/**

Get the user's preferred language.
*/
function getPreferredLanguage() {

  const savedLanguage =
    localStorage.getItem(
      "preferredLanguage"
    );

  if (
    savedLanguage &&
    SUPPORTED_LANGUAGES.includes(
      savedLanguage
    )
  ) {
    return savedLanguage;
  }

  const browserLanguage =
    navigator.language
      ?.toLowerCase()
      .split("-")[0];

  if (
    SUPPORTED_LANGUAGES.includes(
      browserLanguage
    )
  ) {
    return browserLanguage;
  }

  return DEFAULT_LANGUAGE;
}

/**

Change the current language.
*/
async function setLanguage(language) {

  if (
    !SUPPORTED_LANGUAGES.includes(language)
  ) {
    language = DEFAULT_LANGUAGE;
  }

  try {

    const locale =
      await loadLocale(language);

    translateText(locale);
    translateAriaLabels(locale);

    updateDocumentLanguage(
      language,
      locale
    );

    updateLanguageButtons(
      language
    );

    saveLanguage(language);


  } catch (error) {

    console.error(
      "Localization error:",
      error
    );


  }
}

/**

Initialize localization.
*/
document.addEventListener(
  "DOMContentLoaded",
  () => {

    document
      .querySelectorAll("[data-language]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const language =
              button.dataset.language;

            setLanguage(language);

          }
        );


      });

    const initialLanguage =
      getPreferredLanguage();

    setLanguage(initialLanguage);

  }
);