$(document).ready(function() { //Before proceeding with these functions, waits for the HTML document page to load.
    
    console.log("Login Document loaded") //Displays to console that page loaded

    $('#register').click(function (){ //Once the sign in button is clicked, proceeds with everything below
        
        /*
        * Below retrieves the user inputted values from HTML user input boxes
        */
            var regusername = document.getElementById("registerusername").value; //Form value for username
            var regpassword = document.getElementById("registerpassword").value; //Form value for password
          
        /*
        * Below displays user inputted values into console log and was used for testing purposes 
        *   and ensuring data was coming through
        */
            registerUser(regusername, regpassword);
                   
        });


    $('#login').click(function (){ //Once the sign in button is clicked, proceeds with everything below
        
        /*
        * Below retrieves the user inputted values from HTML user input boxes
        */
            var loginusername = document.getElementById("loginusername").value; //Form value for username
            var loginpassword = document.getElementById("loginpassword").value; //Form value for password
          
        /*
        * Below displays user inputted values into console log and was used for testing purposes 
        *   and ensuring data was coming through
        */
            loginUser(loginusername, loginpassword);
                   
        });    

        
    
    }); //End of main function

/* 
 * 
 * Beginning of supporting functions
 *
 */

    function registerUser(username, password){ //Function that begins API call to restuserAPI program.    
        var url = "http://localhost:8888/userapi/saveuser/"+
                    username +'/' + password;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }};

        var data = {
        "username": username,
        "password": password,
        };

        xhr.send(data);
        console.log("POST Mapping request was successful!");
        alert("Registration Successful. Please login.");
    }
    

    function loginUser(username, password){ 
        //Function that begins API call to restuserAPI program.           
        
        //Below sends confirmation text through console log for testing purposes
        console.log("Entered LoginUser function. Checking user..."); 
        console.log("Login username: " + username);
        console.log("Login password: " + password);
        
        
        verifyingCredentials(username, password);
    }

    function verifyingCredentials(username, password){ 
        //Function that begins API call to restuserAPI program.           
        
        $.ajax({ //Begins Search API call
            url: 'http://localhost:8888/userapi/allusers',
            headers: {
                Accept: 'application/json',
            },

        }).then(function(APIresponse){ 

            /*
            * Below allow us to read and monitor the console log with the data. This helps confirm API link is working
            */
                console.log(APIresponse); //Displays the object

                var username_counter = 0;
                var password_counter = 0;

                for (i=0;i<APIresponse.users.length;i++){
                    if (APIresponse.users[i].username==username){
                        username_counter++;
                    }
                }

                for (i=0;i<APIresponse.users.length;i++){
                    if (APIresponse.users[i].password==password){
                        password_counter++;
                    }
                }

                if (username_counter>0 && password_counter>0){
                    alert("Login credentials verified. Access granted.");
                    window.open("/home","_self")
                }else{
                    alert("Invalid credentials. Access denied.");
                }
                
            
        }); 
    }

