"use: strinct;";

(function(g){

    const component = {
        template: '#CALENDAR_TABLE_TEMPLATE',
        props: ["base", "scroll_per"],
        data: function(){
            return {
                start: null,
                last: null,
                months: [],
                days: [],
                scroll: 0,
            };
        },
        watch: {
            base: function(present, old){
                if(present){
                    base = new Date(present);
                    this.start = Util.date_calc(base, -DATE_RANGE_PREV);
                    this.last = Util.date_calc(base, DATE_RANGE_FORE);
                    this.set_range(this.start, this.last);
                    const self = this;
                    const param = {
                        base: base,
                        start: this.start,
                        last: this.last,
                    };
                    this.$emit("change", param);
                }else{
                    this.start = null;
                    this.last = null;
                    this.months = [];
                    this.days = [];
                }
            },
            scroll_per: function(present, old){
                const per = (present || 0) * 1;
                const $me = this.$refs.content;
                const $parent = $me.parentElement;
                if(!$parent){ return; }
                const $grand = $parent.parentElement;
                if(!$grand){ return; }
                const canvas_width = $parent.scrollWidth;
                const frame_width = $grand.clientWidth;
                const x = (canvas_width - frame_width) * (per / 100);
                if(x >= 0){
                    $grand.scrollTo(x, 0);
                    const param = { scroll_per: present, scroll_x: x };
                    this.$emit("scroll", param);
                }
            },
        },
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            set_range: function(start, last){
                const self = this;
                this.months.splice(0);//delete all
                this.days.splice(0);//delete all
                let last_month = null;
                let date = Util.date_to_notime(start);
                while(true){
                    const now_date = new Date(date);
                    const now_month = now_date.getMonth() + 1;
                    const day = {
                        raw: now_date, month: now_month,
                        number: now_date.getDate(), 
                        label: Util.date_to_MD(now_date),
                    };
                    this.days.push(day);
                    if(last_month != now_month){
                        const month = {
                            raw: now_date, number: now_month,
                            label: `${now_month}月`, days: -1,//set after.
                        };
                        this.months.push(month);
                    }
                    last_month = now_month;
                    date = Util.date_calc(date, 1);
                    if(+last < +date){ break; }
                }
                this.months.forEach(function(m){
                    const days = self.days.filter(function(d){
                        return m.number == d.month;
                    });
                    m.days = days.length;
                });
            },
            getDayStyle: function(day){
                const yobi = day.raw.getDay();
                switch(yobi){
                    case 0: return "background-color: hotpink;";//sun
                    case 6: return "background-color: skyblue;";//sat
                    default: return "background-color: white;";//other
                };
            },
        },
    };

    Vue.component('calendar-table', component);
    
})(this);