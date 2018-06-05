/*********************************************
* Global variable Declearation
**********************************************/
let searchText = document.getElementById('search-text');
let filterOption = document.getElementById('filter-option');
let filterForm = document.getElementById('filter-form');
let mainContent = document.getElementById('main-content');
let searchForm = document.getElementById('search-form');
let sortBy = document.getElementById('sortby');
let records = null;



/* For crossbrowser compatiblity i created an 
*  event utitilities to access Event object regardless of how event handler is called 
*  and also provide support for browser that is not DOM event compliant 
*/

let eventUtility = {
	addHandler : (element , type , handler) => {
		if (element.addEventListener) {
			element.addEventListener(type , handler , false);
		} else if (element.attachEvent) {
			element.attachEvent('on' + type , handler);
		} else{ 
			element['on' + type] = handler ;
		}
	},

  getEvent : (event) => {
    return event ? event : window.event;
  },

  getTarget : (event) => {
    return event.target || event.srcElement;
  },

  preventDefault : (even) => {
    if (event.preventDefault) {
      return event.preventDefault();
    } else {
      return returnValue = false;
    }
  } 

};

/* want to change placeholder text each time user select option to use in filtering */
let changePlaceholderText = () => {
  let placeholderText = `Enter ${filterOption.value}`;
  searchText.setAttribute("placeholder" , placeholderText);
  searchText.focus();
}
eventUtility.addHandler(filterOption ,'change' , changePlaceholderText);

/* call back function that sort data*/
let bindSortData = () => {    
  let val = sortBy.value;
  if(records && val){
    sorted_records = records.sort(function(a, b){
     return a[val] - b[val];
    });
    hotelDataManagement.displayData(sorted_records);
  }  
}
eventUtility.addHandler(sortBy , 'change', bindSortData);

/* call back function that search data*/
let searchBY = (event) => {
    event = eventUtility.getEvent(event);
    eventUtility.preventDefault();
    if (records && searchText.value.trim() !== " ") {
       hotelDataManagement.displayData(records);
    }
}
eventUtility.addHandler(searchText , 'keyup',  searchBY);

/* prevent sumbit button form submiting form*/
let preventFormsubmit = (event) => {
  event = eventUtility.getEvent(event);
  eventUtility.preventDefault();
}
eventUtility.addHandler(searchForm , 'submit' , preventFormsubmit);
eventUtility.addHandler(searchForm ,'submit', searchBY);


/* To fetch data set to display , search data and sort it . 
* i will create another object to model these functionalities,
*  the object name will be called hotelDataManagement 
*/
const hotelDataManagement = {
  errorMsg : '' ,

  fetchRecord : (ApiUrl) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
      let response = null
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {                    // check if the response was successfull
          response = JSON.parse(xhr.response);     // convert the response to javascript object 
          records = response.Establishments;
           console.log(records.length); 
          hotelDataManagement.displayData(records);
        }else{                                     // if request not successfull display the following errorMsg       
          this.errorMsg = 
          "Sorry something went wrong we are working on it to give the best user experience"; 
          alert(errorMsg);
        }
      } 
    }; 

    let url = location.pathname + ApiUrl;       //path to the data source
    xhr.open('GET' , url);
    xhr.send();
  },

  displayData: (records) => {
    let ul = '<ul>';
    let li = ''; 
    if (searchText.value.trim() !== " ") {
        console.log("not searching");
    } else {
       for (let i = 0; i <= records.length - 1 ;  i++) {    
        li += `<li class="list-container">
          <div>
            <div class="hotel-image"><img src="${records[i].ImageUrl}" /></div>
            <div class="hotel-info-container">
              <p class="name">${records[i].Name} (${records[i].EstablishmentType})</p>
              <p class="starrating">Star Rating ${records[i].Stars}</p>
              <p class="location"><span>${records[i].Location} , </span><span> ${records[i].Distance.toFixed(2)} miles</span></p>
              <p class="userrating"><span>${records[i].UserRating}</span><span>${records[i].UserRatingTitle}<span>(${records[i].UserRatingCount} Reviews)</span></span></p>
              <p class="establishments-ref">Reference : ${records[i].EstablishmentId}</p>
            </div>
            <div class="hotel-cost"><p>Price From &pound;${records[i].MinCost}</p></div>
          </div>
        </li>`
    }
   
  }
  mainContent.innerHTML = ul + li + "</ul>";
  }
}

//fetch data
 hotelDataManagement.fetchRecord('hotels.json');



