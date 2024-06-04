
    !(function(){
        window.Tips = function(message, type){
            const el = document.createElement('div')
            let timer = 0;
            el.style.cssText="position:fixed; left:0;right:0;top:0;bottom:0";

            var inner = document.createElement('div')
            inner.innerHTML = message
            inner.style.cssText
            ="position:absolute; left:50%; top:60px; margin-left:-150px;width:300px; padding:8px 15px;border-radius:5px; " 
            + "color:#" + (type === 'error' ? "f56c6c" : "67c23a") + "; background-color:#" + (type === 'error' ? "fef0f0" : "f0f9eb") + ";text-align:center"
            el.appendChild(inner)
            inner.onmouseover = () => window.clearTimeout(timer)
            inner.onmouseout = () => timer = window.setTimeout(() => document.body.removeChild(el), 1500)
            document.body.appendChild(el)

            timer = window.setTimeout(() => document.body.removeChild(el), 1500)
        }
       
    })();
