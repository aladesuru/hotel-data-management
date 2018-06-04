/*********************************************
* Global variable Declearation
**********************************************/
let searchText = document.getElementById('search-text');
let filterOption = document.getElementById('filter-option');
let filterForm = document.getElementById('filter-form');
let mainContent = document.getElementById('main-content');
let sortel = document.getElementById('sort');
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
	}
}

/* want to change placeholder text each time user select option to use in filtering */
let changePlaceholderText = () => {
  let placeholderText = `Enter ${filterOption.value}`;
  searchText.setAttribute("placeholder" , placeholderText);
  searchText.focus();
}
eventUtility.addHandler(filterOption ,'change' , changePlaceholderText);

/* call back function that sort data*/
let bindSortData = () => {    
  let val = sortel.value;
  if(records && val){
    sorted_records = records.sort(function(a, b){
     return a[val] - b[val];
    });
    hotelDataManagement.displayData(sorted_records);
  }  
}


/* To fetch data set to display , search data and sort it . 
* i will create another object to model these functionalities,
*  the object name will be called hotelDataManagement 
*/
const hotelDataManagement = {

  dataSet : null ,
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

    let url = location.pathname + ApiUrl;       //path to the resource
    xhr.open('GET' , url);
    xhr.send();
  },

  displayData: (records) => {
    let ul = '<ul>';
    let li = '';
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
  mainContent.innerHTML = ul + li + "</ul>";
  eventUtility.addHandler(sortel , 'change', bindSortData);
  }
}

//fetch data

 hotelDataManagement.fetchRecord('hotels.json');

 //sort data
 // let sortrec = () => {
 //  hotelDataManagement.fetchRecord('hotels.json');
 // }
 // 

// search data



