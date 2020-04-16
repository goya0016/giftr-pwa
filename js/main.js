const app={
        peoplelist:[],
        token:null,
        modals:null,
        datepickers:null,
        time:null,
        SW:null,
        init:()=>{
            if ('serviceWorker' in navigator) {
               // app.initServiceWorker().catch(console.error);
                let swRegistration =navigator.serviceWorker.register('/sw.js')
                swRegistration.then(reg => console.log(reg) ) .catch(  err => console.log(err) )
            }

            let modal = document.querySelectorAll('.modal');
            let modoptions = {
                dismissible: true,
                startingTop: '10vh',
                inDuration: 350,
                outDuration: 200
            }
            let modals = M.Modal.init(modal, modoptions);

            app.modals=modals;

            let datepicker = document.querySelectorAll('.datepicker');
            let datepickers = M.Datepicker.init(datepicker, { autoClose:true});
            app.datepickers= datepickers;
            app.verify();
            app.addEventListeners();
        },
        // initServiceWorker:async ()=>{
        //     let swRegistration = await navigator.serviceWorker.register('/sw.js', {
        //         updateViaCache: 'none',
        //         scope: '/',
        //     });
        //     app.SW =
        //         swRegistration.installing ||
        //         swRegistration.waiting ||
        //         swRegistration.active;
        // },
        verify:()=>{
           let token= JSON.parse(sessionStorage.getItem("token"))
           app.token= token;
            if(!token){

            }else{
                document.querySelector('.fixed-action-btn').classList.add('scale-in');
                document.getElementById('logout').classList.add('scale-in');
                document.getElementById('login').classList.add('scale-out', "scale-transition");
                document.getElementById('register').classList.add('scale-out', "scale-transition");
                app.showpeople();
            }
        },
        addEventListeners:()=>{
            document.getElementById('signInbtn').addEventListener('click',app.signin);
            document.getElementById('cancel').addEventListener('click',app.cancel);
            document.getElementById('addPerson').addEventListener('click',app.addPerson);
            document.getElementById('signupp').addEventListener('click',app.signup);
            document.getElementById('logout').addEventListener('click',app.logout);
            document.querySelector('.fixed-action-btn').addEventListener('click',app.timer);
        },
        signin:(ev)=>{
            ev.preventDefault();

            document.querySelector('.preloader-wrapper').classList.add('active');


            let email = document.getElementById('loginemail').value;
            let password = document.getElementById('loginpassword').value;

            let uri = "https://giftr.mad9124.rocks/auth/tokens";

            let body = {
                email: email,
                password: password
            }

            let header = new Headers();
            header.append("Content-Type", "application/json")



            let req = new Request(uri, {
                headers: header,
                body: JSON.stringify(body),
                mode: 'cors',
                method: 'POST'
            });

            if(email!=""&&password!=""){


                fetch(req)
                    .then(response => response.json())
                    .then(data=>{

                        app.token=data.data.token;

    
    
                        sessionStorage.setItem("token",JSON.stringify(app.token));
                        document.querySelector('.preloader-wrapper').classList.remove('active');

                        
                        app.modals[1].close();
                        
                        document.querySelector('.fixed-action-btn').classList.add('scale-in');
                        
                        let li = document.getElementById("beforelogin")
                        li.parentNode.removeChild(li)
                        
                        document.getElementById('logout').classList.add('scale-in');
                        document.getElementById('login').classList.add('scale-out',"scale-transition");
                        document.getElementById('register').classList.add('scale-out',"scale-transition");
                        document.getElementById("signin").reset();
                        app.showpeople();
                    })
                    .catch(err=>{

                        document.querySelector('.preloader-wrapper').classList.remove('active');
                        alert('Your email or password is incorrect. Please check and try again')
    
                    })
            }else{
                document.querySelector('.preloader-wrapper').classList.remove('active');
                alert("One of the required fields is empty. Please check and try again")
            }


        },
        cancel: (ev) => { 
            ev.preventDefault();

        },
        addPerson: (ev) => {
             ev.preventDefault();


            let name = document.getElementById('personName').value;
            let dob = document.getElementById('date').value;
            clearInterval(app.time);

            
            
            let timestamp = Date.parse(dob);
            let now = Date.now()
            
            
            let uri = "https://giftr.mad9124.rocks/api/people";
            
            let person = { id: now, name: name, birthDate: timestamp };
            
            let header = new Headers();
            header.append("Content-Type", "application/json")
            header.append("Authorization","Bearer "+app.token);
            

            
            let req = new Request(uri, {
                headers: header,
                body: JSON.stringify(person),
                mode: 'cors',
                method: 'POST'
            });
            
            if(name!=""&&dob!=""){
                fetch(req)
                    .then(response => response.json())
                    .then(data => {

                        document.getElementById("addp").reset();
                        app.modals[0].close();
                        app.showpeople();
                    })
                    .catch(console.error)

            }else{
                alert("One of the required fields is empty")
            }

            },
        signup: (ev) => {
             ev.preventDefault();
            ev.stopImmediatePropagation();

            document.querySelector('.second').classList.add('active');

            let firstName = document.getElementById('first_name').value;
            let lastName = document.getElementById('last_name').value;
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;




            let uri ="https://giftr.mad9124.rocks/auth/users";
            let body={
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }
            let header = new Headers();
            header.append("Content-Type","application/json")



            let req = new Request(uri,{
                headers:header,
                body: JSON.stringify(body),
                mode: 'cors',
                method: 'POST'
            });

            if(firstName!=""&&lastName!=""&&email!=""&&password!=""){
                fetch(req)
                .then(response=>response.json())
                .then(
                    data=>{

                        if(data.errors){

                            alert(data.errors[0].detail) 

                        }else{
                            document.querySelector('.second').classList.remove('active');
                            document.getElementById("signup").reset();
                            app.modals[2].close();

                        }


                    })
                .catch(err=>{

                    document.querySelector('.second').classList.remove('active');
                    alert("Email is already registered. Please login or try another email")
                })

            }else{
                document.querySelector('.second').classList.remove('active');
                alert("One of the required fields is empty. Please check and try again")
            }
            },


        showpeople:()=>{
                let uri = "https://giftr.mad9124.rocks/api/people";

                let header = new Headers();
                header.append("Content-Type", "application/json")
                header.append("Authorization", "Bearer "+ app.token)



                let req = new Request(uri, {
                    headers: header,
                    mode: 'cors',
                    method: 'GET'
                });

                fetch(req)
                    .then(response => response.json())
                    .then(
                        data => {
                            app.peoplelist=[];
                            // app.peoplelist=;



                            data.data.sort(function (a, b) { return new Date(a.birthDate) - new Date(b.birthDate)})


                            

                            let item = document.querySelector('.collection-item')
                            if(item){
                                let list = document.querySelectorAll('.collection-item');
    
                                list.forEach(ele=>{
                                        ele.parentNode.removeChild(ele);
                                })
                            }

                            let ul = document.querySelector('#peoplelist');



                            if (data.data.length==0){
                                let li = document.createElement('li')
                                let div = document.createElement('div')
                                let a  = document.createElement('a')

                                a.textContent="You do not have any people saved please click the add button to add person."
                                li.setAttribute('class', 'collection-item');

                                ul.appendChild(li);
                                li.appendChild(div)
                                div.appendChild(a);
                            }else{

                                data.data.forEach(element => {
    
                                    let li = document.createElement('li')
                                    let div = document.createElement('div')
                                    let name = document.createElement('span');
                                    let dob = document.createElement('a');
                                    let del = document.createElement('a');
                                    let i = document.createElement('i');
                                    
                                    li.setAttribute('data-id',element._id)
                                    li.setAttribute('class','collection-item');
                                    li.addEventListener('click',app.retrieveID)
                                    div.setAttribute('id','lidiv')
    
                                    name.setAttribute('id','pName')
                                    dob.setAttribute('id','dob')
                                    dob.setAttribute('class','black-text')
                                    i.setAttribute('class',"material-icons")
                                    del.setAttribute('class','secondary-content')


                                    del.addEventListener('click',app.deletePerson)
                                    // let part = element.birthDate.split('T') part[0]=2020-04-03
                                    let date = new Date(element.birthDate)


                                    if (Date.parse(date)<Date.now()){
                                        li.classList.add('disabled')
                                    }


                                    let birthDate = date.getUTCDate();
                                    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', "Dec"]
                                    let month = months[date.getUTCMonth()]
                                    
                                    
                                    
                                    
                                    name.textContent = element.name[0].toLocaleUpperCase() + element.name.slice(1);
                                    dob.textContent = birthDate + " " + month+" ";
                                    i.textContent='delete';
                                    
                                    ul.appendChild(li);
                                    li.appendChild(div)
                                    div.appendChild(dob);
                                    dob.insertAdjacentElement('afterend',name)
                                    name.insertAdjacentElement('afterend',del);
                                    del.appendChild(i)
                                    
    
    
                                });
                                // setTimeout(()=>{

                                // },500)
                            }

                        })
                    .catch(console.error)
            },

            deletePerson:(ev)=>{
                ev.stopImmediatePropagation();
                ev.preventDefault();


                let target = ev.target;
                let clicked = target.closest("[data-id]")

                let attribute = clicked.getAttribute('data-id')



                let uri = "https://giftr.mad9124.rocks/api/people/"+attribute;

                let header = new Headers();
                header.append("Content-Type", "application/json")
                header.append("Authorization", "Bearer " + app.token)



                let req = new Request(uri, {
                    headers: header,
                    mode: 'cors',
                    method: 'DELETE'
                });

                fetch(req)
                    .then(response => response.json())
                    .then(
                        data => {

                            app.showpeople();
                        })

            },
            retrieveID:(ev)=>{
                let target = ev.target;
                let clicked = target.closest("[data-id]");
                let attribute = clicked.getAttribute('data-id');
                sessionStorage.setItem('personID',JSON.stringify(attribute));
                window.location.href="./gifts.html"
            },
            logout:(ev)=>{
            ev.preventDefault();
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("personID");
            
            location.reload();
            },
            timer:()=>{

                app.time =  setInterval(()=>{
                    let picker = app.datepickers[0].isOpen

                    if(picker==true){
                        document.querySelector('#modal1').classList.add('hiet')
                    }else{
                        document.querySelector('#modal1').classList.remove('hiet')
                    }
                }, 500)
              
                
            }
    }
    
    
    document.addEventListener("DOMContentLoaded",app.init);
    