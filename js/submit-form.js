!(function () {
    function convertForm(t) {
        const e = {
            method: (t.method || 'get').toLowerCase(),
            action: t.action,
            confirm: t.dataset.confirm || null,
            redirect: t.dataset.redirect || null,
            reload: t.dataset.reload,
            fields: {}
        };
        for (let o = 0; o < t.length; o++) {
            const n = t[o],
                i = n.name;
            i && ('_http_method' !== i ? 'checkbox' !== n.type ? 'radio' !== n.type ? e.fields[i] = n.value : n.checked && (e.fields[i] = n.value) : n.checked && (e.fields.hasOwnProperty(i) ? e.fields[i] = [e.fields[i], n.value] : e.fields[i] = n.value) : e.method = n.value.toLowerCase())
        }
        return e
    }

    function stringifyQuery(t, e) {
        const o = [];
        for (let n in t) {
            if (!t.hasOwnProperty(n)) continue;
            const i = t[n];
            i instanceof Array ? (!0 === e && (n += '[]'), o.push(n + '=' + i.map(t => encodeURIComponent(t)).join('&' + n + '='))) : o.push(n + '=' + encodeURIComponent(i))
        }
        return o.join('&')
    }
    async function submitForm(t) {
        const e = (t = convertForm(t)).fields;
        if ('get' === t.method) return await Http.get(t.action + '?' + stringifyQuery(e));
        if ('put' === t.method || 'post' === t.method) {
            if (t.confirm && !window.confirm(t.confirm)) throw new Error('action canceled');
            const o = await Http[t.method](t.action, e);
            return t.redirect && (window.location = t.redirect), t.reload !== undefined && window.location.reload(), o
        }
    };
    window.SubmitForm = submitForm;
})();
