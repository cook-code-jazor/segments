
    !(function(){
        const containers = {};
        const nodes = {};
        const container_names = [];

        const resposne = {
            bind, change
        }

        function tabs(...containers_){
            containers_.forEach( t=>{
                const el = document.getElementById(t)
                const label = el.dataset ? el.dataset.label : el.getAttribute('data-text')
                container_names.push(label)
                containers[label] = el;
            })

            return resposne
        }
        function change(id){
            container_names.forEach(t => {
                containers[t].style.display = t === id ? 'block' : 'none'
                nodes[t].className = t === id ? 'tab-selected' : ''
            });
            return resposne
        }
        function bind(container, id){
            const container_ = document.createElement('ul')
            container_.className = 'overfrp-tabs clearfix'
            container_names.forEach(t => {
                const el = containers[t]
                const clickNode = document.createElement('li')
                clickNode.innerHTML = t
                clickNode.onclick = function(){
                    change(t);
                }
                container_.appendChild(clickNode)
                nodes[t] = clickNode;
            })
            if(typeof container === 'string') container = document.getElementById(container)
            container.appendChild(container_)
            change(id || container_names[0])
            return resposne
        }

        window.Tabs = tabs;
    })();
