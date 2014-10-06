function showAddons(addons) {
  var source   = $("#addon-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };

  $(addons).each(function(idx, value) {
    data.list.push({
      name: value.name,
      code: value.code,
      price: value.price.USD.unit_amount
    });
  });

  $('.addons-container').html(template(data));
}

function showAddonsSummary(addon) {
    

  var source   = $("#addon-summary-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };
    
if(addon.quantity != 0) {
 $(addon).each(function(idx, value) {
    data.list.push({
      name: value.name,
      code: value.code,
      quantity: value.quantity,
      price: value.price.USD.unit_amount
    });
  }); 
}
  $('.addons-summary-container').append(template(data));

}

function advancedConfirmation(x) {
    

  var source   = $("#advanced-confirmation-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };
    
    console.log(data);
  $(x).each(function(idx, value) {
    data.list.push({
      first_name:value['first-name']
    }); 
  });
    
 //$(addon).each(function(idx, value) {

  //}); 
 // console.log(list);
  $('.subscription-details-container').append(template(data));

}



