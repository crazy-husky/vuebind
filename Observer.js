function redefine(data,key,value){
    observer(value);
    let dep=new Dep();
    Object.defineProperty(data,key,{
        get(){
            dep.depend();
            return value;
        },
        set(newValue){
            value=newValue;
            dep.notify();
        }
    })
}

function observer(data) {
    if(!data||typeof data!=='object'){
        return;
    }
    Object.keys(data).forEach(key=>{
        redefine(data,key,data[key]);
    })
}

function Dep() {
    this.subs=[];
}
Dep.prototype={
    add(sub){
        this.subs.push(sub);
    },
    notify(){
        this.subs.forEach(sub=>{
            sub.update();
        })
    },
    depend(){
        if(Dep.target){
            this.add(Dep.target);
        }
    }
};
Dep.target=null;