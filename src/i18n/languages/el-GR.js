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
    Next: 'Επόμενο',
    Back: 'Πίσω',
    Previous: 'Προηγούμενο',
    Suggested: 'Προτείνεται',
    Advanced: 'Για προχωρημένους',
    DBType: 'Τύπος βάσης δεδομένων',
    User: 'Χρήστης',
    Password: 'Κωδικός',
    Port: 'Πόρτα',
    OK: 'OK',
    Cancel: 'Άκυρο',

    Undo: 'Αναίρεση',
    Redo: 'Επανάληψη',
    Copy: 'Αντιγραφή',
    Cut: 'Αποκοπή',
    Paste: 'Επικόλληση',
    SelectAll: 'Επιλογή όλων',

    NewInstallation: 'Νέα εγκατάσταση',
    ConnectToExistingDB: 'Σύνδεση σε υπάρχουσα βάση δεδομένων',
    ApplicationFunctions: 'Λειτουργίες εφαρμογής',
    LocalDBInstallation: 'Τοπική εγκατάσταση βάσης δεδομένων',
    LocalInstallation: 'Τοπική εγκατάσταση',
    DBConnectionSettings: 'Ρυθμίσεις σύνδεσης βάσης δεδομένων',
    ConnectionSettings: 'Ρυθμίσεις σύνδεσης',
    FromConfigFile: 'Από αρχείο ρυθμίσεων',
    ServerAddress: 'Διεύθυνση διακομιστή',
    ConfigurationFilePassword: 'Κωδικός αρχείου ρυθμίσεων',
  },

  messages: {
    StartupError: 'Παρουσιάστηκε σφάλμα εκκίνησης',
    DBProblem: 'Πρόβλημα βάσης δεδομένων',
    DBConnectionNotValid: 'Η σύνδεση βάσης δεδομένων δεν είναι έγκυρη',
    DBCantConnect: 'Δεν είναι δυνατή η σύνδεση με τη βάση δεδομένων',
    InputPasswordForProtectedConfigFile: 'Εισάγεται τον κωδικό για το προστατευμένο αρχείο ρυθμίσεων',
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
  }

}
