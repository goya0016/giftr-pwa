
const gift={
    init:()=>{
        let modal = document.querySelectorAll('.modal');
        let modoptions = {
            dismissible: true,
            startingTop: '10vh',
            inDuration: 350,
            outDuration: 200
        }
        let modals = M.Modal.init(modal, modoptions);
        gift.verify();
        
    },
    verify:()=>{
        let token = sessionStorage.getItem("token")
        if(!token){
            window.location.href="./index.html";
        }else{
            gift.addEventListeners();
        }
    },
    addEventListeners:()=>{
        document.getElementById('backbtn').addEventListener('click',gift.back)
    },
    back:()=>{
        window.location.href = "./index.html";
    }
}
document.addEventListener('DOMContentLoaded',gift.init())