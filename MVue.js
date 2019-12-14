function MVue(options) {
    this.$options=options||{};
    this.$data=options.data;
    this.$el=document.querySelector(options.el);
    //代理data上的数据
    Object.keys(this.$data).forEach(key=>{
        this.proxyData(key);
    });
    this.init();
}
MVue.prototype.init=function () {
    observer(this.$data);
    new Compile(this);
};
MVue.prototype.proxyData=function (key) {
    Object.defineProperty(this,key,{
        get(){
            return this.$data[key]
        },
        set(value){
            this.$data[key]=value;
        }
    })
}