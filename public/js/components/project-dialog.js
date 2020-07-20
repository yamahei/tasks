"use: strinct;";

(function(g){

    const component = {
        template: '#PROJECT_DIALOG_TEMPLATE',
        props: ["visible", "project"],
        data: function(){
            return {
                local: {
                    name: "", note: "", volume: 0,
                    start: "", last: "",
                },
            };
        },
        watch: {
            visible: function(present, old){
                if(!present){
                    this.local.name   = "";
                    this.local.note   = "";
                    this.local.volume = 0;
                    this.local.start  = "";
                    this.local.last   = "";
                }
            },
            project: function(present, old){
                if(present){
                    this.local.name = present.name;
                    this.local.note = present.note;
                    this.local.volume = present.volume;
                    this.local.start = present.start;
                    this.local.last = present.last;
                }
            },
        },
        computed: {
            show_dialog: function(){ return !!this.visible; },
            show_remove: function(){ return !!this.project; },
            valid: function(){
                if(Util.is_empty(this.local.name)){ return false; }
                if(Util.is_empty(this.local.volume)){ return false; }
                if(Util.is_empty(this.local.start)){ return false; }
                if(Util.is_empty(this.local.last)){ return false; }
                const start = new Date(this.local.start);
                const last = new Date(this.local.last);
                if(last < start){ return false; }
                return true;
            },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            cancel: function(){ this.$emit("cancel"); },
            remove: function(){ this.$emit("remove", this.project); },
            ok: function(){
                if(!this.valid){ return; }
                const obj = Object.assign({}, this.project || {});
                obj.name   = this.local.name;
                obj.note   = this.local.note;
                obj.volume = this.local.volume * 1;
                obj.start  = this.local.start;
                obj.last   = this.local.last;
                if(this.project){
                    this.$emit("edit", obj);
                }else{
                    this.$emit("append", obj);
                }
            },
        },
    };

    Vue.component('project-dialog', component);
    
})(this);