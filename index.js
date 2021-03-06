var MeCab = new require('mecab-async')
  , mecab = new MeCab();
var Combinatorics = require('js-combinatorics');
var Es6PromisePool = require('es6-promise-pool');

/**
 * Promise Pool
 *
 * Extends the es6-promise-pool class to enable it to function much
 * like Promise.all() functions by returning the array of results.
 */
class PromisePool extends Es6PromisePool {
  /**
   * Constructor
   *
   * @param {Function} source - function to generate data
   * @param {Number} concurrency - amount of concurrency
   * @param {Object} options - key value pairs of options
   */
  constructor(source, concurrency, options) {
    super(source, concurrency, options);
    this.resolves = [];
  }

  /**
   * Start
   *
   * @return {Promise}
   */
  start() {
    this.addEventListener('fulfilled', (event) => {
      this.resolves.push(event.data.result);
    });

    return super.start().then(() => {
      return Promise.resolve(this.resolves);
    });
  }
}

class GagLator {

  static get GYOUS(){
    return [
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
    }
    static get DANS() {
    return  [
      ['ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ', 
      'キャ', 'シャ', 'チャ', 'ニャ', 'ヒャ', 'ミャ', 'リャ',
      'ガ', 'ザ', 'ダ', 'バ', 'パ' , 'ダ',
      'ギャ', 'ジャ'],
      ['イ', 'キ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ',       'リ',
       'ギ', 'ジ', 'ヂ' ,'ビ', 'ピ'],
      ['ウ', 'ク', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ', 'ル',
       'グ', 'ズ', 'ヅ', 'ブ', 'プ'],
      ['エ', 'ケ', 'セ', 'テ', 'ネ', 'ヘ', 'メ',       'レ',
       'ゲ', 'ゼ', 'デ', 'ベ', 'ペ'],
      ['オ', 'コ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ', 'ロ', 'ヲ',
       'ゴ', 'ゾ', 'ド', 'ボ', 'ポ']
    ];
  }
  
  static getSamePronounce(letter){
    var set = new Set();
    for (let gyou of GagLator.GYOUS) {
      var index = gyou.indexOf(letter);
      if (index >=0){
        for (let [i, word] of gyou.entries() ){
          if (i != index) {
            set.add(word);
          }
        }
      }
    }
    for (let dan of GagLator.DANS) {
      var index = dan.indexOf(letter);
      if (index >=0){
        for (let [i, word] of dan.entries() ){
          if (i != index) {
            set.add(word);
          }
        }
      }
    }
    return set;
  }

  static allPossibleCases(arr) {
    if (arr.length == 1) {
      return arr[0];
    } else {
      var result = [];
      var allCasesOfRest = GagLator.allPossibleCases(arr.slice(1));  // recur with the rest of array
      for (var i = 0; i < allCasesOfRest.length; i++) {
        for (var j = 0; j < arr[0].length; j++) {
          result.push(arr[0][j] + allCasesOfRest[i]);
        }
      }
      return result;
    }
  }
  
  static substitute(nodes, subIndex, value) {
    var result = '';
    for (let [i, node] of nodes.entries()) {
      if (i == subIndex ){
        result += value;
      } else {
        result += node[0];
      }
    }
    return result;
  }
  
  setupTarget(nodes) {

    this.targetIndex = null;
    this.target = '';
    var maxLength = 0;
    for ( let [index, node] of nodes.entries() ) {
      if ( node[1] == '名詞') {
        if (node[9].length >= maxLength){
          maxLength = node[9].length;
          this.targetIndex = index;
          this.target = node[9];
        }
      }  
    }
  }

  setupKouho(){

    var length = this.target.length;
    var myAry = Array.apply(null, { length }).map(function (undef, i) {
    return i;
  });
    var kouhoSet = new Set();
    for (var i=0;i<length/2;i++){
      var substituteIndexs = Combinatorics.combination(myAry, i+1);
      var substituteIndex;
      while ( substituteIndex = substituteIndexs.next()){

        var array = [];
        for (var j=0; j<length; j++){
          if (substituteIndex.indexOf(j) >= 0) {
            var same = GagLator.getSamePronounce(this.target[j]);
            if (same.length == 0 ){
              array.push(target[j]);
            } else {
              array.push([...same]);
            }            
          }
          else{
            array.push(this.target[j]);
          }
        }
        for(var element of GagLator.allPossibleCases(array)){
          kouhoSet.add(element);
        }
      }
    }
    return kouhoSet;
  }
  translate(text){

    var nodes = mecab.parseSync(text);
    this.setupTarget(nodes);
    var kouhoSet = this.setupKouho();

  
    var promiseProducer;
    var index = 0;
    var kouhoArray = [...kouhoSet];
    var that = this;

    promiseProducer = function () {

      if (index >= kouhoSet.size){
        return null;
      }
      return new Promise((resolve, reject) => {
        mecab.parse(kouhoArray[index++], function(err,result){
          var sub = null;
          if (result && result.length == 1 && result[0][1] == '名詞' && 
          !(result[0][2] == '固有名詞' && (result[0][3] == '地域' || result[0][3] == '組織' || result[0][3] == '人名'))) {
            sub = GagLator.substitute(nodes, that.targetIndex, result[0][0])
          } 
          resolve(sub);
        })
      })     
    };

    var promise = new Promise( function (resolve, reject) {

      var pool = new PromisePool(promiseProducer, 15);

      pool.start().then(
        function(results){
          // returen values in this.resolves
          const result = results.filter(word => word != null);
          resolve(result);
        }
      )  

    })
    return promise;
  }
}  

module.exports = GagLator; 
