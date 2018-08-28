import test from 'ava'
let GagLator = require ('../index')

test('getSamePronounce 1', t => {
  t.deepEqual(GagLator.getSamePronounce('カ'),
  new Set (['キ', 'ク', 'ケ', 'コ',
   'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
   'ア', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ','ラ','ワ', 
   'キャ', 'シャ', 'チャ', 'ニャ', 'ヒャ', 'ミャ', 'リャ',
   'ザ', 'ダ', 'バ', 'パ', 'ダ',
   'ギャ', 'ジャ']))
  })

test('getSamePronounce 2', t => {
  t.deepEqual(GagLator.getSamePronounce('キ'),
  new Set(['カ', 'ク', 'ケ', 'コ',
     'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
     'イ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ', 'リ',
     'ギ', 'ジ', 'ヂ', 'ビ', 'ピ']))
})

test('getSamePronounce 3', t => {
  t.deepEqual(GagLator.getSamePronounce('ク'),
    new Set(['カ', 'キ', 'ケ', 'コ',
       'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
       'ウ', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ','ル', 
       'ズ', 'ヅ', 'ブ', 'プ']))
})
    
test('getSamePronounce 4', t => {
  t.deepEqual(GagLator.getSamePronounce('ケ'),
    new Set (['カ', 'キ', 'ク', 'コ',
       'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
       'エ', 'セ', 'テ', 'ネ', 'ヘ', 'メ', 'レ', 
       'ゼ', 'デ', 'ベ', 'ペ']))
})
  
test('getSamePronounce 5', t => {
  t.deepEqual(GagLator.getSamePronounce('コ'),
    new Set(['カ', 'キ', 'ク', 'ケ',
       'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
       'オ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ','ロ', 'ヲ',
       'ゴ', 'ゾ', 'ド', 'ボ', 'ポ']))
})
  
test('all possible cases', t => {
  t.deepEqual(new Set(GagLator.allPossibleCases([['ア','オ'],['カ','キ']])),
    new Set(['アカ', 'オカ', 'アキ','オキ']))
})

test('substitute', t => {
  t.deepEqual(GagLator.substitute(['ア','イ'], 0, 'オ'),
    'オイ')
})

test('setupTarget', t => {
  var gag = new GagLator();
  gag.setupTarget([ [ '猫', '名詞', '一般', '*', '*', '*', '*', '猫', 'ネコ', 'ネコ' ],
  [ 'に', '助詞', '格助詞', '一般', '*', '*', '*', 'に', 'ニ', 'ニ' ],
  [ '小判', '名詞', '一般', '*', '*', '*', '*', '小判', 'コバン', 'コバン' ] ]);
  
  t.is(gag.targetIndex, 2);
})

test('setupKouho', t => {
  var gag = new GagLator();
  gag.setupTarget([ [ 'シーン', '名詞', '一般', '*', '*', '*', '*', 'シーン', 'シーン', 'シーン' ]
]);
  var result = gag.setupKouho();
  t.deepEqual(result.size, 20);
  t.true(result.has('サーン'));
  t.true(result.has('スーン'));
  t.true(result.has('セーン'));
  t.true(result.has('ソーン'));
  t.true(result.has('ザーン'));
  t.true(result.has('ジーン'));
  t.true(result.has('ズーン'));
  t.true(result.has('ゼーン'));
  t.true(result.has('ゾーン'));
  t.true(result.has('イーン'));
  t.true(result.has('キーン'));
  t.true(result.has('チーン'));  
  t.true(result.has('ニーン'));  
  t.true(result.has('ヒーン'));  
  t.true(result.has('ミーン'));  
  t.true(result.has('リーン'));  
  t.true(result.has('ギーン'));  
  t.true(result.has('ヂーン'));  
  t.true(result.has('ビーン'));  
  t.true(result.has('ピーン'));  
})

test('translate', async t => {
  var gag = new GagLator();
  await gag.translate('猫に小判').then(function (res){
    var result = new Set(res);
    t.deepEqual(result.size, 12);
    t.true(result.has('猫にカバン'));
    t.true(result.has('猫にゴハン'));
    t.true(result.has('猫にロビン'));
    t.true(result.has('猫にボビン'));
    t.true(result.has('猫にカカン'));
    t.true(result.has('猫にトタン'));
    t.true(result.has('猫にボタン'));
    t.true(result.has('猫にガマン'));
    t.true(result.has('猫にロマン'));
    t.true(result.has('猫にカバン'));
    t.true(result.has('猫にカラン'));
    t.true(result.has('猫にモダン'));
  });
})
