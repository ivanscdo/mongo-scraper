
$.getJSON("/sales-flyer", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#sales-flyer").append("<p data-id='" + data[i]._id + "'>" + data[i].itemName + "<br />" + data[i].salePrice + "<br />" + data[i].regPrice + "<br />" + data[i].validDates + "</p>");
    }
  });
  
  
  $(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/sales-flyer/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<label>" + data.itemName + "</label>");
        $("#notes").append("<input class='form-control' placeholder='Note Title' id='titleinput'>");
        $("#notes").append("<textarea class='form-control' placeholder='Note' rows='3' id='bodyinput'></textarea>");
        $("#notes").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/sales-flyer/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  