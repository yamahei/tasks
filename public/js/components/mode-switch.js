"use: strinct;";

(function(g){

    const component = {
        template: '#MODE_SWITCH_TEMPLATE',
        props: ["mode"],
        data: function(){
            return {};
        },
        computed: {
            mode_is_project: function(){ return !!(this.mode == MODE_PROJECT); },
            mode_is_member: function(){ return !!(this.mode == MODE_MEMBER); },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            switch_to_project: function(){
                if(this.mode_is_member){
                    this.$emit("change", { mode: MODE_PROJECT });
                }
            },
            switch_to_member: function(){
                if(this.mode_is_project){
                    this.$emit("change", { mode: MODE_MEMBER });
                }
            },
        },
    };

    Vue.component('mode-switch', component);
    
})(this);