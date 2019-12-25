export default {

  hello:'Γειά',
  howAreYou:'Πως είσαι;',

  thisLanguage: 'Ελληνικά',
  languageFlagIso: 'gr',
  languageEn: 'Αγγλικά',
  languageEl: 'Ελληνικά',
  euroSign: '€',

  titles: {
    Home: 'Αρχική',
    Installation: 'Εγκατάσταση',
    Completed: 'Ολοκληρώθηκε',
    Reload: 'Επαναφόρτωση',
    Next: 'Επόμενο',
    Back: 'Πίσω',
    Previous: 'Προηγούμενο',
    Suggested: 'Προτείνεται',
    Advanced: 'Για προχωρημένους',
    DBType: 'Τύπος βάσης δεδομένων',
    Database: 'Βάση δεδομένων',
    User: 'Χρήστης',
    Password: 'Κωδικός',
    Port: 'Πόρτα',
    OK: 'OK',
    Cancel: 'Άκυρο',
    File: 'Αρχείο',

    Undo: 'Αναίρεση',
    Redo: 'Επανάληψη',
    Copy: 'Αντιγραφή',
    Cut: 'Αποκοπή',
    Paste: 'Επικόλληση',
    SelectAll: 'Επιλογή όλων',

    NewInstallation: 'Νέα εγκατάσταση',
    ConnectToExistingDB: 'Σύνδεση σε υπάρχουσα βάση δεδομένων',
    ConnectToDB: 'Σύνδεση σε βάση δεδομένων',
    ApplicationFunctions: 'Λειτουργίες εφαρμογής',
    LocalDBInstallation: 'Τοπική εγκατάσταση βάσης δεδομένων',
    LocalInstallation: 'Τοπική εγκατάσταση',
    DBConnectionSettings: 'Ρυθμίσεις σύνδεσης βάσης δεδομένων',
    ConnectionSettings: 'Ρυθμίσεις σύνδεσης',
    FromConfigFile: 'Από αρχείο ρυθμίσεων',
    ServerAddress: 'Διεύθυνση διακομιστή',
    ConfigurationFilePassword: 'Κωδικός αρχείου ρυθμίσεων',
    DBConfigFile: 'Αρχείο ρυθμίσεων βάσης δεδομένων',
    DBFile: 'Αρχείο βάσης δεδομένων',
    TestConnection: 'Δοκιμή σύνδεσης',
    AccessDenied: 'Δεν επιτρέπεται η πρόσβαση',
  },

  messages: {
    StartupError: 'Παρουσιάστηκε σφάλμα εκκίνησης',
    LoadingFileError: 'Σφάλμα κατά την φόρτωση αρχείου',
    DBProblem: 'Πρόβλημα βάσης δεδομένων',
    ConfigProblem: 'Πρόβλημα ρυθμίσεων',
    IOProblem: 'Πρόβλημα συστήματος αρχείων',
    DBConnectionNotValid: 'Η σύνδεση βάσης δεδομένων δεν είναι έγκυρη',
    DBCantConnect: 'Δεν είναι δυνατή η σύνδεση με τη βάση δεδομένων',
    InputPasswordForProtectedConfigFile: 'Εισάγεται τον κωδικό για το προστατευμένο αρχείο ρυθμίσεων',
    FileNotFound: 'Το αρχείο δεν βρέθηκε',
    NotValidConfigFile: 'Μη έγκυρο αρχείο ρυθμίσεων',
    PasswordAppearsToBeWrong: 'Ο κωδικός φαίνεται να είναι λάθος',
    CouldNotFetchData: 'Δεν ήταν δυνατή η λήψη δεδομένων',
    DBContainsAnInstallation: 'Η βάση δεδομένων περιέχει ήδη μία υπάρχουσα εγκατάσταση',
    DBNotEmpty: 'Η βάση δεδομένων δεν είναι κενή',
    MustSelectEmptyDBForNewInstallation: 'Πρέπει να επιλέξετε μία κενή βάση δεδομένων για νέα εγκατάσταση',
    DBFileExists: 'Το αρχείο προορισμού βάσης δεδομένων υπάρχει ήδη',
    CouldNotDeleteFile: 'Δεν ήταν δυνατή η διαγραφή αρχείου',
    MakeSureDBExists: 'Βεβαιωθείτε ότι υπάρχει η βάση δεδομένων',
    InstallationComplete: 'Η εγκατάσταση ολοκληρώθηκε',
    AppNeedsReload: 'Πρέπει να γίνει επαναφόρτώση της εφαρμογής',
    CheckDBConnectionInfo: 'Ελέγξτε αν είστε συνδεδεμένοι στο δίκτυο του εξυπηρετητή της βάσης δεδομένων ή ότι το αρχείο της βάσης δεδομένων υπάρχει',

    NewDBHasExisting: '{messages.DBContainsAnInstallation}.\n\n{prompts.CancelNewAndUseExistingInstallation}',
    NewDBNotEmpty: '{messages.DBNotEmpty}.\n\n{messages.MustSelectEmptyDBForNewInstallation}.',
    NewDBFileExists: '{messages.DBFileExists).\n\n{prompts.DeleteFileAndCreateNewDB}',
    CouldNotDeleteThisFile: '{messages.CouldNotDeleteFile}\n\n{file}',
    CantConnectToThisDB: '{messages.DBCantConnect} ({database})\n\n{messages.MakeSureDBExists}',
    CantConnectToDBCheckInfo: '{messages.DBCantConnect}.\n{messages.CheckDBConnectionInfo}.',
  },

  prompts: {
    CancelNewAndUseExistingInstallation: 'Να ακυρωθεί η νέα εγκατάσταση και να χρησιμοποιηθεί η υπάρχουσα;',
    DeleteFileAndCreateNewDB: 'Είστε σίγουροι ότι θέλετε να διαγράψετε το αρχείο και να δημιουργήσετε μια νέα βάση δεδομένων;',
  },

  content: {
    ApplicationFunctions: {
      Personal: {
        Description: 'Περιέχει λειτουργίες που αφορούν ατομική χρήση όπως:',
        Items: [
          'Επαφές',
          'Προσωπική Μισθοδοσία',
          'Έσοδα / Έξοδα'
        ]
      },
      Business: {
        Description: 'Για επιχειρήσεις με εξειδικευμένες λειτουργίες όπως:',
        Items: [
          'Συναλλασσόμενοι',
          'Τιμολόγια',
          'Προϊόντα'
        ]
      },
    },
    DBInstallationType: {
      Local: {
        Description: 'Η εφαρμογή θα εκτελείται μόνο σε αυτόν τον υπολογιστή'
      },
      Advanced: {
        Description: 'Σύνδεση σε άλλες τοπικές ή απομακρυσμένες βάσεις δεδομένων'
      }
    }
  },

  system: {
    fileDialog: {
      filters: {
        all: 'Όλα τα αρχεία',
        bmc: 'Ρυθμίσεις Business Manager',
        sqlite: 'Βάσεις δεδομένων SQLite',
      }
    }
  }

}
