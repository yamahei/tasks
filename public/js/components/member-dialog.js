"use: strinct;";

(function(g){

    const component = {
        template: '#MEMBER_DIALOG_TEMPLATE',
        props: ["visible", "member"],
        data: function(){
            return {
                local: {
                    name: "",
                },
            };
        },
        watch: {
            visible: function(present, old){
                if(!present){ this.local.name = ""; }
            },
            member: function(present, old){
                if(present){ this.local.name = present.name; }
            },
        },
        computed: {
            show_dialog: function(){ return !!this.visible; },
            show_remove: function(){ return !!this.member; },
            valid: function(){
                if(Util.is_empty(this.local.name)){ return false; }
                return true;
            },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            remove: function(){ this.$emit("remove", this.member); },
            cancel: function(){ this.$emit("cancel"); },
            ok: function(){
                if(!this.valid){ return; }
                const obj = Object.assign({}, this.member || {});
                obj.name = this.local.name;
                if(this.member){
                    this.$emit("edit", obj);
                }else{
                    this.$emit("append", obj);
                }                                
            },
        },
    };

    Vue.component('member-dialog', component);
    
})(this);