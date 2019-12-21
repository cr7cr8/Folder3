$(document).ready(function(){

  $('form').on('submit', function(){

      var item = $('form input');
      var todo = {item: encodeURIComponent(item.val())}//item.val().trim()};

      $.ajax({
        type: 'POST',
        url: '/',
        data: todo, 
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
          
        }
      });

      return false;

  });

  $('li').on('click', function(){
      var item = encodeURIComponent($(this).text())//$(this).text().replace(/ /g, " ");
   
      $.ajax({
        type: 'DELETE',
        url: '/' + item,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });
  });

});
