/**
 * Static object with help functions commonly used
 */
function RoutesAPI() {

    var self = this;

    this.listDevs = {};

    this.getCompsUser = function(callback){

        var url = "";

        var list = {};

        var param;

        //window.session.useTestData();

        if(window.session.getIsLogin()){

            var usr = window.helper.clone(window.session.getUserLogin());

            url = window.helper.SERVER + "/v1/repo/usrs/"+usr._id+"/";

            param = {
                env : window.helper.ENV,
                axs_key : usr.axs_key
            };

            var port = window.helper.buildURL('', param);

            callAjax('comps', port, function(route, res){

               list[route] = res;

                callAjax('layers', port,function(route, res){

                    list[route] = res;

                    callAjax('platfrms', port,function(route, res){

                        list[route] = res;

                        callAjax('suprlays', port,function(route, res){

                            list[route] = res;

                            url = window.helper.getAPIUrl("user");

                            callAjax('', '',function(route, res){

                                self.listDevs = res;

                                callback(list);

                            });
                        });
                    });
                });
            });
        }
        else{

            url = window.helper.getAPIUrl("comps");

            callAjax('', '',function(route, res){

                list = res;

                url = window.helper.getAPIUrl("user");

                callAjax('', '',function(route, res){

                    self.listDevs = res;

                    callback(list);

                });
            });
        }

        function callAjax(route, port, callback){

            $.ajax({
                url: url + route + port,
                method: "GET"
            }).success (
                function (res) {

                    if(typeof(callback) === 'function')
                        callback(route, res);

                });
        }

    };

    this.postRoutesEdit = function(type, route, params, data, doneCallback, failCallback){

        var tail = "",
            method = "",
            setup = {},
            usr = window.helper.clone(window.session.getUserLogin()),
            param,
            url;

        route = type + " " + route;

        switch(route) {

            case "tableEdit insert":
                method = "POST";
                tail = "/v1/repo/usrs/" + usr._id + "/comps";
                break;
            case "tableEdit delete":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + usr._id + "/comps/" + data.comp_id;
                break;
            case "tableEdit update":
                method = "PUT";
                tail = "/v1/repo/usrs/" + usr._id + "/comps/" + data.comp_id;
                break;
            case "tableEdit insert dev":
                method = "POST";
                tail = "/v1/repo/usrs/" + usr._id + "/comps/" + data.comp_id + "/comp-devs";
                break;
            case "tableEdit delete dev":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + usr._id + "/comps/" + data.comp_id + "/comp-devs/" + data.devs_id;
                break;
            case "tableEdit update dev":
                method = "PUT";
                tail = "/v1/repo/usrs/" + usr._id + "/comps/" + data.comp_id + "/comp-devs/" + data.devs_id;
                break;

            case "wolkFlowEdit insert":
                method = "POST";
                tail = "/v1/repo/usrs/" + usr._id + "/procs";
                break;
            case "wolkFlowEdit delete":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + usr._id + "/procs/" + data.proc_id;
                break;
            case "wolkFlowEdit update":
                method = "PUT";
                tail = "/v1/repo/usrs/" + usr._id + "/procs/" + data.proc_id;
                break;
            case "wolkFlowEdit insert step":
                method = "POST";
                tail = "/v1/repo/usrs/" + usr._id + "/procs/" + data.proc_id + "/steps";
                break;
            case "wolkFlowEdit delete step":
                method = "DELETE";
                tail = "/v1/repo/usrs/" + usr._id + "/procs/" + data.proc_id + "/steps/" + data.steps_id;
                break;
            case "wolkFlowEdit update step":
                method = "PUT";
                tail = "/v1/repo/usrs/" + usr._id + "/procs/" + data.proc_id + "/steps/" + data.steps_id;
                break;
        }

        param = {
                env : window.helper.ENV,
                axs_key : usr.axs_key
            };

        url = window.helper.SERVER.replace('http://', '') + tail;

        setup.method = method;
        setup.url = 'http://' + window.helper.buildURL(url, param);
        setup.headers = {
            "Content-Type": "application/json"
             };

        if(params)
            setup.data = params;

        makeCorsRequest(setup.url, setup.method, setup.data,
            function(res){

                switch(route) {

                    case "tableEdit insert":

                        if(res._id){

                            if(typeof(doneCallback) === 'function')
                                doneCallback(res);
                        }
                        else{

                            window.alert('There is already a component with that name in this group and layer, please use another one');

                            if(typeof(failCallback) === 'function')
                                failCallback(res);
                        }

                        break;
                    case "tableEdit update":

                        if(!exists("[component]")){

                            if(typeof(doneCallback) === 'function')
                                doneCallback(res);
                        }
                        else{

                            var name = document.getElementById('imput-Name').value;

                            if(window.fieldsEdit.actualTile.name.toLowerCase() === name.toLowerCase()){

                                if(typeof(doneCallback) === 'function')
                                    doneCallback(res);
                            }
                            else{

                                window.alert('There is already a component with that name in this group and layer, please use another one');

                                if(typeof(failCallback) === 'function')
                                    failCallback(res);
                            }
                        }

                        break;
                    case "wolkFlowEdit insert":

                        if(res._id){

                            if(typeof(doneCallback) === 'function')
                                doneCallback(res);
                        }
                        else{

                            if(typeof(failCallback) === 'function')
                                failCallback(res);
                        }

                        break;
                    case "wolkFlowEdit update":

                            doneCallback(res);
                        
                        break;

                    default:
                            if(typeof(doneCallback) === 'function')
                                    doneCallback(res);
                        break;
                }

            },
            function(res){

                if(typeof(failCallback) === 'function')
                    failCallback(res);
            }
        );

    };

    this.postValidateLock = function(route, data, doneCallback, failCallback){

        var tail = "",
            method = "",
            msj = "",
            usr = window.helper.clone(window.session.getUserLogin()),
            param,
            url;

        switch(route) {
            
            case "tableEdit":
                method = "GET";
                tail = "/v1/repo/usrs/" + usr._id + "/comps/" + data.comp_id;
                msj = "component";
                break;
            case "wolkFlowEdit":
                method = "GET";
                tail = "/v1/repo/usrs/" + usr._id + "/procs/" + data.proc_id;
                msj = "wolkFlow";
                break;                     
                
        }

        param = { 
                env : window.helper.ENV,
                axs_key : usr.axs_key
            };

        url = window.helper.SERVER.replace('http://', '') + tail;

        url = 'http://' + window.helper.buildURL(url, param);

        $.ajax({
            url:  url,
            method: 'GET',
            dataType: 'json',
            success:  function (res) {

                if(res._id)
                    doneCallback();
                else
                    failCallback();
            },
            error: function(res){

                if(res.status === 423){
                    window.alert("This " + msj + " is currently being modified by someone else, please try again in about 3 minutes");
                }
                else if(res.status === 404){
                    window.alert(msj + " not found");
                }
            }
        });
    };

    var makeCorsRequest = function(url, method, params, success, error) {

        //TODO: DELETE THIS IF
        if((method === "PUT" || method === "POST") && !url.match("/comps-devs/") && exists("[Component]")) {
            error();
        }
        else {
            var xhr = createCORSRequest(url, method);

            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

              if(!xhr) {
                window.alert('CORS not supported');
                return;
              }

            xhr.onload = function() {

                var res = null;

                if(method !== 'DELETE')
                    res = JSON.parse(xhr.responseText);

                success(res);

            };

            xhr.onerror = function() {

                error(arguments);

            };

            if(typeof params !== 'undefined'){

                var data = JSON.stringify(params);

                xhr.send(data);
            }
            else
                xhr.send();
        }

        function createCORSRequest(url, method) {

            var xhr = new XMLHttpRequest();

            if("withCredentials" in xhr)
                xhr.open(method, url, true);
            else
                xhr = null;

            return xhr;
        }
    };

    /**
     * TODO: MUST BE DELETED
     * @author Miguelcldn
     * @param {Object} data Post Data
     */
    function exists() { 

        if(window.actualView === 'table'){ 
        
            var group = $("#select-Group").val();
            var layer = $("#select-layer").val();
            var name = $("#imput-Name").val().toLowerCase();
            var type = $("#select-Type").val();
            var location = window.TABLE[group].layers[layer].objects;

            if(window.tableEdit.formerName){ 

                if(window.tableEdit.formerName.toLowerCase() === name) 
                    return false;
            }
            
            for(var i = 0; i < location.length; i++) {

                if(location[i].data.name.toLowerCase() === name && location[i].data.type === type) {
                    return true;
                }
            }
            
            return false;
        } 
        else{

            return false;
        }
    }
}