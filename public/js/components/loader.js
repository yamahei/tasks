"use: strinct;";

(function(g){

    const component = {
        template: '#LOADER_TEMPLATE',
        props: ["visible"],
        data: function(){
            return {};
        },
        computed: {
            show_loader: function(){ return !!this.visible; },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {},
    };

    Vue.component('loader', component);
    
})(this);