# BattleTanks
##各自課題
残り2,3週間で以下1,2,3,4の実装に挑戦する．  
実装した結果を自分のGitHubに載せる．  
できなくても構わないができたらうれしいです．( ≥ω≤)/
  
どうプログラムしていくかも機能が実現できれば良いので任せます．  

###1.AIのアルゴリズム
移動AIと攻撃AIのアルゴリズムを考える.  
プログラムの必要はないが，もしゲームのモデルが完成したら試せるようにします．  
####移動AI
1. プレイヤーのもとに移動することを優先するAI
2. 旗のもとに移動することを優先するAI

####攻撃AI
* プレイヤーの方を向き攻撃するAI

####前提条件
1. プレイヤーと旗の座標を知ることができる．
2. 障害物の大きさ，位置を知ることができる．
3. 他に条件が必要ならば自分で定めても構わない．

####思考ルーチン
基本的には「条件がAならばBする．そうでないならCする」方式で，1ターンごとに1動作を決める．

####可能動作
以下の動作を実行できる

#####移動AI
* 前進
* 後退
* 停止
* 右旋回
* 左旋回

#####攻撃AI
* 発砲
* 右回転
* 左回転
* 狙う  
※砲の上下回転は「狙う」という動作を実行すると距離をもとに自動的に行ってくれるとする

###2.マウスポインタロックの実装
[ここ](https://developer.mozilla.org/ja/docs/API/Pointer_Lock_API)読んでポインタロックのオン／オフとイベント検知をマルチブラウザで行えるようにする．  
定義してほしい関数は

* pointerLockOn関数　：　ポインタロックのオン
* pointerLockOff関数　：　ポインタロックのオフ
* pointerLockMouse関数　：　ポインタロックイベントの値の取得

他に必要な関数などなどは好きに記述してOK

###3.ファイルの動的ロード
ファイルをHTMLのheadタグに書かずに必要とするファイルからinclude文のように呼び出せる関数を実現する．  
(例)

```
// とあるvar.jsの先頭行で  
include("foo.js"); // foo.js が読み込まれる
```

上記のようなものが実現できれば手段は問わない．


###4. 音の再生
sound.htmlのソースをコピペまたはダウンロードし，

* volume関数　：　音量調整関数
* play関数　：　音再生関数

を実装する．   

####条件
1. volume関数は引数に0~1の数値をとり，0で消音，1で最大音量となるようにする．  
2. play関数は音を再生する．  
3. 音源は好きなものでOK
4. 音源の参照変数をどこに書いてもOK
5. 必要な変数，関数を記述してもOK

whenKeyDown関数はキー入力で

* p：再生
* u：消音
* i：中間音量
* o：最大音量  

となるように実装されているので，そこはいじる必要はないが好きにしてもかまわない．  
与力があれば，音の停止や複数音源に対応してもらえるとうれしいです．
