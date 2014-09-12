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

function showAddonsSummary(addons) {
  var source   = $("#addon-summary-template").html()
    , template = Handlebars.compile(source)
    , data = { list: [] };

  $(addons).each(function(idx, value) {
    data.list.push({
      name: value.name,
      code: value.code,
      price: value.price.USD.unit_amount
    });
  });

  $('.addons-summary-container').html(template(data));
}
