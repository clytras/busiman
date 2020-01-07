
function checkAFM(afm) {
  afm = afm.split('').reverse().join('');
  var Num1 = 0;
  for(var iDigit= 1; iDigit <=  8; iDigit++) {
    Num1 += afm.charAt(iDigit) << iDigit;
  }
  return (Num1 % 11) % 10 == afm.charAt(0);
}

function checkAFM2(afm) {
  if(afm.length != 9) {
    // "Τα ψηφία του ΑΦΜ πρέπει να είναι 9 αριθμοί"
    return false;
  } 

  if(!/^\d+$/.test(afm)) {
    // "Αυτό που εισάγετε δεν είναι αριθμός"
    return false;
  }

  const sum = afm
    .substring(0, 8)
    .split('')
    .reduce((sum, val, idx) => {
      // console.log(sum, val, idx, parseInt(val) << (8 - idx));
      return sum + (parseInt(val) << (8 - idx))
    }, 0);
  
  const calc = sum % 11;
  const d9 = parseInt(afm[8]);

  // console.log('sum', sum);
  // console.log('calc', calc);
  // console.log('d9', d9);

  return calc == d9 || (calc == 10 && d9 == 0);
}

function check_afm(afm) {

  if(afm == '' || afm.length != 9){
    return false;
  } else {
    var cd = afm.substr(8,1); 
  }
  if(afm == '000000000'){
    return false;
  }
  var sum = 0;
  afm_ok = false;
  for(var i=0; i<8; i++) {
    if(afm.charCodeAt(i) < 48 || afm.charCodeAt(i) > 57) {
      return false;        
    } else {
      d = afm.substr(i,1);
      if(i < 8) {
        sum = sum + d * Math.pow(2,8-i);
      }
    }
  }
  if(sum == 0) {
    return false;
  } else {
    var calc = sum % 11;
    if(calc == cd || ((calc == 0 || calc == 10) && cd == 0)) {
      return true;
    } else {
      return false;
    }
  }

}


// AFMCheck.class 
// public class AFMcheck {
//   public boolean CorrectAFM(String AFM) {
//     if (!NumberUtil.isNumber(AFM)) {
//       // "Αυτό που εισάγετε δεν είναι αριθμός"
//       return false;
//     } 
//     if (AFM.length() != 9) {
//       // "Τα ψηφία του ΑΦΜ πρέπει να είναι 9 αριθμοί"
//       return false;
//     } 
//     int digit1 = parseInt(AFM.charAt(0));
//     int digit2 = parseInt(AFM.charAt(1));
//     int digit3 = parseInt(AFM.charAt(2));
//     int digit4 = parseInt(AFM.charAt(3));
//     int digit5 = parseInt(AFM.charAt(4));
//     int digit6 = parseInt(AFM.charAt(5));
//     int digit7 = parseInt(AFM.charAt(6));
//     int digit8 = parseInt(AFM.charAt(7));
//     int digit9 = parseInt(AFM.charAt(8));
//     int total = digit1 * 256 + digit2 * 128 + digit3 * 64 + digit4 * 32 + digit5 * 16 + digit6 * 8 + digit7 * 4 + digit8 * 2;
//     int ipolipo = total % 11;
//     if (ipolipo == digit9 || (ipolipo == 10 && digit9 == 0))
//       return true; 
//     // "Το ΑΦΜ που εισάγατε δεν είναι σωστό. Ξαναπροσπαθήστε!"
//     return false;
//   }
// }

function AFMcheck(afm) {
  if(afm.length != 9) {
    // "Τα ψηφία του ΑΦΜ πρέπει να είναι 9 αριθμοί"
    return false;
  } 

  if(!/^\d+$/.test(afm)) {
    // "Αυτό που εισάγετε δεν είναι αριθμός"
    return false;
  }

  const digit1 = parseInt(afm.charAt(0));
  const digit2 = parseInt(afm.charAt(1));
  const digit3 = parseInt(afm.charAt(2));
  const digit4 = parseInt(afm.charAt(3));
  const digit5 = parseInt(afm.charAt(4));
  const digit6 = parseInt(afm.charAt(5));
  const digit7 = parseInt(afm.charAt(6));
  const digit8 = parseInt(afm.charAt(7));
  const digit9 = parseInt(afm.charAt(8));

  console.log('d1m', digit1 * 256);
  console.log('d2m', digit2 * 128);
  console.log('d3m', digit3 * 64);
  console.log('d4m', digit4 * 32);
  console.log('d5m', digit5 * 16);
  console.log('d6m', digit6 * 8);
  console.log('d7m', digit7 * 4);
  console.log('d8m', digit8 * 2);
  

  const total = digit1 * 256 + digit2 * 128 + digit3 * 64 + digit4 * 32 + digit5 * 16 + digit6 * 8 + digit7 * 4 + digit8 * 2;

  console.log('total', total);

  const ipolipo = total % 11;

  console.log('d9', digit9);
  console.log('ipolipo', ipolipo);

  if (ipolipo === digit9 || (ipolipo === 10 && digit9 === 0))
    return true; 

  // "Το ΑΦΜ που εισάγατε δεν είναι σωστό. Ξαναπροσπαθήστε!"
  return false;
}
