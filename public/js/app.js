"use: strinct;";

(function(g){


    const dialog = {
        member: {//メンバー編集
            visible: false,
            member: null,
        },
        assign_project: {//アサインプロジェクト（メンバーに紐づく）
            visible: false,
            projects_all: [],//TODO: 過去を除く？
            projects: [],
        },
        project: {//プロジェクト編集
            visible: false,
            project: null,
        },
        assign_member: {//アサインメンバー（プロジェクトに紐づく）
            visible: false,
            project: null,
        },
    };
    const basedate = {
        base: null, //String: set in mounted or user
        start: null,//Date: set in event by component
        last: null, //Date: set in event by component
    };
    const state = {
        //ローダー
        loader: { visible: false },
        //モード
        mode: MODE_PROJECT,
        //プロジェクト名のグルーピング（/区切りの先頭）
        grouping: false,
        //基準日
        basedate: basedate,
        //スクロール同期
        scroll_per: 0,//set by ui
        scroll_x: 0,//set by component, and refer from component
        //ダイアログ
        dialog: dialog,
        //
        projects: [],
        members_all: [],
        assigns: [],
    };
    const save_func = function(){
        Util.save_items(HOLDING_ITEMS, state);
    };
    const load_func = function(){
        Util.load_items(HOLDING_ITEMS, state);
    };
    g.STATE = state;
    const app = new Vue({
        el: '#app',
        data: state,
        computed: {
            canvas_width: function(){
                return `width: calc(${A_DAY_WIDTH} * (${DATE_RANGE_FORE} + ${DATE_RANGE_PREV}));`
            },
            hash_members: function(){
                if(!this.members_all){ return null; }
                //reduceだとなんか変なので泥臭くやる
                const obj = {};
                this.members_all.forEach(function(member){
                    obj[member.id] = member;
                });
                return obj;
            },
            hash_projects: function(){
                if(!this.projects){ return null; }
                //reduceだとなんか変なので泥臭くやる
                const obj = {};
                this.projects.forEach(function(project){
                    obj[project.id] = project;
                });
                return obj;

            },
            mode_is_project: function(){ return !!(this.mode == MODE_PROJECT); },
            mode_is_member: function(){ return !!(this.mode == MODE_MEMBER); },
            sorted_projects: function(){
                return this.projects.sort(function(a, b){
                    if(a.name == b.name){
                        return a.id * 1 - b.id * 1;
                    }else if(a.name < b.name){
                        return -1;
                    }else if(a.name > b.name){
                        return 1;
                    }else{
                        return 0;
                    }
                });
            },
        },
        beforeMount: function(){
            load_func();
            this.load_all_members();
        },
        mounted: function(){
            const self = this;
            //初期化
            API.set_hooks(
                function(){ self.show_loader(); },
                function(){ self.hide_loader(); },
                function(error){
                    const status = error?.response?.status;
                    const reason = error?.response?.data?.message ||error?.response?.statusText;
                    const typical = TYPICAL_ERROR_RESPONSES[status] || null;
                    const messages = ["エラーが発生しました。"];
                    if(reason){ messages.push(`  理由：${reason}`); }
                    if(status){ messages.push(`  ステータスコード：${status}`); }
                    if(typical){ messages.push(`  一般的な原因：${typical}`); }
                    messages.push("データの整合性が崩れている可能性があります。ブラウザをリロードしてよいですか？");
                    Util.confirm_reload(messages.join("\n"));
                },
            );
            const base = Util.date_to_notime(new Date());
            this.basedate.base = Util.date_to_YMD(base);
        },
        methods: {
            show_loader: function(){
                this.loader.visible = true;
            },
            hide_loader: function(){
                this.loader.visible = false;
            },
            load_all_members: function(){
                const self = this;
                API.load_all_members()
                .then(function(response){
                    const members = response.data;
                    self.members_all.splice(0);//delete all
                    self.members_all.splice(0, 0, ...members);//append all
                });
            },
            /**
             * ビジネスロジック化するかも
             */
            find_project_by_projectid: function(project_id){
               return this.projects.find(function(project){
                   return project.id === project_id;
               });
            },
            find_member_by_memberid: function(member_id){
                return this.members_all.find(function(member){
                    return member.id === member_id;
                });
            },
            get_assigned_members: function(project_id){
                const self = this;
                const assigns = this.assigns.filter(function(assign){
                    return assign.project_id == project_id;
                })
                const members = assigns.map(function(assign){
                    return self.find_member_by_memberid(assign.member_id);
                });
                return members;
            },
            /**
             * モード変更
             */
            on_change_mode: function($event){
                const self = this;
                const scroll_per = this.scroll_per;
                this.scroll_per = "0";//スクロール位置復元
                this.mode = null;//強制再描画
                this.$nextTick(function(){
                    self.mode = $event.mode;
                    this.scroll_per = scroll_per;
                    save_func();
                });
            },
            /**
             * 基準日変更⇒読み直し⇒コンポーネントに波及
             */
            on_basedate_to_prev: function(){
                const base = this.basedate.base;
                const date = new Date(base);
                const new_date = Util.date_calc(date, -7);
                this.basedate.base = Util.date_to_YMD(new_date);
            },
            on_basedate_to_forward: function(){
                const base = this.basedate.base;
                const date = new Date(base);
                const new_date = Util.date_calc(date, 7);
                this.basedate.base = Util.date_to_YMD(new_date);
            },
            on_change_basedate: function($event){//dates:{ base, start, last }
                //まだbasedateにセットしない（読込成功時に一緒にセットする）
                this.load_projects($event.start, $event.last);
            },
            load_projects: function(start, last){
                const self = this;
                API.load_project_relation(Util.date_to_YMD(start), Util.date_to_YMD(last))
                .then(function(response){
                    const data = response.data;
                    self.projects.splice(0);//delete all
                    self.projects.splice(0, 0, ...data.projects);//append all
                    self.assigns.splice(0);//delete all
                    self.assigns.splice(0, 0, ...data.assigns);//append all
                    self.basedate.start = start;
                    self.basedate.last = last;
                });
            },
            /**
             * カレンダースクロール⇒同期
             */
            on_calendar_scroll: function($event){
                if(this.scroll_per == $event.scroll_per){
                    this.scroll_x = $event.scroll_x;
                    save_func();
                }
            },
            /**
             * Assign
             */
            assign_member: function(project){
                this.dialog.assign_member.project = project;
                this.dialog.assign_member.visible = true;
            },
            on_regist_assign_member: function($event){//{ project, [member] }
                const project_id = $event.project.id;
                const new_member_ids = $event.assigns.map(function(member){ return member.id; }).sort();
                const old_member_ids = this.get_assigned_members(project_id).map(function(member){ return member.id; }).sort();
                const append_list = [];
                const delete_list = [];
                let new_mid = new_member_ids.shift();
                let old_mid = old_member_ids.shift();
                while(true){
                    if(new_mid === undefined && old_mid === undefined){//終わり
                        break;
                    }else if(new_mid === old_mid){//両方に存在⇒何もしない
                        new_mid = new_member_ids.shift();
                        old_mid = old_member_ids.shift();
                    }else if(new_mid === undefined && old_mid !== undefined){//oのみ存在⇒o削除
                        delete_list.push({project_id: project_id, member_id: old_mid});
                        old_mid = old_member_ids.shift();
                    }else if(new_mid !== undefined && old_mid === undefined){//nのみ存在⇒n追加
                        append_list.push({project_id: project_id, member_id: new_mid});
                        new_mid = new_member_ids.shift();
                    }else if(new_mid > old_mid){//oにあってnにない⇒o削除
                        delete_list.push({project_id: project_id, member_id: old_mid});
                        old_mid = old_member_ids.shift();
                    }else if(new_mid < old_mid){//nにあってoにない⇒n追加
                        append_list.push({project_id: project_id, member_id: new_mid});
                        new_mid = new_member_ids.shift();
                    }
                };
                const self = this;
                const callback = function(){
                    self.close_assign_member_dialog();
                };
                this.edit_assigns(append_list, delete_list, callback);
            },
            edit_assigns: function(append_list, delete_list, callback){
                const self = this;
                const deletes = delete_list.map(function(item){
                    return self.assigns.find(function(assign){
                        return assign.project_id == item.project_id && assign.member_id == item.member_id;
                    });
                });
                API.edit_assign(deletes, append_list)
                .then(function(response){
                    appendeds = response.data;
                    deletes.forEach(function(assign){
                        const index = self.assigns.indexOf(assign);
                        if(assign && index >= 0){
                            self.assigns.splice(index, 1);
                        }
                    });
                    self.assigns.splice(0, 0, ...appendeds);
                    callback();
                });
            },
            close_assign_member_dialog: function(){
                this.dialog.assign_member.visible = false;
            },

            /**
             * ダイアログの処理
             */
            append_item: function(){
                switch(this.mode){
                case MODE_PROJECT:
                    this.append_project(null);
                    break;
                case MODE_MEMBER:
                    this.append_member(null);
                    break;
                }
            },
            //メンバー編集ダイアログ
            append_member: function(){ this.open_member_dialog(null); },
            edit_member: function(member){ this.open_member_dialog(member); },
            open_member_dialog: function(member){
                this.dialog.member.member = member;
                this.dialog.member.visible = true;
            },
            close_member_dialog: function(){
                this.dialog.member.member = null;
                this.dialog.member.visible = false;
            },
            on_append_member: function(member){
                const self = this;
                API.append_member(member.name)
                .then(function(response){
                    self.members_all.push(response.data);
                    self.close_member_dialog();
                });
            },
            on_edit_member: function(member){
                const self = this;
                API.update_member(member.id, member.name)
                .then(function(response){
                    const new_member = response.data;
                    const old_member = self.find_member_by_memberid(member.id);
                    if(old_member){
                        old_member.name = new_member.name;
                        self.close_member_dialog();
                    }
                });
            },
            on_remove_member: function(member){
                const self = this;
                const confirm = Util.hard_confirm("Member削除", `DEL_MEMBER_${member.id}`);
                if(confirm){
                    API.delete_member(member.id)
                    .then(function(response){
                        const index = self.members_all.indexOf(member);
                        if(index >= 0){
                            self.members_all.splice(index, 1);
                            self.close_member_dialog();
                        }
                    });
                }
            },

            //プロジェクト編集ダイアログ
            append_project: function(){ this.open_project_dialog(null); },
            edit_project: function(project){ this.open_project_dialog(project); },
            open_project_dialog: function(project){
                this.dialog.project.project = project;
                this.dialog.project.visible = true;
            },
            close_project_dialog: function(){
                this.dialog.project.project = null;
                this.dialog.project.visible = false;
            },
            on_append_project: function(project){
                const self = this;
                API.append_project(project.name, project.note, project.volume, project.start, project.last)
                .then(function(record){
                    self.projects.push(record.data);
                    self.close_project_dialog();
                });
            },
            on_edit_project: function(project){
                const self = this;
                API.update_project(project.id, project.name, project.note, project.volume, project.start, project.last)
                .then(function(response){
                    const new_project = response.data;
                    const old_project = self.hash_projects[project.id];
                    if(old_project){
                        old_project.name = new_project.name;
                        old_project.note = new_project.note;
                        old_project.volume = new_project.volume;
                        old_project.start = new_project.start;
                        old_project.last = new_project.last;
                        self.close_project_dialog();
                    }
                });
            },
            on_remove_project: function(project){
                const self = this;
                const confirm = Util.hard_confirm("Project削除", `DEL_PROJECT_${project.id}`);
                if(confirm){
                    API.delete_project(project.id)
                    .then(function(response){
                        const index = self.projects.indexOf(project);
                        if(index >= 0){
                            self.projects.splice(index, 1);
                            self.close_project_dialog();
                        }
                    });
                }
            },
            /**
             * グルーピング
             */
            on_change_group: function($event){
                save_func();
            },
            is_next_project_group: function(prev_project, project){
                if(this.grouping){
                    const prev_group = this.get_project_group(prev_project);
                    const group = this.get_project_group(project);
                    return prev_group != group;
                }else{
                    return false;
                }
            },
            get_project_group: function(project){
                if(!project){
                    return "";
                }else{
                    const tree = project.name.split(PROJECT_GROUP_SPLITER);
                    return (tree.length <= 0) ? "" : tree[0];
                }
            },
            get_project_name: function(project){
                if(!project){
                    return "";
                }else{
                    const parts = project.name.split(PROJECT_GROUP_SPLITER);
                    if(this.grouping && parts.length >= 2){
                        parts.shift();
                    }
                    return parts.join(PROJECT_GROUP_SPLITER);
                }
            },
            /**
             * その他
             */
        },
    });

})(this);