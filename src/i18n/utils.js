
function protoFormatPlural(fmt, data) {
  let pluralData = {};
  for(let key in data) {
    let value = data[key];
    pluralData[key] = value;
    if(!isNaN(value) && typeof(this.plurals[key]) !== undefined) {
      pluralData[`${key}_pluralized`] = this.plurals[key][value == 1 ? 'singular' : 'plural'];
    }
  }

  //console.log('formatPlural', fmt, pluralData, this.plurals);
  return this.formatString(fmt, pluralData);
}

function protoSelectString(fromObject) {
  const locale = this.getSafeCurrentLocale();
  return fromObject && fromObject.hasOwnProperty(locale) ? fromObject[locale] : fromObject;
}

function protoGetSafeCurrentLocale(defaultLocale = 'en') {
  const languages = this.getAvailableLanguages();
  let locale = this.getLanguage().toLowerCase();
  if(languages.indexOf(locale) == -1) locale = defaultLocale;
  return locale;
}

function protoSetSafeLanguage(language, defaultLocale = 'en') {
  const languages = this.getAvailableLanguages();
  if(languages.indexOf(language) >= 0) {
    console.log('SETTING LANG', language);
    this.setLanguage(language);
  } else if(defaultLocale) {
    this.setLanguage(defaultLocale);
  }
}

function protoHasLocale(locale) {
  const languages = this.getAvailableLanguages();
  return languages.indexOf(locale) >= 0;
}

function protoGetInterfaceLocale() {
  const interfaceLanguage = this.getInterfaceLanguage();
  const localeSplit = interfaceLanguage.split('-');
  if(localeSplit.length == 2) {
    return {
      locale: interfaceLanguage,
      language: localeSplit[0].toLowerCase(),
      iso: localeSplit[1].toLowerCase()
    }
  }
  return {
    locale: 'en-US',
    language: 'en',
    iso: 'us'
  };
}

function protoAutoSetLanguage(language = 'auto') {
  const interfaceLocale = this.getInterfaceLocale();
  const setLanguage = language == 'auto' ? interfaceLocale.language : language;
  this.setSafeLanguage(setLanguage);

  return {
    inputLanguage: language,
    language: setLanguage,
    interfaceLocale,
  }
}

function getLanguageFromLocale(locale) {
  const localeSplit = locale.split('-');
  if(localeSplit.length >= 1) {
    return localeSplit[0];
  }
  return locale;
}

export {
  protoFormatPlural,
  protoSelectString,
  protoGetSafeCurrentLocale,
  protoSetSafeLanguage,
  protoHasLocale,
  protoGetInterfaceLocale,
  protoAutoSetLanguage,
  getLanguageFromLocale
}