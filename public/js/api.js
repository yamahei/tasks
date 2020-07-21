"use: strinct;";

(function(g){

    const state = {
        hook: {
            start: null,
            end: null,
        },
    };

    axios.defaults.baseURL = "http://localhost:4567";
    axios.interceptors.request.use(function (request) {
        state.hook.start && state.hook.start();
        return request;
    }, function (error) {
        state.hook.end && state.hook.end();
        return Promise.reject(error);
    });
    axios.interceptors.response.use(function (response) {
        if(response.request.status == 200){
            state.hook.end && state.hook.end();
            return response;
        }else{
            state.hook.end && state.hook.end();
            return Promise.reject(response);//あってんのかな？
        }
    }, function (error) {
        state.hook.end && state.hook.end();
        return Promise.reject(error);
    });

    const MEMBER_BASE_URI = "/api/members";
    const PROJECT_BASE_URI = "/api/projects";
    const ASSIGN_BASE_URI =  "/api/assigns";

    const api = function(){};

    //General
    api.prototype.set_hooks = function(start, end){
        state.hook.start = start;
        state.hook.end = end;
    };


    //Member
    api.prototype.append_member = function(name){
        const url = MEMBER_BASE_URI;
        const params = { name: name };
        return axios.put(url, params);
    };
    api.prototype.update_member = function(id, name){
        const url = MEMBER_BASE_URI;
        const params = { id: id, name: name };
        return axios.post(url, params);
    };
    api.prototype.delete_member = function(id){
        const url = MEMBER_BASE_URI;
        const params = new URLSearchParams();//deleteのときはbodyで渡せない
        params.append("id", id);
        return axios.delete(url, {data: params});
    };

    api.prototype.load_all_members = function(){
        const url = `${MEMBER_BASE_URI}/all`;
        const params = {};
        return axios.get(url, params);
    };

    //Project
    api.prototype.append_project = function(name, note, volume, start, last){
        const url = PROJECT_BASE_URI;
        const params = { name: name, note: note, volume: volume, start: start, last: last };
        return axios.put(url, params);
    };
    api.prototype.update_project = function(id, name, note, volume, start, last){
        const url = PROJECT_BASE_URI;
        const params = { id: id, name: name, note: note, volume: volume, start: start, last: last };
        return axios.post(url, params);
    };
    api.prototype.delete_project = function(id){
        const url = PROJECT_BASE_URI;
        const params = new URLSearchParams();//deleteのときはbodyで渡せない
        params.append("id", id);
        return axios.delete(url, {data: params});
    };

    // api.prototype.load_all_projects = function(){
    //     const url = `${PROJECT_BASE_URI}/all`;
    //     const params = {};
    //     return axios.get(url, params);
    // };
    api.prototype.load_project_relation = function(start, last){
        const url = `${PROJECT_BASE_URI}/relation`;
        const params = { start: start, last: last };
        return axios.get(url, {params: params});//getのときはparamsで囲む
    };

    //Assign
    api.prototype.append_assign = function(project_id, member_id){
        const url = ASSIGN_BASE_URI;
        const params = { project_id: project_id, member_id: member_id };
        return axios.put(url, params);
    };
    api.prototype.delete_assign = function(id){
        const url = ASSIGN_BASE_URI;
        const params = new URLSearchParams();//deleteのときはbodyで渡せない
        params.append("id", id);
        return axios.delete(url, {data: params});
    };
    api.prototype.edit_assign = function(delete_list, create_list){
        const url = `${ASSIGN_BASE_URI}/edit`;
        const params = {
            delete_list: delete_list,
            create_list: create_list,
        }
        return axios.post(url, params);
    };
    


    g.API = new api();

})(this);