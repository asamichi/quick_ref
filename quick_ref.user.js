// ==UserScript==
// @name            quick reference
// @namespace       asamichi
// @description  Ctrl+l:Copy the title and URL of this page, as well as the selected quote.
// @include      *
// @exclude      
// ==/UserScript==

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
            output = "参考:" + title + "\n" + url + "\n> " + selectedText; 
        }

        return output;
    }

    document.addEventListener('keydown', (e) => {
   if (e.key === 'l' && e.ctrlKey && !e.shiftKey) {
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
    execCopy( gen(title,url,selectedText) );
   }
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
