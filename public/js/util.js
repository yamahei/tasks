"use: strinct;";

(function(g){

    const util = function(){};

    //HMSを0にそろえる
    util.prototype.date_to_notime = function(date){
        if(!date || isNaN(date)){ return null; }
        const d = new Date(date);
        d.setHours(0); d.setMinutes(0);
        d.setSeconds(0); d.setMilliseconds(0);
        return d;
    };
    //日で加減算
    util.prototype.date_calc = function(date, add){
        if(!date || isNaN(date)){ return null; }
        const d = new Date(date);
        d.setDate(d.getDate() + add);
        return d;
    };
    //日付をMM/DD文字列にする
    util.prototype.date_to_MD = function(date){
        if(!date || isNaN(date)){ return null; }
        const format = new DateFormat("MM/dd");
        return format.format(date);
    };
    //日付をYYYY-MM-DD文字列にする
    util.prototype.date_to_YMD = function(date){
        if(!date || isNaN(date)){ return null; }
        const format = new DateFormat("yyyy-MM-dd");
        return format.format(date);
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
    }


    g.Util = new util();

})(this);