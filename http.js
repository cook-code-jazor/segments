;(function(){
    const encode = encodeURIComponent;
    async function getResponse(response){
        if(response.status >= 400) {
            const message = response.status + ': ' + await response.text();
            window.Tips ? window.Tips(message, 'error') : alert(message);
            throw {response, message}
        }
        if(response.status === 204){
            window.Tips ? window.Tips('操作执行完成') : alert('操作执行完成');
            throw {response, message: '操作执行完成'}
        } 

        const contentType = response.headers.get('content-type')
        if(contentType && contentType.indexOf('/json') > 0) return await response.json();
        if(contentType && contentType.indexOf('text/') === 0) return await response.text();
    }
    async function get_ (url, method) {
        const res = await fetch(url, {
            method: (method || 'GET').toUpperCase(),
            credentials: 'include',
        });
        return await getResponse(res);
    }
    async function post_ (url, data, method, json) {
        data = data || {}
        const res = await fetch(url, {  
            method: (method || 'POST').toUpperCase(),
            credentials: 'include',
            headers: {
              'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded'
            },
            body: json ? JSON.stringify(data) : Object.keys(data).map((key) => encode(key) + '=' + encode(data[key])).join('&')
          });
        return await getResponse(res);
    }
    window.Http = {
        get:  (url) =>  get_(url),
        post:  (url, data, json) =>  post_(url, data, 'post', json),
        put:  (url, data, json) =>  post_(url, data, 'put', json),
        delete:  (url) =>  get_(url, 'delete'),
    } 
})();
