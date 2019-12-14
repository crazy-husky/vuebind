function Compile(vm) {
    this.vm=vm;
    this.el=vm.$el;
    this.fragment=null;
    this.init();
}
Compile.prototype={
    constructor:Compile,
    init(){
        this.initFragment(this.el);
        this.compileNode(this.fragment);
        this.el.appendChild(this.fragment);
    },
   initFragment(node){
        let fragment=document.createDocumentFragment();
        let children=[...node.children];
        children.forEach(child=>{
            fragment.append(child);
        });
        this.fragment=fragment;
    },
    compileNode(fragment){
        let childNodes=[...fragment.children];
        childNodes.forEach(node=>{
            if(this.isNodeElement(node)){
                this.compileDirective(node); //处理v-开头的指令 v-model v-html v-text v-for等
            }
            let reg = /\{\{(.*)\}\}/; //处理{{}} 文本表达式
            let text=node.textContent;
            if(reg.test(text)){
                let prop=reg.exec(text)[1];
                this.compile_text(node,prop);
            }
        })
    },
    compileDirective(node){ //处理命令
        let attrs=[...node.attributes];
        attrs.forEach(attr=>{
            let name=attr.name;
            let prop=attr.value;
            if(name==='v-model'){
                this.compile_v_model(node,prop);
            }
            if(name==='v-html'){
                this.compile_v_html(node,prop);
            }
        })
    },
    compile_v_model(node,prop){
        let val=this.vm.$data[prop];
        this.updateModel(node,val);
        new Watcher(this.vm,prop,(value)=> {
            this.updateModel(node,value);
        });

        node.addEventListener('input',e =>{
            let newValue=e.target.value;
            if(val!==newValue){
                this.vm.$data[prop]=newValue;
            }
        })
    },
    compile_v_html(node,prop){
        let text=this.vm.$data[prop];
        this.updateText(node,text);
        new Watcher(this.vm,prop,(value)=> {
            this.updateHtml(node,value);
        });
    },
   compile_text(node,prop){
        let text=this.vm.$data[prop];
        this.updateText(node,text);
        new Watcher(this.vm,prop,(value)=> {
            this.updateText(node,value);
        });
    },
    updateText(node,value){
        node.innerText=typeof value ==='undefined'?'':value;
    },
    updateModel(node,value){
        node.value=typeof value==='undefined'?'':value;
    },
    updateHtml(node,value){
        node.innerHTML=typeof value ==='undefined'?'':value;
    },
    isNodeElement(node){
        return node.nodeType === 1;
    },
};