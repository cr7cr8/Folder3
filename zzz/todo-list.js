$(document).ready(function () {


  //$('form').on('submit', function () {

  // var item = $('form input');
  // var todo = { item: encodeURIComponent(item.val()) }//item.val().trim()};
  // $.ajax({
  //   type: 'POST',
  //   url: '/m/home',
  //   data: todo,
  //   xhrFields: { withCredentials: true },
  //   success: function (data) {
  //     //do something with the data via front-end framework

  //   //  location.reload()
  //     // ($("input[name='file']")[0].files[0])
  //     //   ? upload(data._id)
  //        location.reload()
  //   }
  // });

  // return false;

  //});

  $('li').on('click', function () {
    var item = encodeURIComponent($(this).text())//$(this).text().replace(/ /g, " ");

    $.ajax({
      type: 'DELETE',
      url: '/m/' + item,
      success: function (data) {
        //do something with the data via front-end framework
        location.reload();
      }
    });
  });

  //function upload(id) {
  $('form').on('submit', function () {
    alert(inputFile.name)
    var inputFile = $("input[name='file']")[0].files[0];
    var formData = new FormData();
    formData.append('file', inputFile, inputFile.name);
    formData.append('caption', $('#caption').val());


    $.ajax({

      type: 'POST',
      url: '/p/upload',
      data: formData,
      encType: "multipart/form-data",
      processData: false,
      contentType: false,
      success: function (data) {
        alert(data)
        //  location.reload()
      }
    });

  })

})
