    const app={
        init:()=>{
            let modal = document.querySelectorAll('.modal');
            let modoptions = {
                dismissible: true,
                startingTop: '10vh',
                inDuration: 350,
                outDuration: 200
            }
            let modals = M.Modal.init(modal, modoptions);

            let datepicker = document.querySelectorAll('.datepicker');
            let datepickers = M.Datepicker.init(datepicker);

            let navbar = document.querySelectorAll('.sidenav');
            let navbars = M.Sidenav.init(navbar);

        },

    }
    
    
    document.addEventListener("DOMContentLoaded",app.init);
    