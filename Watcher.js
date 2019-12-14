function Watcher(vm,exp,cb) {
    this.vm=vm;
    this.exp=exp;
    this.cb=cb;
    this.value=this.get();
}
Watcher.prototype={
    update(){
        let value = this.vm.$data[this.exp];
        let oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb(value)
        }
    },
    get(){
        Dep.target=this;
        let value=this.vm.$data[this.exp];
        Dep.target=null;
        return value;

    }
};