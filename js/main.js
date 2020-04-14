    const app={
        peoplelist:[],
        token:null,
        modals:null,
        init:()=>{
            let modal = document.querySelectorAll('.modal');
            let modoptions = {
                dismissible: true,
                startingTop: '10vh',
                inDuration: 350,
                outDuration: 200
            }
            let modals = M.Modal.init(modal, modoptions);
            console.log(modals);

            app.modals=modals;

            let datepicker = document.querySelectorAll('.datepicker');
            let datepickers = M.Datepicker.init(datepicker,modoptions);

            app.addEventListeners();
        },
        addEventListeners:()=>{
            document.getElementById('signInbtn').addEventListener('click',app.signin);
            document.getElementById('cancel').addEventListener('click',app.cancel);
            document.getElementById('addPerson').addEventListener('click',app.addPerson);
            document.getElementById('signup').addEventListener('click',app.signup);
            document.getElementById('logout').addEventListener('click',app.logout);
        },
        signin:(ev)=>{
            ev.preventDefault();
            console.log('signin')
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

            console.log(JSON.stringify(body))

            let req = new Request(uri, {
                headers: header,
                body: JSON.stringify(body),
                mode: 'cors',
                method: 'POST'
            });

            if(email!=""&&password!=""){
                console.log('empty')

                fetch(req)
                    .then(response => response.json())
                    .then(data=>{
                        console.log(data.data.token)
                        app.token=data.data.token;
                        console.log(app.token);
    
    
                        sessionStorage.setItem("token",JSON.stringify(app.token));
                        document.querySelector('.preloader-wrapper').classList.remove('active');

                        document.getElementById("signin").reset();

                        app.modals[1].close();

                        document.querySelector('.scale-out').classList.add('scale-in');

                        let li = document.getElementById("beforelogin")
                        li.parentNode.removeChild(li)

                        document.getElementById('logout').classList.add('scale-in');
                        document.getElementById('login').classList.add('scale-out',"scale-transition");
                        document.getElementById('register').classList.add('scale-out',"scale-transition");
                        app.showpeople();
                    })
                    .catch(err=>{
                        console.error(err);
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
            console.log('cancel')
        },
        addPerson: (ev) => {
             ev.preventDefault();
            console.log('person')


            let name = document.getElementById('personName').value;
            let dob = document.getElementById('date').value;


            let timestamp = Date.parse(dob);
            let now = Date.now()


            let uri = "https://giftr.mad9124.rocks/api/people";

            let person = { id: now, name: name, birthDate: timestamp };

            let header = new Headers();
            header.append("Content-Type", "application/json")
            header.append("Authorization","Bearer "+app.token);

            // console.log(JSON.stringify(body))

            let req = new Request(uri, {
                headers: header,
                body: JSON.stringify(person),
                mode: 'cors',
                method: 'POST'
            });

            fetch(req)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    document.getElementById("addp").reset();
                    app.modals[0].close();
                    app.showpeople();
                })
                .catch(console.error)

            },
        signup: (ev) => {
             ev.preventDefault();
            console.log('signup')

            document.querySelector('.second').classList.add('active');

            let firstName = document.getElementById('first_name').value;
            let lastName = document.getElementById('last_name').value;
            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;


            console.log(firstName,lastName,email,password)

            let uri ="https://giftr.mad9124.rocks/auth/users";
            let body={
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }
            let header = new Headers();
            header.append("Content-Type","application/json")

            console.log(JSON.stringify(body))

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
                    data=>{console.log(data)

                        if(data.errors){
                            console.log(data.errors)
                            alert(data.errors[0].detail) 

                        }else{
                            document.querySelector('.second').classList.remove('active');
                            document.getElementById("signup").reset();
                            app.modals[2].close();

                        }


                    })
                .catch(err=>{
                    console.error(err)
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
                header.append("Authorization", "Bearer "+app.token)

                // console.log(JSON.stringify(body))

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
                            app.peoplelist=data.data

                            console.log(data.data)

                            app.peoplelist.sort(function (a, b) { return new Date(a.birthDate.slice(5, 10)) - new Date(b.birthDate.slice(5, 10))})


                            
                            console.log(data.data)
                            let item = document.querySelector('.collection-item')
                            if(item){
                                let list = document.querySelectorAll('.collection-item');
    
                                list.forEach(ele=>{
                                        ele.parentNode.removeChild(ele);
                                })
                            }

                            let ul = document.querySelector('#peoplelist');
                                console.log(app.peoplelist)



                            app.peoplelist.forEach(element => {

                                let li = document.createElement('li')
                                let div = document.createElement('div')
                                let name = document.createElement('span');
                                let dob = document.createElement('a');
                                let del = document.createElement('a');
                                let i = document.createElement('i');
                                
                                li.setAttribute('id',element._id)
                                li.setAttribute('class','collection-item');
                                li.addEventListener('click',app.retrieveID)
                                div.setAttribute('id','lidiv')

                                name.setAttribute('id','pName')
                                dob.setAttribute('id','dob')

                                i.setAttribute('class',"material-icons")
                                del.setAttribute('class','secondary-content')
                                del.addEventListener('click',app.deletePerson)
                                // let part = element.birthDate.split('T') part[0]=2020-04-03
                                let date = new Date(element.birthDate)
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

                        })
                    .catch(console.error)
            },

            deletePerson:(ev)=>{
                ev.stopImmediatePropagation();
                ev.preventDefault();
            },
            retrieveID:(ev)=>{
                let target = ev.target;
                // let clicked = target.close
            },
            logout:(ev)=>{
            ev.preventDefault();
            sessionStorage.removeItem("token");
            
            location.reload();
            }
    }
    
    
    document.addEventListener("DOMContentLoaded",app.init);
    