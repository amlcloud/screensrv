var nonWordRe = /[^a-z0-9, ]+/g;
//var _nonWordRe = /[^a-zA-Z0-9\u00C0-\u00FF, ]+/g;
export function iterateGrams(value: string, gramSizePar: number) {
  let gramSize = gramSizePar || 2;
  let simplified = '-' + value.toLowerCase().replace(nonWordRe, '') + '-', lenDiff = gramSize - simplified.length, results = [];
  if (lenDiff > 0) {
    for (let i = 0; i < lenDiff; ++i) {
      simplified += '-';
    }
  }
  for (let i = 0; i < simplified.length - gramSize + 1; ++i) {
    results.push(simplified.slice(i, i + gramSize));
  }
  return results;
}
;
export function gramCounterBool(value: string, gramSizePar: number) {
  // return an object where key=gram, value=number of occurrences
  let gramSize = gramSizePar || 2;
  let result: { [key: string]: any } = {}
    , grams = iterateGrams(value, gramSize), i = 0;
  for (i; i < grams.length; ++i) {
    if (grams[i].indexOf(' ') === -1)
      result[grams[i]] = true;
    // if (grams[i] in result) {
    //   result[grams[i]] = true;
    // } else {
    //   result[grams[i]] = true;
    // }
  }
  return result;
}

