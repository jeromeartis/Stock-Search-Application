
const stocklist = ['SIRI','FB','AAPL',"F"];
const validationlist = [];

const validateQuery = function (event) {

  const validationURL = "https://api.iextrading.com/1.0/ref-data/symbols";
  $.ajax({
    url: validationURL,
    method: 'GET'
  }).then(function(response){
    for (let i = 0; i < response.length; i++){
      validationlist.push(response[i].symbol);
    }
  })
}

const displayQuery = function(event) {
  $('.card-header').empty();
  $('.text-body1').empty();
  $('.text-body2').empty();
  $('.text-body3').empty();
  const stock = $(this).attr('data-name');
  const queryURL = `http://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news,chart&range=1m&last=10`;
  const logoURL = `http://api.iextrading.com/1.0/stock/${stock}/logo/`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response){

      let cardHeader = response.quote.companyName;
      $('.card-header').html(cardHeader);
      let card_text1 = response.quote.latestPrice
      let card_text2 = response.quote.primaryExchange

      $('.text-body1').html(`<span>Price:</span>  ${card_text1}`);
      $('.text-body2').html(`<span>Primary Exchange:</span> ${card_text2}`);
      for (let i = 0; i < response.news.length; i++){
        const news = response.news[i].summary
        $('.text-body3').append(`<span>News: </span> ${news}`)


      }

      $.ajax({
        url: logoURL,
        method: 'GET'
      }).then(function(response){
        $('#stocks-view').text(JSON.stringify(logoURL))
           const logo  = $(`<img src="${response.url}"/>`);
           $('.card-header').append(logo);

      })
  })

};



const render = function () {

  $('#buttons-view').empty();

  for (let i = 0; i < stocklist.length; i++) {

    const newButton = $('<button>');

    newButton.addClass('stock-btn');

    newButton.attr('data-name', stocklist[i]);

    newButton.text(stocklist[i]);

    $('#buttons-view').append(newButton);
  }
}

const addButton = function(event) {

  event.preventDefault();

  // This line will grab the text from the input box
  const stock = $('#stock-input').val().trim().toUpperCase();

  if(validationlist.includes(stock)){
    stocklist.push(stock);

    $('#stock-input').val('');

  }

  render(),  $('#stock-input').val('');
}



render();
validateQuery();
 $('#buttons-view').on('click','.stock-btn', displayQuery);
 $('#add-stock').on('click',addButton);
