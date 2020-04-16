const gift={
    token:null,
    id:null,
    modal:null,
    init:()=>{
        let modal = document.querySelectorAll('.modal');
        let modoptions = {
            dismissible: true,
            startingTop: '10vh',
            inDuration: 350,
            outDuration: 200
        }
        let modals = M.Modal.init(modal, modoptions);
        gift.modal = modals;
        gift.verify();
        
    },
    verify:()=>{
        let token = JSON.parse(sessionStorage.getItem("token"))
        gift.token = token
        if(!token){
            location.href="./index.html";
        }else{
            gift.addEventListeners();
        }
    },
    addEventListeners:()=>{
        document.getElementById('backbtn').addEventListener('click',gift.back)
        document.getElementById('logout').addEventListener('click',gift.logout)
        document.getElementById('addGift').addEventListener('click',gift.addGift)
        gift.showGifts();
    },
    back:()=>{
        window.location.href = "./index.html";
    },
    logout: (ev) => {
        ev.preventDefault();
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("personID");

        location.href="./index.html";
    },

    addGift: (ev) => {
        ev.preventDefault();
        let id = JSON.parse(sessionStorage.getItem("personID"))
        gift.id = id;
        console.log(gift.id);
        let uri = "https://giftr.mad9124.rocks/api/people/" + gift.id + "/gifts";
        console.log(uri)
        let name = document.getElementById('itemName').value;
        let price = document.getElementById('price').value;
        let storeName = document.getElementById('storeName').value;
        let url = document.getElementById('storeUrl').value;

        // console.log(name.length())
        console.log(name.length)
        console.log(price)
        console.log(storeName.length)
        console.log(storeUrl.length)


        let body = { id: Date.now(), name: name, price: price, store: { name: storeName, storeUrl: url } }

        let header = new Headers();
        header.append("Content-Type", "application/json")
        header.append("Authorization", "Bearer " + gift.token)
        console.log(gift.token)
        // console.log(JSON.stringify(body))

        let req = new Request(uri, {
            headers: header,
            body: JSON.stringify(body),
            mode: 'cors',
            method: 'POST'
        });

        if (name.length >= 3 && price >= 100) {
            fetch(req)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    gift.modal[0].close();
                    document.querySelector('#giftForm').reset();
                    gift.showGifts();
                })

        } else if (name.length < 3) {
            alert("Length of name is less than 3 characters")
        } else if (price < 100) {
            alert("Price less than 100")
        }
    },

    showGifts:()=>{

       let id = JSON.parse(sessionStorage.getItem("personID"))
        gift.id= id;
        

        let uri = "https://giftr.mad9124.rocks/api/people/"+gift.id;

        let header = new Headers();
        header.append("Content-Type", "application/json")
        header.append("Authorization", "Bearer " + gift.token)
        console.log(gift.token)
        // console.log(JSON.stringify(body))

        let req = new Request(uri, {
            headers: header,
            mode: 'cors',
            method: 'GET'
        });

        fetch(req)
            .then(response => response.json())
            .then(data=>{
                console.log(data)

                let h = document.getElementById('headerG');
                h.textContent = data.data.name[0].toLocaleUpperCase() + data.data.name.slice(1)


                let item = document.querySelector('.collection-item')
                if (item) {
                    let list = document.querySelectorAll('.collection-item');

                    list.forEach(ele => {
                        ele.parentNode.removeChild(ele);
                    })
                }
                    let ul = document.querySelector('#giftlist');

                    if(data.data.gifts.length==0){
                        let li = document.createElement('li')
                        let div = document.createElement('div')
                        let a = document.createElement('a')

                        a.textContent = "You do not have any gifts saved please click the add button to add gifts."
                        li.setAttribute('class', 'collection-item');

                        ul.appendChild(li);
                        li.appendChild(div)
                        div.appendChild(a);
                    }else{

                        data.data.gifts.forEach(element=>{
                            let li = document.createElement('li');
                            let div = document.createElement('div');
                            // let div2 = document.createElement('div')
                            let name = document.createElement('h6');
                            let price = document.createElement('a');
                           

                            let del = document.createElement('a');
                            let i = document.createElement('i');

                            li.setAttribute('data-gift-id', element._id)
                            li.setAttribute('class', 'collection-item');
                            // li.addEventListener('click', app.retrieveID)
                            div.setAttribute('id', 'lidiv')

                            name.setAttribute('id', 'gName')
                            // strname.setAttribute('class','center-align')
                            price.setAttribute('class', 'black-text')
                            i.setAttribute('class', "material-icons")
                            del.setAttribute('class', 'secondary-content')
                            del.addEventListener('click',gift.deleteGift);
                            // del.addEventListener('click', app.deletePerson)
                            // let part = element.birthDate.split('T') part[0]=2020-04-03
                            
                            name.textContent = element.name[0].toLocaleUpperCase() + element.name.slice(1);
                            price.textContent = "$ "+element.price+"   ";
                            i.textContent = 'delete';


                                 if (element.store.name) { 
                                let strname = document.createElement('span');
                                let url = document.createElement('a');
                                strname.textContent=    element.store.name;
                                
                                if (element.store.productURL){

                                         url.textContent = element.store.productURL;

                                         
                                    li.appendChild(div)
                                    div.appendChild(name);
                                    name.insertAdjacentElement("afterend", price)
                                    price.insertAdjacentElement('afterend', strname);
                                    strname.insertAdjacentElement('afterend', url);
                                    url.insertAdjacentElement('afterend', del);
                                    del.appendChild(i);
                                    ul.appendChild(li);
                                }
                                     li.appendChild(div)
                                     div.appendChild(name);
                                     name.insertAdjacentElement("afterend", price)
                                     price.insertAdjacentElement('afterend', strname);
                                     strname.insertAdjacentElement('afterend', del);
                                     del.appendChild(i);
                                     ul.appendChild(li);
                                }else{

                                 li.appendChild(div)
                                 div.appendChild(name);
                                 name.insertAdjacentElement("afterend",price)
                                 price.insertAdjacentElement("afterend",del)
                                 del.appendChild(i);
                                 ul.appendChild(li);
                                }

                             




                        })
                    }



                




            })
    },
    deleteGift:(ev)=>{
        ev.preventDefault();
        ev.stopImmediatePropagation();
        let target = ev.target;

        let click = target.closest("[data-gift-id");

        let id = click.getAttribute('data-gift-id');



        let uri = "https://giftr.mad9124.rocks/api/people/" + gift.id+"/gifts/"+id;

        let header = new Headers();
        header.append("Content-Type", "application/json")
        header.append("Authorization", "Bearer " + gift.token)
        // console.log(gift.token)
        // console.log(JSON.stringify(body))

        let req = new Request(uri, {
            headers: header,
            mode: 'cors',
            method: 'DELETE'
        });

        fetch(req)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                gift.showGifts();
            })


    }




    
}
document.addEventListener('DOMContentLoaded',gift.init())