// Martha Elena García Ramos
// A01139413

const API_KEY = "AIzaSyB8_i7W7YtdN-jXfhQWXpSSOlqNZivadJ0";  //sent as a parameter

function fetchVideos(searchTerm, pageSearch){
    'https://www.googleapis.com/youtube/v3/search?part=snippet&q=dogs&key=[YOUR_API_KEY]'
    /*
    PARAMETERS:
    "part=snippet" is the required parameter
    "q" specifies the query term to search for
    "pageToken" identifies a specific page in the result set that should be returned (for next buttons) 
    "maxResults" allows to change amount of videos to show
    */
   let url
    if(pageSearch ==  "firstSearch"){
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&maxResults=10&key=${API_KEY}`;
    }
    else{
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&maxResults=10&key=${API_KEY}&pageToken=${pageSearch}`;
    }

    let settings = {
        method : 'GET'
    };

    //console.log( url );

    fetch(url, settings).then(response => {
        if(response.ok){
            return response.json(); //this is a promise (browser doesnt know how long it will take)
        }
        throw new Error (response.statusText); 
    }).then(responseJSON => {
        displayResults(responseJSON, searchTerm); 
    }).catch(err => {
        console.log(err); 
    }); 
}

function displayResults(data, searchTerm){
    let results = document.querySelector('.results');
    results.innerHTML = "";

    //items: list with matching results
    for(let i = 0; i < data.items.length;  i ++){
        results.innerHTML += 
        `
        <li>
        <div class = "resultVideo clickable"> 

        <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
            <h3 class ="clickable"> 
            ${data.items[i].snippet.title}
            </h3>
        </a>
             <div>
             <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank" >
                 <img src=${data.items[i].snippet.thumbnails.default.url} alt="Video thumbnail" class ="clickable"
                 style="width:${data.items[i].snippet.thumbnails.default.width}px;height:${data.items[i].snippet.thumbnails.default.height}px;">
             </a>    
             </div> 

        </div> 
        </li>    
        `; 
    }
    document.querySelector('.buttonsSection').innerHTML =  
        `
        <div>
        <button class = "prevBtn">Previous</button>
        <button class="nextBtn">Next</button>
      </div>
        `;

    let nextToken = data.nextPageToken;
    let prevToken = data.prevPageToken;
    let next = document.querySelector('.nextBtn'); 
    let previous = document.querySelector('.prevBtn'); 
    
    next.addEventListener('click', ( event ) => {
        fetchVideos(searchTerm, nextToken); 
    }); 

    previous.addEventListener('click', (event) => {
        if(prevToken == ""){
            alert("This is the first page"); 
        }
        else{
            fetchVideos(searchTerm, prevToken);
        }
    });
}


function watchForm(){
    let searchBtn = document.querySelector( '.searchBtn' );

    searchBtn.addEventListener( 'click', ( event ) => {
        event.preventDefault();
        let searchTerm = document.querySelector('#searchTerm').value; //by id of input
        let searchStatus = "firstSearch";
        fetchVideos(searchTerm, searchStatus);
    });
}


function init(){
    watchForm();
}

init();