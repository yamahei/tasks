"use: strinct;";

(function(g){

    const component = {
        template: '#PROJECT_TABLE_TEMPLATE',
        props: ["project", "basedate", "hash_assigned_members", "scroll_x", "a_day_width"],
        data: function(){
            return {};
        },
        watch: {
            scroll_x: function(present, old){//TODO: xxx-table.jsみんな同じ
                const x = (present || 0) * 1;
                const $me = this.$refs.content;
                const $parent = $me.parentElement;
                if(!$parent){ return; }
                const $grand = $parent.parentElement;
                if(!$grand){ return; }
                const scrollLeft = $grand.scrollLeft;
                if(x != scrollLeft){
                    $grand.scrollTo(x, 0);
                }
            },
        },
        computed: {
            assigned_members: function(){
               return this.hash_assigned_members[this.project.id];
            },
            project_style: function(){
                const basedate = this.basedate;
                const project = this.project;

                if(!basedate.start || !basedate.last){ return; }
                const app_start = +basedate.start / A_DAY_MSEC;
                const app_last = +basedate.last / A_DAY_MSEC;
                const pj_start = +(new Date(project.start)) / A_DAY_MSEC;
                const pj_last = +(new Date(project.last)) / A_DAY_MSEC;
                const is_left_over = !!(app_start > pj_start);
                const is_right_over = !!(app_last < pj_last);
                const x1 = is_left_over ? 0 : (pj_start - app_start);
                const x2 = (is_right_over ? app_last : pj_last) - app_start;
                const w = x2 - x1 + 1;
                return {
                    "position": "relative",
                    "left": `calc(${this.a_day_width} * ${x1})`,
                    "width": `calc(${this.a_day_width} * ${w})`,
                };
            },
            project_class: function(){
                const basedate = this.basedate;
                const project = this.project;
                if(!basedate.start || !basedate.last){ return; }
                const app_start = +basedate.start / A_DAY_MSEC;
                const app_last = +basedate.last / A_DAY_MSEC;
                const pj_start = +(new Date(project.start)) / A_DAY_MSEC;
                const pj_last = +(new Date(project.last)) / A_DAY_MSEC;
                const is_left_over = !!(app_start > pj_start);
                const is_right_over = !!(app_last < pj_last);
                return {
                    "arrow-left": !is_left_over,
                    "arrow-right": !is_right_over,
                };
            },
        },
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            // assign_member: function(){
            //     this.$emit("assign", this.project);
            // },
        },
    };

    Vue.component('project-table', component);
    
})(this);