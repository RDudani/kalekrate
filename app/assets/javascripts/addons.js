var addonsList = [];

function showAddons(addons) {
  var source   = $("#addon-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };

  $(addons).each(function(idx, value) {
    data.list.push({
      name: value.name,
      code: value.code,
      price: value.price.USD.unit_amount.toFixed(2)
    });
  });

  $('.addons-container').html(template(data));
}

function updateAddonForSummary(addon) {
  removeAddon(addon.code);
  if(addon.quantity > 0) {
    addonsList.push({
      name: addon.name,
      code: addon.code,
      quantity: addon.quantity,
      price: (addon.quantity * addon.price.USD.unit_amount).toFixed(2)
    });
  }
  updateLineItemsSummary();
}

function removeAddon(addonCode) {
  addonsList = addonsList.filter(function(addon) {
    return addon.code !== addonCode;
  });
}

function advancedConfirmation(x) {
  var source   = $("#advanced-confirmation-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };

  $(x).each(function(idx, value) {
    data.list.push({
      firstName:value['first-name'],
      lastName: value['last-name'],
      addons: value.addons,
      address: value.address,
      city: value.city,
      state: value.state,
      month: value.month,
      year: value.year,
      zip: value.zip,
      country: value.country,
      number: masked(value.number),
      account_number: masked(value.account_number),
      routing_number: value.routing_number,
      routing_number_bank: value.routing_number_bank
    });
  });

 //$(addon).each(function(idx, value) {

  //});
  console.log(data);
  $('.subscription-details-container').append(template(data));

}

function masked(number) {
  var maskedNumber = "";
  for (var i = 0; i < number.length - 4; i++) {
    if (number[i] === ' ') maskedNumber += ' ';
    else maskedNumber += 'x';
  }
  return maskedNumber + number.slice(-4);
}
