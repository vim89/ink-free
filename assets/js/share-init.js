"use strict";

(function(){
  function onCopyClick(e){
    var btn = e.currentTarget;
    var url = btn.getAttribute('data-copy-url') || window.location.href;
    var done = function(){
      var old = btn.textContent;
      btn.textContent = 'Copied';
      btn.disabled = true;
      setTimeout(function(){ btn.textContent = old || 'Copy Link'; btn.disabled = false; }, 1200);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function(){
          var ta = document.createElement('textarea');
          ta.value = url; document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta); done();
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta); done();
      }
    } catch(_){}
  }

  function init(){
    var copyBtns = document.querySelectorAll('.social-share .share-copy');
    for (var i=0;i<copyBtns.length;i++){
      copyBtns[i].addEventListener('click', onCopyClick);
    }

    var shareBtns = document.querySelectorAll('.social-share .share-discord');
    var shareHandler = function(e){
      var btn = e.currentTarget;
      var title = btn.getAttribute('data-share-title') || document.title;
      var text = btn.getAttribute('data-share-text') || '';
      var url = btn.getAttribute('data-share-url') || window.location.href;
      if (navigator.share) {
        navigator.share({ title: title, text: text, url: url }).catch(function(){});
      } else {
        // Fallback: copy link and prompt user to paste into Discord
        var temp = document.createElement('textarea');
        temp.value = url; document.body.appendChild(temp); temp.select();
        try { document.execCommand('copy'); } catch(_){}
        document.body.removeChild(temp);
        btn.title = 'Link copied — paste in Discord';
      }
    };
    for (var j=0;j<shareBtns.length;j++){
      shareBtns[j].addEventListener('click', shareHandler);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
