"use: strinct;";

(function(g){

    const util = function(){};

    //HMSを0にそろえる
    util.prototype.date_to_notime = function(date){
        const d = new Date(date);
        if(!date || isNaN(d)){ return null; }
        d.setHours(0); d.setMinutes(0);
        d.setSeconds(0); d.setMilliseconds(0);
        return d;
    };
    //日で加減算
    util.prototype.date_calc = function(date, add){
        const d = new Date(date);
        if(!date || isNaN(d)){ return null; }
        d.setDate(d.getDate() + add);
        return d;
    };
    //土日を除いた日数を数える
    util.prototype.get_work_days = function(_start, _last){
        const start = this.date_to_notime(_start);
        const last = this.date_to_notime(_last);
        const days = (((+last) - (+start)) / A_DAY_MSEC) + 1;
        const start_day = start.getDay();//start=余りの初日の曜日
        const weeks = Math.floor(days / 7);//何週間か→土日は各2日
        const surplus = days % 7;//週に満たない日数
        let i = start_day;
        let length = surplus;
        let donichi_count = 0;
        while(length-- > 0){
            if(i == 0){ donichi_count += 1;}//日曜
            if(i == 6){ donichi_count += 1;}//土曜
            i = (i+1) % 7;
        }
        return weeks * 2 + donichi_count;
    };
    //日付をMM/DD文字列にする
    util.prototype.date_to_MD = function(date){
        const d = new Date(date);
        if(!date || isNaN(d)){ return null; }
        const format = new DateFormat("MM/dd");
        return format.format(d);
    };
    //日付をYYYY-MM-DD文字列にする
    util.prototype.date_to_YMD = function(date){
        const d = new Date(date);
        if(!date || isNaN(d)){ return null; }
        const format = new DateFormat("yyyy-MM-dd");
        return format.format(d);
    };
    //YYYY-MM-DD文字列を日付にする
    util.prototype.YMD_to_date = function(ymd){
        if(!ymd.match(/^\d\d\d\d-\d\d?-\d\d?$/)){ return null; }
        const format = new DateFormat("yyyy-MM-dd");
        return format.parse(ymd);
    };

    //空文字かどうか
    util.prototype.is_empty = function(val){//0, false以外のfalsyだけtrue
        if(!val){
            if(val === 0){ return false; }
            if(val === false){ return false; }
            return true;
        }else{
            return false;
        }
    };
    //強く確認
    util.prototype.hard_confirm = function(action, key){
        const message = [
            `【注意】 ${action} を実行しますか？`, 
            "この操作は取り消せません。", "",
            `実行する場合は ${key} と正確に入力してください。`
        ].join("\n");
        const input = prompt(message);
        return (input === key);
    };
    util.prototype.confirm_reload = function(message){
        if(confirm(message)){ g.location.reload(); }
    };
    //項目を指定してlocalstorageに保存する
    util.prototype.save_items = function(items, object){
        const data = {};
        items.forEach(function(item){
            data[item] = object[item];
        });
        g.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };
    util.prototype.load_items = function(items, object){
        const data = JSON.parse(g.localStorage.getItem(STORAGE_KEY));
        if(!data){ return; }
        items.forEach(function(item){
            if(data[item] !== undefined){
                object[item] = data[item];
            }
        });
    };


    g.Util = new util();

})(this);