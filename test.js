var MeCab = new require('mecab-async')
  , mecab = new MeCab();
var Combinatorics = require('js-combinatorics');

function allPossibleCases(arr) {
  if (arr.length == 1) {
    return arr[0];
  } else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
    for (var i = 0; i < allCasesOfRest.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        result.push(arr[0][j] + allCasesOfRest[i]);
      }
    }
    return result;
  }
}

function dump(nodes, subIndex, value) {
  var result = '';
  for (let [i, node] of nodes.entries()) {
    if (i == subIndex ){
      result += value;
    } else {
      result += node[0];
    }
  }
  console.log(result);
}

var gyous = [
  ['カ', 'キ', 'ク', 'ケ', 'コ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ'],
  ['サ', 'シ', 'ス', 'セ', 'ソ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
  ['タ', 'チ', 'ツ', 'テ', 'ト', 'ダ', 'ヂ', 'ズ', 'デ', 'ド'],
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ'],
  ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ['ヤ', 'ユ', 'ヨ'],
  ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  ['ワ', 'ヲ']
];
var dans = [
  ['ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ', 'キャ', 'シャ', 'チャ', 'ニャ', 'ヒャ', 'ミャ', 'リャ', 'バ' , 'パ' , 'パ'
],
  ['イ', 'キ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ',       'リ'],
  ['ウ', 'ク', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ', 'ル'],
  ['エ', 'ケ', 'セ', 'テ', 'ネ', 'ヘ', 'メ',       'レ'],
  ['オ', 'コ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ', 'ロ', 'ヲ']
];

function getSamePronounce(letter){
  var value = [];
  for (let gyou of gyous) {
    index = gyou.indexOf(letter);
    if (index >=0){
      for (let [i, word] of gyou.entries() ){
        if (i != index) {
          value.push(word);
        }
      }
    }
  }
  for (let dan of dans) {
    index = dan.indexOf(letter);
    if (index >=0){
      for (let [i, word] of dan.entries() ){
        if (i != index) {
          value.push(word);
        }
      }
    }
  }
  return value;
}
class GagLator {
  translate(text){
    var nodes = mecab.parseSync(text);

    var targetIndex = null;
    var maxLength = 0;
    var target = '';
    for ( let [index, node] of nodes.entries() ) {
      if ( node[1] == '名詞') {
        if (node[9].length >= maxLength){
          maxLength = node[9].length;
          targetIndex = index;
          target = node[9];
        }
      }  
    }

    var length = target.length;
    var myAry = Array.apply(null, { length }).map(function (undef, i) {
      return i;
  });
    for (var i=0;i<length/2;i++){
      var substituteIndexs = Combinatorics.combination(myAry, i+1);
      var substituteIndex;
      while ( substituteIndex = substituteIndexs.next()){
        var array = [];
        for (var j=0; j<length; j++){
          if (substituteIndex.indexOf(j) >= 0) {
            array.push(getSamePronounce(target[j]));
          }
          else{
            array.push(target[j]);
          }
        }
        var kouhos = allPossibleCases(array);
        for (var kouho of kouhos) {
          var res = mecab.parseSync(kouho);
          if (res.length == 1 && res[0][2] != '固有名詞') {
            dump(nodes, targetIndex, res[0][0]);
          }          
        }
      }
    }
    return [target];
  }  
}

var gag = new GagLator();
gag.translate(process.argv.slice(2)[0]);
