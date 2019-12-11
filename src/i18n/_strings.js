// import LocalizedStrings from 'react-localization';
// import en from './en-us';
// import el from './el-gr';

// // import * as path from 'path';
// // import * as glob from 'glob';
// // import * as read  from 'read-data';

// // let languageDir = path.resolve(process.cwd(), 'src', 'lang');
// // let languageData = {};

// // function loadLanguages() {
// //     //console.log('Load Languages Dir: ', __dirname, __filename, fs.realpathSync('.'));
// //     //console.log('Realpath: ', fs.realpathSync('.'), path.resolve(fs.realpathSync('.'), 'lang'));
// //     // console.log('Process CWD: ', process.cwd());
// //     // console.log('All language files exp: ', path.join(languageDir, '*.yaml'));

// //     let localeFiles = glob.sync(path.join(languageDir, '*.yaml'));

// //     localeFiles.forEach(localeFile => {
// //         const locale = path.parse(localeFile).name;
// //         const data = read.sync(localeFile);
// //         languageData[locale] = data;
// //     });
// // }

// // loadLanguages();
// // export const Strings = new LocalizedStrings(languageData);

// export const Strings = new LocalizedStrings({ en, el });
