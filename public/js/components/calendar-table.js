"use: strinct;";

(function(g){

    const component = {
        template: '#CALENDAR_TABLE_TEMPLATE',
        props: ["base", "scroll_x", "a_day_width", "date_range_from", "date_range_to"],
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
                    this.set_range(base);
                    const param = {
                        base: base,
                        start: this.start,
                        last: this.last,
                    };
                    this.$emit("change", param);//再読み込みさせるイベント
                }else{
                    this.start = null;
                    this.last = null;
                    this.months = [];
                    this.days = [];
                }
            },
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
        computed: {},
        beforeMount: function(){},
        mounted: function(){},
        methods: {
            set_range: function(base){
                const self = this;
                const start = this.start = Util.date_calc(base, -this.date_range_from);
                const last = this.last = Util.date_calc(base, this.date_range_to);
                const _base = Util.date_to_notime(base);
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
                        today: !!(+_base == +now_date),
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
                const date = day.raw.getDate();
                const color = (()=>{
                    switch(yobi){
                        case 0: return "hotpink";//sun
                        case 6: return "skyblue";//sat
                        default: return "white";//other
                    };
                })();
                const size = (date < 10) ? `calc(${this.a_day_width} * 0.7)` : `calc(${this.a_day_width} * 0.5)`;
                return [
                    `width: ${this.a_day_width} !important`,
                    `background-color: ${color}`,
                    `font-size: ${size}`,
                ].join(";");
            },
        },
    };

    Vue.component('calendar-table', component);
    
})(this);