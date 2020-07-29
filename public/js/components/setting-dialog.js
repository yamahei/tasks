"use: strinct;";

(function(g){

    const component = {
        template: '#SETTING_DIALOG_TEMPLATE',
        props: ["visible", "date_range_from", "date_range_to", "a_day_width", "grouping"],
        data: function(){
            return {};
        },
        computed: {
            show_dialog: function(){ return !!this.visible; },
        },

        beforeMount: function(){},
        mounted: function(){},
        methods: {
            ok: function(){
                const obj = {
                    date_range_from: this.date_range_from * 1,
                    date_range_to: this.date_range_to * 1,
                    a_day_width: this.a_day_width,
                    grouping: this.grouping,
                };
                this.$emit("save", obj);
            },
            cancel: function(){
                this.$emit("cancel");
            },
        },
    };

    Vue.component('setting-dialog', component);
    
})(this);