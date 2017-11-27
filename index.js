
////////////////////////////////////////  Variables  /////////////////////////////////////////////////
var username = "063868b1fa93f559ae2cd95824d9ac5a";
var password = "92ef1568d3e3c7cec6a37dca78224d04";
var authorized = window.btoa(`${username}:${password}`);
var companyInfo = '';
var newsFeed = '';
var ticker = '';
var price='';

//////////////////////////////////////////  API requests  ////////////////////////////////////////////////////////

function getCompanyData(company) {
  $.ajax({
    type: "GET",
    url: `https://api.intrinio.com/companies?query=${company}`,
    dataType: 'json',
    page_number: 1,
    page_size: 7,
    headers: {
      "Authorization": "Basic " + authorized
    },
    success: function(data) {
      useReturnData(data);
    }
  });
}

function getNewsData(ticker) {
  $.ajax({
    type: "GET",
    url: `https://api.intrinio.com/news?identifier=${ticker}`,
    dataType: 'json',
    page_number: 1,
    headers: {
      "Authorization": "Basic " + authorized
    },
    success: function(data) {
      useNewsData(data); //set success functions in .done for when request
      //findCompanyNews();
      getStockPrices(ticker);
    }
  });
}


function getStockPrices(ticker){
	$.ajax({
		type:"GET",
		url: `https://api.intrinio.com/prices?identifier=${ticker}`,
		dataType: 'json',
		page_number:1,
		headers: {
			"Authorization": "Basic " + authorized
		},
		success: function(data){
			useStockData(data);
		}
	});
}
///////////////////////////////////  API Data Storage  //////////////////////////////////////////////////////



function useReturnData(data) {
  companyInfo = data;
  //access the data in the object and verify
  var moreData = companyInfo['data'];
  //turn object entries into an array for loop
  var finalData = moreData['0'];
  var allTheData = Object.entries(finalData);
  allTheData.map(info => {
    $('.timeseries').append(`<ul><li>${info[0]}: ${info[1]}</li></ul>`);
  });
  ticker = allTheData[0][1];
  getNewsData(ticker);
};



function useNewsData(data) {
  var news = data;
  newsFeed = news['data'];
  // var currentNews = Object.entries(newsFeed);
  var shortNews = newsFeed.slice(0, 5);
  //loop through each news story and create arrays
  for (var i = 0; i < shortNews.length; i++) {
    var moreNews = Object.entries(shortNews);
    var newsStory = moreNews[i][1];
    var summary = newsStory['summary'];
    var url = newsStory['url'];
    var title = newsStory['title']
    $('.news').append(`<section><a href="${url}" target="_blank"><h4>${title}</h4></a>
    	<p>${summary}</section>`);
  }
};

function useStockData(data){
	price = data;
	var price2=price['data']['0'];
	var priceArray=Object.entries(price2);
	console.log(priceArray);
	priceArray.map(info => {
	
		$('.pricing').append(`<ul><li>${info[0]}: ${info[1]}</li></ul>`);
	  });

}


/////////////////////////////  Web app usage  /////////////////////////////////////////////////



function formReset() {
  $('.searchresults').empty();
  $('.timeseries').empty();
  $('.news').empty();
  $('.pricing').empty();
};

function clickSubmit() {
  $('button').on('click', event => {
    event.preventDefault();
    formReset();
    var searchCriteria = $('input[type=text]').val();
    var searchUpperCase = searchCriteria.toUpperCase();
    getCompanyData(searchCriteria);
    //$(`.searchresults`).append(`Stock Ticker: ${searchUpperCase}<br>`)
    $('.showresults').show();

  });
}

$(clickSubmit)
