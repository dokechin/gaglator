# gaglator

Japanese oyaji gag generator.

This program depends on mecab.
http://taku910.github.io/mecab/#download

## install
git clone https://github.com/dokechin/gaglator
// change directory to your project.
npm install <gaglator directory>

## synopsys
```
  let GagLator = require ('../gaglator')
  var gag = new GagLator();
  gag.translate('猫に小判').then(function (res){
    console.log(res);
    // ['猫にカバン', '猫にゴハン', '猫にロビン', '猫にボビン', '猫にカカン',
    //  '猫にトタン', '猫にボタン', '猫にガマン', '猫にロマン', '猫にカバン',
    //  '猫にカラン', '猫にモダン']
  });
 ```
