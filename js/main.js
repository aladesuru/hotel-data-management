/*********************************************
* Global variable Declearation
**********************************************/
let searchText = document.getElementById('search-text');
let filterOption = document.getElementById('filter-option');
let filterForm = document.getElementById('filter-form');
let mainContent = document.getElementById('main-content');
let records = null;
let xhr = new XMLHttpRequest();


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
  console.log(placeholderText);
  searchText.setAttribute("placeholder" , placeholderText);
  searchText.focus();
}
eventUtility.addHandler(filterOption ,'change' , changePlaceholderText);

/* To fetch data set to display , search data and sort it . 
* i will create another object to model these functionalities,
*  the object name will be called hotelDataManagement 
*/

const hotelDataManagement = {

  dataSet : null ,
  errorMsg : '' ,

  fetchRecord : (ApiUrl) => {
    xhr.onreadystatechange = () =>{
      let response = null
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {                    // check if the response was successfull
          response = JSON.parse(xhr.response);     // convert the response to javascript object 
          records = response.Establishments;

           console.log(records.length); 

          let ul = '<ul>';
          let li = '';
          for (let i = 0; i <= records.length - 1 ;  i++) {
          li += `<li class="list-container">
            <div>
              <div class="hotel-image"><img src="${records[i].ImageUrl}" /></div>
              <div class="hotel-info-container">
                <p class="name">${records[i].Name}</p>
                <p class="starrating">star rating ${records[i].Stars}</p>
                <p class="location"><span>${records[i].Location} , </span><span> ${records[i].Distance.toFixed(2)} miles</span></p>
                <p class="userrating"><span>${records[i].UserRating}</span><span>${records[i].UserRatingTitle}<span>(${records[i].UserRatingCount} Reviews)</span></span></p>
              </div>
              <div class="hotel-cost"><p>Price From &pound;${records[i].MinCost}</p></div>
            </div>
          </li>`
        }
        mainContent.innerHTML = ul + li + "</ul>";


         
          return records;
        }else{                                    // if request not successfull display the following errorMsg       
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

  displayData: (data) => {
    // for(let data of this.dataSet){
    //  ` <li class="list-container">
    //         <div>
    //           <div class="hotel-image"><img src="dataSet[10]" /></div>
    //           <div class="hotel-info-container">
    //             <p class="name">Magic Circus Hotel at Disneyland Paris</p>
    //             <p class="starrating">star rating</p>
    //             <p class="location"><span>Lodon</span><span> 7.34 miles</span></p>
    //             <p class="userrating"><span>user rating</span><span>Excellent<span>(300 Reviews)</span></span></p>
    //           </div>
    //           <div class="hotel-cost"><p>Price From &pound;200</p></div>
    //         </div>
    //       </li>`

    // }

  },

  sortData : () => {

  }
};

//fetch data
 hotelDataManagement.fetchRecord('hotels.json');


// display data
hotelDataManagement.displayData();


