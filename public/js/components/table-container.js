"use: strinct;";

(function(g){

    const component1 = {
        template: '#TABLE_TITLE_CONTAINER',
    };

    Vue.component('table-title', component1);

    const component2 = {
        template: '#TABLE_BODY_CONTAINER',
        props: ["canvas_width"],
    };
    Vue.component('table-body', component2);
    

})(this);