$(document).ready(function () {


  $('ul li img').on('click', function (e) { e.stopPropagation(); })
  //$('form').on('submit',uploadMessage )
  $("button[name='btn']").on('click', uploadMessage);

  function uploadMessage() {
    //alert (Boolean($("input[name='file']")[0].files[0]))
    var item = $("form input[name='item']");
    var todo = {
      item: encodeURIComponent(item.val()) || [...String(new Date())].splice(16, 8).join("") + ' ' + [...String(new Date())].splice(0, 15).join(""),
      pic: Boolean($("input[name='file']")[0].files[0]),

    }//item.val().trim()};

    $.ajax({
      type: 'POST',
      url: '/m/home',
      data: todo,
      xhrFields: { withCredentials: true },
      success: function (data) {
        //   location.reload()
        ($("input[name='file']")[0].files[0])
          ? (function () {
            $("ul").prepend(`${data}`);
            $('li:first').on('click', deleteMessage)
            uploadPic($('li:first span:first').text())
            return false;
          })()
          : (function () {
            $("ul").prepend(`${data}`);
            $('li:first').on('click', deleteMessage)
            return false;
            //  uploadPic($('li:first span:first').text())
            //  uploadPic(data)
          })()
      }

    });

    return false; // cannot be return null



  }

  function uploadPic(id) {

    var inputFile = $("input[name='file']")[0].files[0];
    var formData = new FormData();
    //formData.append('file', inputFile, inputFile.name + "!" + id);
    formData.append('file', inputFile, inputFile.name);

    //formData.append('metadata', "aaaaaaaaa");
    //formData.append('caption', $('#caption').val());
    //formData.append('mmm', id);
    $.ajax({
      type: 'POST',
      url: `/p/upload/${id}`,
      xhrFields: { withCredentials: true },
      data: formData,
      metadata: "ooooo",
      encType: "multipart/form-data",
      processData: false,
      contentType: false,
      success: function (data) {

        console.log(`img ${data}`)
        $('li:first').append(`${data}`)
        $('ul li:first img').on('click', function (e) { e.stopPropagation(); })
        return false;
        // location.reload()
      }
    });
    return false; // cannot be return null
  }


  $('li').on('click', deleteMessage);


  function deleteMessage(e) {


    const id = $(this).find("span").text().trim()
    console.log($(e.target))
    const img = $(`img[src="/p/get/${id}"]`)

    $.ajax({
      type: 'DELETE',
      url: '/m/' + id,

      success: function (data) {

        (img.length)
          ? (function () { $(e.target).remove(); deletePic(id) })()
          : $(e.target).remove()
        // : location.reload()
        return false;
      }
    })
    return false;
  }


  function deletePic(id) {

    $.ajax({
      type: 'DELETE',
      url: '/p/delete/' + id,

      success: function (data) {
        console.log(`img ${data} deleted`)
        // location.reload()
        //do something with the data via front-end framework
        return false;
      }
    });
    return false;
  }





  return false;


})
