import { GiTomato } from 'react-icons/gi';

export const groupBy=(lst, property,order)=>{
    // console.log(lst)
    if(order==='asc'){
        lst.sort(function(a,b){
            return a[property]-b[property];
        })
    }else{
        lst.sort(function(a,b){
            return -a[property]+b[property];
        })
    }
}

export const toTomato=(leftTime)=>{
    let lst=[];
    for (let i=0;i<leftTime;i++){
        lst.push(<GiTomato key={i}/>)
    }
    return (
        <span>
           {lst}
        </span>
    )

}