import axios from 'axios'

var sendLogTime = 0

function handleError(res) {
    var data = res.data;
    if(data.code) {
        data.msg += `（${data.code}）`;
    }
    return data;
}

function get(url, options={}, timeoutTime) {
  return request('get', url, '', options, timeoutTime);
}

function put(url, form, options={}, timeoutTime) {
  return request('put', url, form, options, timeoutTime);
}

function post(url, form, options={}, timeoutTime) {
  return request('post', url, form, options, timeoutTime);
}

function request(method, url, form, options = {}, timeoutTime = 60000) {
    var timeout = null
    var req = method == 'get' ?
        axios.get(url, {...options,
            timeout: timeoutTime
        }) :
        axios[method](url, form, {...options,
            timeout: timeoutTime
        });
    return Promise.race([
        req,
        new Promise((resolve, reject) => {
            timeout = setTimeout(function() {
                reject('timeout');
            }, options.timeout || timeoutTime)
        })
    ]).then((res) => {
        clearTimeout(timeout);
        return res;
    }, (res) => {
        if (res == 'timeout') {
            return Promise.reject('Timeout');
        }
        return Promise.reject('Timeout');
    });
}

export default {
    getParserResult: function(text, newScene, cache) {
        var url = "http://cloud-vm-45-103.doc.ic.ac.uk:8000/";
        var form_data = new FormData();
        form_data.append("text", text);
        form_data.append("new_scene", newScene);
        form_data.append("cache", JSON.stringify(cache));
        return post(url, form_data).then(res => {
            console.log('res', res);
            if (res.status == 200) {
                return res.data
            } else {
                return Promise.reject(res);
            }
        }).catch(e => {
            return Promise.reject(e);
        })
    }
}
