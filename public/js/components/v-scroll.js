"use: strinct;";

(function(g){

    //カスタムスクロールディレクティブの作成
    //https://jp.vuejs.org/v2/cookbook/creating-custom-scroll-directives.html
    //vueでスクロール検知
    //https://scrapbox.io/web/vueでスクロール検知
    Vue.directive('scroll', {
        inserted: function ($el, binding) {
            const callback = function ($event) {
                if (binding.value($event, $el)) {
                    $el.removeEventListener('scroll', callback);
                }
            }
            $el.addEventListener('scroll', callback);
        }
    })
    
})(this);