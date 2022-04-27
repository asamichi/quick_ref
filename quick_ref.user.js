// ==UserScript==
// @name         quick reference
// @namespace    asamichi
// @version      0.4
// @description  Ctrl+l:Copy the title and URL of this page, as well as the selected quote.
// @include      *
// @exclude      
// @require     https://riversun.github.io/jsframe/jsframe.js
// @downloadURL https://asamick.s3.ap-northeast-1.amazonaws.com/userscript/quick_ref.user.js
// @updateURL   https://asamick.s3.ap-northeast-1.amazonaws.com/userscript/quick_ref.user.js
// ==/UserScript==
//お借りしたライブラリ
//https://qiita.com/riversun/items/1adffa5674bc5123b16d
//keycode http://faq.creasus.net/04/0131/CharCode.html

(function(){
    // ここに処理を記載する
    var debug = 0; //1ならデバッグモード

    //出力フォーマットを変えたい場合には、genの返り値を変えれば変更できます
    function gen(title,url,selectedText){
        var output = "";

        if(selectedText == ""){
            //引用無し
            output = "参考:" + title + "\n" + url + "\n";
        }
        else{
            //引用有り
            output = "参考:" + title + "\n" + url + "\n```\n" + selectedText + "\n```\n"; 
        }

        return output;
    }

    //Ctrl+Cで引用符付けるかどうかのフラグ
    var flag = 0;
    //Copyする文を保持。Clipbord毎度loadしてもいいけど、別のやつコピーするの挟んだりするとこっちのがいいかなって
    var ref = "";
    //トーストメニュー用
    const jsFrame = new JSFrame();
    /*
    // copy url & selexted text to clipboard, 1-line ([無変換] & [Shift] & [Y])
    if (keyStatus[29] && keyStatus[89] && keyStatus[16]) {
    */

    let keyStatus = {};
    document.addEventListener('keydown', (e) => {
    keyStatus[e.keyCode] = true;
    //ctlr + L || 無変換 + L
   if ( (e.key === 'l' && e.ctrlKey && !e.shiftKey) || (keyStatus[29] && keyStatus[76] && !keyStatus[16]) ) {
       if(flag == 0){
           flag = 1;
           jsFrame.showToast({
            html: '引用モード<br>Ctrl+Cで引用符付きコピー' , align: 'center', duration: 2000
        });
       }
       else if(flag == 1){
           flag = 0;
           jsFrame.showToast({
            html: '引用モード解除' , align: 'center', duration: 2000
        });
        return 0;
       }

        //タイトルを取得
        var title = document.title;
        //URLを取得
        var url = location.href;

        //選択部分の文字列を取得
        const selectedText = window.getSelection().toString();

        //alert("参考:" + title + "\n" + url + "\n> " + selectedText);
        if(debug == 1){
        alert( gen(title,url,selectedText) );
        }

        ref = gen(title,url,selectedText)
        execCopy(ref);
    }

   if (e.key === 'c' && e.ctrlKey && !e.shiftKey && flag == 1) {
        jsFrame.showToast({
            html: '引用を追加しました' , align: 'center', duration: 2000
        });
        //選択部分の文字列を取得
        ref  = ref + "```\n" + window.getSelection().toString() + "\n```\n";
        execCopy(ref);
   }
 })

 document.addEventListener("keyup", (event) => {
    keyStatus[event.keyCode] = false
  })

    //クリップボードにコピーする。過去遺産の使いまわし
    function execCopy(string) {
    var temp = document.createElement('div');
    temp.appendChild(document.createElement('pre')).textContent = string;
    document.body.appendChild(temp);
    document.getSelection().selectAllChildren(temp);
    var result = document.execCommand('copy');
    document.body.removeChild(temp);
    return result;
    }

})();

