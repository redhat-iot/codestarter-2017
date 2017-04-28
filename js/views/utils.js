var UTILS = function(u) {

    u.fetchJSONFile = function(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                } else {
                    alert("cannot load " + path);
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    };

    u.guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    u.kapuaAuth = function(baseUrl, username, password, onSuccess, onFail) {
        var httpRequest = new XMLHttpRequest();
        var path = baseUrl + '/v1/authentication/user';
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (onSuccess) onSuccess(data);
                } else {
                    if (onFail) {
                        onFail("Error calling Authentication API " + path + ": " + httpRequest.status + " " + httpRequest.statusText);
                    }
                }
            }
        };

        httpRequest.open('POST', path);
        httpRequest.setRequestHeader("Content-type", "application/json");

        var data = {
            password: [
                password
            ],
            username: username
        };

        httpRequest.send(JSON.stringify(data));
    };

    u.kapuaApi = function(baseUrl, apiPath, method, queryParams, body, auth, onSuccess, onFail) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (onSuccess) onSuccess(data);
                } else {
                    if (onFail) {
                        onFail("Error calling API " + method + " " + apiPath + ": " + httpRequest.status + " " + httpRequest.statusText);
                    }
                }
            }
        };
        var path = baseUrl + apiPath;
        if (queryParams) {
            path += '?';
            Object.keys(queryParams).forEach(function(key, idx, arr) {
                path += (key + '=' + encodeURIComponent(queryParams[key]));
                if (idx < (arr.length - 1)) {
                    path += '&';
                }
            });
        }
        httpRequest.open(method, path);
        if (auth) {
            httpRequest.setRequestHeader('Authorization', 'Bearer ' + auth.tokenId);
        }
        if (body) {
            httpRequest.setRequestHeader("Content-type", "application/json");
            httpRequest.send(JSON.stringify(body));
        } else {
            httpRequest.send();
        }

    };

    return u;
}(UTILS || {});

