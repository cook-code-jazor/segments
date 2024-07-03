!(function(){
    const layers = []
    const global_options = {}

    async function closeLast(checkConfirm){
        const el = layers[layers.length - 1]

        const options = global_options[el.id]
        if(checkConfirm !== true && options.close){
            if(await options.close() === false) return;
        }
        if(checkConfirm === true){
            if(options.confirm){
                await options.confirm(el.querySelector('form'), options)
            }
            else if(options.autoSubmit){
                var form = el.querySelector('form');
                if(!form) throw new Error('can not found any form')
                await SubmitForm(form)
            }
        }
        layers.pop()
        global_options[el.id] = null;
        delete global_options[el.id]
        document.body.removeChild(el)
    }
    window.interactive = {
        createMask(){
            const el = document.createElement('div')
            el.style.cssText="position:fixed; left:0;right:0;top:0;bottom:0;background-color:#00000080;margin:0";
            el.id = 'mask-layer-' + Math.random().toString().substr(2)
            return el;
        }
    }
    window.document.body.addEventListener('keyup', async e => {
        if(e.witch !== 27 && e.keyCode !== 27) return;
        if(layers.length === 0) return;
        
        await closeLast()
    })

    window.interactive.layer = async function(url, options, append){

        options = options || {}

        if(options['width'] === undefined) options.width = 600
        if(options['height'] === undefined) options.height = 400

        const el = window.interactive.createMask()

        var container = document.createElement('div')
        container.style.cssText =`position:relative; margin: 15vh auto 0;width:${options.width}px; height:${options.height === 'auto' ? 'auto' : `${options.height}px`};padding:0; background-color: #fff;`

        if(options.title) {
            var header = document.createElement('div')
            header.innerHTML = options.title
            header.style.cssText = 'width: 100%; height: 60px; line-height:60px; padding-left:15px; font-size:24px;position:relative;'


            var close = document.createElement('span')
            close.innerHTML = '<i class="iconfont" style="cursor:pointer">&#xe61b;</i>'
            close.style.cssText = 'top:18px; right:18px;position:absolute; line-height:100%; color:#999; font-size:18px;'
            close.addEventListener('click',async e => await closeLast())
            header.appendChild(close)
            container.appendChild(header)
        }

        var body = document.createElement('div')
        body.style.cssText = `overflow-y:auto; padding:${options.title ? '0' : '15px'} 15px 15px; width: 100%; height:${options.height === 'auto' ? 'auto' : `${options.height - (options.title ? 60 : 0)}px`}`

        container.appendChild(body)

        append && append(container, body, options)

        el.appendChild(container)

        document.body.appendChild(el)

        try{
            body.innerHTML = typeof url === 'function' ? url() : await Http.get(url)
            layers.push(el)
            global_options[el.id] = options;
        }catch (ex){
            document.body.removeChild(el)
            throw ex;
        }
    }


    function append(container, body, options){
        var footer = document.createElement('div')
        footer.style.cssText = 'width: 100%; height: 60px; line-height:60px; padding:0 15px; font-size:24px;position:relative; text-align:right'

        footer.innerHTML = `<button class="button info mr-10 large" data-role="cancel">${options.cancelButtonText || '取消'}</button><button class="button primary large" data-role="confirm">${options.confirmButtonText || '确定'}</button>`

        if(options.height !== 'auto') body.style.height = `${options.height - (options.title ? 60 : 0) - 60}px`

        container.appendChild(footer)

        footer.addEventListener('click', async e => {
            const el = e.target || e.srcElement;
            await closeLast(el.dataset.role === 'confirm' ? true : false)
        })
    }
    window.interactive.dialog = async function(url, options){
        await window.interactive.layer(url, options, append);
    }
    window.interactive.confirm = function(message, title, options){
        options = options || {}
        options.title = title
        if(!options.width ) options.width = 400

        return new Promise(async (resolve, reject) => {
            options.close =  async () => reject('action canceled');
            options.confirm = async () => resolve();
            await window.interactive.layer(() => message, options, (container, body, options) => {
                append(container, body, options)
                body.style.height = 'auto'
                body.style.fontSize = '14px'
                container.style.height = 'auto'
                container.style.marginTop = '20vh'
            });
        });
    }
})();
