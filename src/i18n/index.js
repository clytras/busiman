import LocalizedStrings from 'react-localization';
import Languages, { supportedLanguageDefs } from './languages';
import Texts from './texts';
import {
  protoExpand,
  protoFormatPlural,
  protoSelectString,
  protoGetSafeCurrentLocale,
  protoSetSafeLanguage,
  protoHasLocale,
  protoGetInterfaceLocale,
  protoAutoSetLanguage
} from './utils';

LocalizedStrings.prototype.expand = protoExpand;
LocalizedStrings.prototype.formatPlural = protoFormatPlural;
LocalizedStrings.prototype.selectString = protoSelectString;
LocalizedStrings.prototype.getSafeCurrentLocale = protoGetSafeCurrentLocale;
LocalizedStrings.prototype.hasLocale = protoHasLocale;
LocalizedStrings.prototype.getInterfaceLocale = protoGetInterfaceLocale;
LocalizedStrings.prototype.setSafeLanguage = protoSetSafeLanguage;
LocalizedStrings.prototype.autoSetLanguage = protoAutoSetLanguage;

// LocalizedStrings.prototype.format = function(fmt, params) {
//   const langAliases = new Aliases(this);
//   const paramsAliases = new Aliases(params);

//   return fmt.replace(/\{(.*?)\}/gi, (result, aliasKeyPath) => {
//     if(paramsAliases.has(aliasKeyPath)) {
//       return paramsAliases.get(aliasKeyPath, { expandString: true });
//     }

//     return langAliases.get(aliasKeyPath, result, { expandString: true });
//   });
// }

const Strings = new LocalizedStrings(Languages);

export {
  Strings,
  Texts,
  supportedLanguageDefs
};
