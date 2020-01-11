$(document).ready(function () {


  $("button[name='btn']").on('click', function () {
    
    alert (Boolean($("input[name='file']")[0].files[0]))
    var item = $("form input[name='item']");
    var todo = {
      item: encodeURIComponent(item.val()),
      pic: Boolean($("input[name='file']")[0].files[0]),


    }//item.val().trim()};



    $.ajax({
      type: 'POST',
      url: '/m/home',
      data: todo,
      xhrFields: { withCredentials: true },
      success: function (data) {
        //do something with the data via front-end framework
        //alert(data);
        //   location.reload()

        ($("input[name='file']")[0].files[0])
          ? upload(data._id)
          : location.reload()
      }

    });

    return false; // cannot be return null

  });

  function upload(id) {


    var inputFile = $("input[name='file']")[0].files[0];
    var formData = new FormData();
    formData.append('file', inputFile, inputFile.name + "-" + id);

    formData.append('caption', $('#caption').val());
    formData.append('mmm', "nnn");

    console.log(inputFile);

   // alert(inputFile.name);
    $.ajax({

      type: 'POST',
      url: '/p/upload',
      xhrFields: { withCredentials: true },
      data: formData,
      encType: "multipart/form-data",
      processData: false,
      contentType: false,
      success: function (data) {

       // alert(data)
       location.reload()
      }



    });
    return false; // cannot be return null
  }



  $('li').on('click', function () {
  //  var item = encodeURIComponent($(this).text())//$(this).text().replace(/ /g, " ");
  //  alert ($(this).find("span").text())
   const id = $(this).find("span").text().trim()
    $.ajax({
      type: 'DELETE',
      url: '/m/' + id,
      success: function (data) {
       
        //do something with the data via front-end framework
        location.reload();
      }
    });
  });

  // $('form').on('submit', function () {

  //   var inputFile = $("input[name='file']")[0].files[0];
  //   var formData = new FormData();
  //   formData.append('file', inputFile, inputFile.name);

  //   formData.append('caption', $('#caption').val());
  //   formData.append('mmm', "nnn");

  //   console.log(inputFile);

  //   alert(inputFile.name);
  //   $.ajax({

  //     type: 'POST',
  //     url: '/p/upload',
  //     data: formData,
  //     encType: "multipart/form-data",
  //     processData: false,
  //     contentType: false,
  //     success: function (data) {

  //       alert(data)
  //     }



  //   });
  //   return false; // cannot be return null
  // });

})
