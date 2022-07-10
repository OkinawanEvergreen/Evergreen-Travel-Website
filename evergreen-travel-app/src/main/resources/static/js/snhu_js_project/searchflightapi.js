$(document).ready(function () { //Before proceeding with these functions, waits for the HTML document page to load.

    console.log("Home page loaded") //Displays to console that page loaded

    $('#searchflights').click(function () { //Once the searchflights button is clicked, proceeds with everything below

        /*
        * Below retrieves the user inputted values from HTML user input boxes
        */
        var fly_from = document.getElementById("fly_from").value; //Search form value for Outbound Airport
        var fly_to = document.getElementById("fly_to").value; //Search form value for Inbound Airport
        var date_from = document.getElementById("date_from").value; //Search form value for Outbound Date
        var date_to = document.getElementById("date_to").value; //Search form value for Inbound Date
        var adults = document.getElementById("adults").value; //Search form value for number of Adult(s)
        var children = document.getElementById("children").value; //Search form value for number of Child(ren)
        var infants = document.getElementById("infants").value; //Search form value for number of Infant(s)


        /*
        * Below displays user inputted values into console log and was used for testing purposes 
        *   and ensuring data was coming through
        */
        console.log("Search Flights Button pressed")
        console.log("fly_from: " + fly_from);
        console.log("fly_to: " + fly_to);
        console.log("date_from: " + date_from);
        console.log("date_to: " + date_to);
        console.log("# of adults: " + adults);
        console.log("# of children: " + children);
        console.log("# of infants: " + infants);

        /*
         * Below begins the API calls to Kiwi - then eventually to Aviationstack.
                Displays information in Flight table before returning ticketstring
                that will provide necessary data for booking details
         */
        ticketstring = generateSearchFlightResults(fly_from, fly_to, date_from, date_to, adults, children, infants);

    });

    $('#booknow').click(function () { //Once the searchflights button is clicked, proceeds with everything below

        /*
        * Below retrieves the user inputted values from HTML user input boxes
        */
        var bookerfirstname = document.getElementById("booker-firstname").value; //Search form value for Booker's First Name
        var bookerlastname = document.getElementById("booker-lastname").value; //Search form value for Booker's Last Name

        //Displays in console log Ticket String
        console.log("Ticket info after generateSearchFlightResults is done: \n" + ticketstring);

        pticket = JSON.parse(ticketstring); //Turns ticketstring into an object

        //Displays in console log parsed Ticket String. Allows for creation of JSON booking object
        console.log("Parsed ticketstring data for JSON booking object conversion/translation.\n" + pticket);

        //Pulls in necessary values and begins creating the necessary string for booking restAPI call
        finalbookinginfo = JSON.stringify({
            bookerfirstname: bookerfirstname,
            bookerlastname: bookerlastname,
            flightairlinecode: pticket.flightairlinecode,
            flightcost: pticket.flightcost,
            flightnumberadults: pticket.flightnumberadults,
            flightnumberchildren: pticket.flightnumberchildren,
            flightnumberinfants: pticket.flightnumberinfants,
            departureiata: pticket.departureiata,
            departurecity: pticket.departurecity,
            departuretime: pticket.departuretime,
            arrivaliata: pticket.arrivaliata,
            arrivalcity: pticket.arrivalcity,
            arrivaltime: pticket.arrivaltime
        })

        //Displays the final booking JSON string
        console.log("Final Booking Info in String: \n" + finalbookinginfo);
        sendBookingInfo(finalbookinginfo);

    });

}); //End of main function



/* 
 * 
 * Beginning of supporting functions
 *
 */

/*Function that begins API call to Kiwi API utilizing user-input data.
    This function also has searchAirlineName request embedded into it.*/
    function generateSearchFlightResults(fly_from, fly_to, date_from, date_to, adults, children, infants) {

        $.ajax({ //Begins Search API call
            url: 'https://tequila-api.kiwi.com/v2/search?', //Standard URL
            headers: { //Provides header specifics to Tequila API and key
                accept: 'application/json',
                apikey: 'r6AdLaNyOCA67Zin2YFKbZp1qFdEomc5'
            },
            data: { //Enters query factors for the API search

                //Below reads in user input data received in search form values
                fly_from: fly_from,
                fly_to: fly_to,
                date_from: date_from,
                date_to: date_to,
                adults: adults,
                children: children,
                infants: infants,

                //Below are constant values for this search
                flight_type: 'oneway',
                curr: 'USD',
                locale: 'us',
                vehicle_type: 'aircraft'
            },

        }).then(function (APIresponse) {

            /*
            * Below involves retrieve the airline code from Kiwi API (since airline name is not easily accessible) 
            *      and running through function "addAirlineName" into another API (Aviationstack) to retrieve Airline name
            */
            var airlinecode = APIresponse.data[0].airlines[0]; //Retrieves airline code from generated data and stores into variable airline code
            var airlinename = addAirlineName(airlinecode); //Takes airline code and runs through function

            /*
            * Below allow us to read and monitor the console log with the data. This helps confirm API link is working
            */
            console.log(APIresponse.data[0]); //Displays the first object (which for Kiwi is the cheapest flight)
            console.log("Airline code: " + APIresponse.data[0].airlines[0]); //Returns Airlines Code - still need to convert/locate and translate this
            console.log("Departure City: " + APIresponse.data[0].cityFrom + " (" + APIresponse.data[0].cityCodeFrom + ")"); //Returns from city code and city description
            console.log("Arrival City: " + APIresponse.data[0].cityTo + " (" + APIresponse.data[0].cityCodeTo + ")"); //Returns to city code and city description
            console.log("Departure Time: " + APIresponse.data[0].local_departure); //Provides the local departure time
            console.log("Arrival Time: " + APIresponse.data[0].local_arrival); //Provides the local arrival time        
            console.log("Total Price: " + APIresponse.data[0].price); //Provides the overall cost

            /*
            * Below stores information in variables to read the appended values easier
            */
            var departurecity = APIresponse.data[0].cityFrom; //Departure city
            var arrivalcity = APIresponse.data[0].cityTo; //Arrival city
            var totalprice = APIresponse.data[0].price; //Stores total price
            var departuretime = APIresponse.data[0].local_departure; //Stores departure time
            var arrivaltime = APIresponse.data[0].local_arrival; //Stores arrival time

            var departurecityandcode = APIresponse.data[0].cityFrom + " (" + APIresponse.data[0].cityCodeFrom + ")"; //Stores cityFrom and cityCodeFrom
            var arrivalcityandcode = APIresponse.data[0].cityTo + " (" + APIresponse.data[0].cityCodeTo + ")"; //Stores cityTo and cityCodeTo

            /*
            * Below references HTML classes/sections in the HTML document and appends the appropriate data into the document
            */
            $('.flightresults-description').append("Flight from " + departurecityandcode + " to " + arrivalcityandcode); //Displays flight description
            $('.flightresults-totalprice').append("Total Price: $" + totalprice); //Displays total price of tickets with consideration of adults, children, and infants
            $('.flightresults-departuretime').append("Departure Time: " + departuretime); //Displays departure time
            $('.flightresults-arrivaltime').append("Arrival Time: " + arrivaltime); //Displays arrival time
            $('.flightresults-adults').append("Adult(s): " + adults); //Displays number of adults
            $('.flightresults-children').append("Child(ren): " + children); // Displays number of children
            $('.flightresults-infants').append("Infant(s): " + infants); //Displays number of infants

            //Below runs obtained data and generates a ticketstring. This is the first step in creating the booking JSON details that is necessary for the POST call
            ticketstring = retrieveTicketString(airlinecode, totalprice,
                adults, children, infants,
                fly_from, departurecity, departuretime,
                fly_to, arrivalcity, arrivaltime);

            return ticketstring; //returns the generated ticketstring
        });

    }

/*Function generates a ticket string. 
    This is the first step in creating the booking JSON details that is necessary for the POST call*/
    function retrieveTicketString(flightairlinecode, flightcost,
        flightnumberadults, flightnumberchildren, flightnumberinfants,
        departureiata, departurecity, departuretime,
        arrivaliata, arrivalcity, arrivaltime) {

        generatedticketstring = JSON.stringify({ //stringifies the JSON object for readability
            flightairlinecode: flightairlinecode,
            flightcost: flightcost,
            flightnumberadults: flightnumberadults,
            flightnumberchildren: flightnumberchildren,
            flightnumberinfants: flightnumberinfants,
            departureiata: departureiata,
            departurecity: departurecity,
            departuretime: departuretime,
            arrivaliata: arrivaliata,
            arrivalcity: arrivalcity,
            arrivaltime: arrivaltime
        })

        return generatedticketstring; //Returns generated ticketstring

    }


/*Function makes a call to the Aviatian Stack API and retrieves the airline name.*/
    function addAirlineName(airlinecode) {

        $.ajax({
            url: 'http://api.aviationstack.com/v1/airlines?access_key=669abe1cc2afec71560c2518826e9bbf' //API url with API key 

        }).then(function (APIresponse) { //Data ran through here references data received from API after request is complete

            //console.log("Airline Name/Code Data: "+APIresponse.data); //Displays in console log all the data for Airlines

            for (i = 0; i < APIresponse.data.length; i++) { //Searches through each data array

                if (APIresponse.data[i].iata_code == airlinecode) { //Searches through the array and attempts to locate airline code 

                    console.log("Found code! Airline Name is: " + APIresponse.data[i].airline_name); //Generates console log for confirmation
                    $('.flightresults-airlinename').append("Flying with " + APIresponse.data[i].airline_name); //Appends Airline Name in the HTML class/HTML spot in document
                    return APIresponse.data[i].airline_name;
                }
            }
        });
    }

/*Function that sends our refined JSON booking details and posts it to the database.*/
    function sendBookingInfo(bookingdetails) { 
        var url = "http://localhost:4444/api/flights/bookflight";

        //Below opens up a new XMLHttpRequest to initialize the POST call
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () { //Checks for the connection's status
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);
            }
        };

        xhr.send(bookingdetails); //Sends booking details to SQL localhost server
        console.log("POST Mapping request was successful!"); //Displays in console log success of POST call

        //Below begins the "Confirmation Popup" for the user to know that details were confirmed and booked in the database
        var modal = document.getElementById("myModal"); //Get modal

        pdetails = JSON.parse(bookingdetails); //Parses booking details to make it easy to append in the modal view

        //Save confirmation details for each field
        $('.confirmation-bookerfirstname').append("Booker First Name: " + pdetails.bookerfirstname);
        $('.confirmation-bookerlastname').append("Booker Last Name: " + pdetails.bookerlastname);

        $('.confirmation-flightairlinecode').append("Flight Airline Code: " + pdetails.flightairlinecode);
        $('.confirmation-flightcost').append("Total Flight Cost: " + pdetails.flightcost);

        $('.confirmation-flightnumberadults').append("# of Adults: " + pdetails.flightnumberadults);
        $('.confirmation-flightnumberchildren').append("# of Children: " + pdetails.flightnumberchildren);
        $('.confirmation-flightnumberinfants').append("# of Infants: " + pdetails.flightnumberinfants);

        $('.confirmation-departureiata').append("Departure Airport IATA Code: " + pdetails.departureiata);
        $('.confirmation-departurecity').append("Departure City: " + pdetails.departurecity);
        $('.confirmation-departuretime').append("Departure Time: " + pdetails.departuretime);

        $('.confirmation-arrivaliata').append("Arrival Airport IATA Code: " + pdetails.arrivaliata);
        $('.confirmation-arrivalcity').append("Arrival City: " + pdetails.arrivalcity);
        $('.confirmation-arrivaltime').append("Arrival Time: " + pdetails.arrivaltime);

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        //Allows the user to see the modal popup
        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    }