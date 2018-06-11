export default{
  preview: function(totalScene, storedBackground, storedPicture, storedText){
      var cvs_name;
      var newwin = window.open('','','');
      var newcontent = `
      <html lang="en">
      <head lang="en">
      <meta charset="UTF-8">
      <title>Preview</title>
      <style type="text/css">
      .container{
        margin:0 auto;
        width:800px;
      }
      #scene{
        border:1px solid black;
      }
      </style>
      </head>
      <body>
      <div class="container">
      `
      newwin.document.write(newcontent);
      for (let i = 0; i <= totalScene; i++){
        cvs_name = "cvs" + String(i);
        newcontent =
        "<canvas id=" + cvs_name + " width='800' height='600' style='border-style: ridge;'></canvas>";
        newwin.document.write(newcontent);
      }
      window.localStorage['storedBackground'] = JSON.stringify(storedBackground);
      window.localStorage['storedPicture'] = JSON.stringify(storedPicture);
      window.localStorage['storedText'] = JSON.stringify(storedText);
      newcontent = `
      </div>
      <script language="JavaScript">
      var local_cvs;
      var local_ctx;
      `;
      newwin.document.write(newcontent);
      newcontent =
      "var new_storedBackground = window.localStorage['storedBackground'];" +
      "var new_storedPicture = window.localStorage['storedPicture'];" +
      "var new_storedText = window.localStorage['storedText'];";
      newwin.document.write(newcontent);
      newcontent =
      `
      storedBackground = JSON.parse(new_storedBackground);
      storedPicture = JSON.parse(new_storedPicture);
      storedText = JSON.parse(new_storedText);
      function previewStoredImage(cvs, local_ctx, currentScene) {
        return new Promise(function(resolve, reject) {
          if (!!storedBackground[currentScene]) {
            var background = new Image();
            background.src = storedBackground[currentScene];
            background.onload = function(){
              previewBackground(this, 0, 0, cvs.width, cvs.height, local_ctx)
              resolve(local_ctx);
            };
          }
          if (!!storedPicture[currentScene]) {
            var img = new Image();
            img.src = storedPicture[currentScene];
            img.onload = function(){
              previewPicture(this, 0, 0, cvs.width, cvs.height, local_ctx)
              resolve(local_ctx);
            };
          }
        });
      }

      function previewInput(local_ctx, currentScene) {

        if (!!storedText[currentScene]) {
          local_ctx.font = "20px Arial";
          // local_ctx.font = "small-caps italic 700 30px Arial menu";
          // local_ctx.fillStyle="#f00";
          local_ctx.fillText(storedText[currentScene], 10, 530);
        }
      }

      function previewPicture(obj,x,y, width, height, local_ctx){
        local_ctx.drawImage(obj, x, y, width, height);
      }

      function previewBackground(obj,x,y, width, height, local_ctx) {
        local_ctx.drawImage(obj, x, y, width, height);
      }
      </script>
      <script language="JavaScript">
      function showAll(){
      `;
      newwin.document.write(newcontent);

      for (let j = 0; j <= totalScene; j++){
        cvs_name = "cvs" + String(j);
        newcontent = "local_cvs = document.getElementById('" + cvs_name +"');"
        + "\n local_ctx = local_cvs.getContext('2d');"
        + "\n previewStoredImage(" + cvs_name + ", local_ctx, "+ j+").then((res) => {previewInput(res, " + j + ")});";
        newwin.document.write(newcontent);
      }

      newcontent =
      `
      }
      window.onload = showAll();
      </script>
      </body>
      </html>
      `
      newwin.document.write(newcontent);
      newwin.document.close();
    }
}
