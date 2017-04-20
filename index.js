
  var clientW = window.innerWidth;
  var clientH = window.innerHeight;
  var ratioX =  clientW/2000;
  var ratioY = clientH/1000;

  var cover=document.getElementById("cover");
  var sky=document.getElementById("sky");

  $("body").css({"font-size":clientW/100+"px","width":clientW+"px","height":clientH+"px"});

  if (cover) {

    cover.width = clientW;
    cover.height = clientH;

    var ctx = cover.getContext("2d");
    ctx.moveTo(clientW/2,clientH/2);
    ctx.beginPath();
    ctx.fillStyle = '#444';
    ctx.fillRect(0,0,clientW,clientH);
    ctx.textAlign="center";

    ctx.font=clientW/4+"px Impact";
    ctx.textBaseline="middle";
    ctx.globalCompositeOperation = 'destination-out';
    ctx.shadowColor = "rgba(0,0,0,.5)";
    ctx.fillText("color",clientW/2,clientH/2);
    ctx.fillStyle = '#000';
    ctx.globalCompositeOperation = 'source-over';//amazing!

    var ctx_sky = sky.getContext("2d");
    sky.width = clientW;
    sky.height = clientH;

    var skyColor = [242,83,0];

    function playSceneCity(){
      var city=document.getElementById("scene_city");
      city.width = clientW;
      city.height = clientH;
      var ctx = city.getContext("2d");
      var skyctx = sky.getContext("2d");

      //把原先的点转化成可以生成贝塞尔曲线的点
        var changePoint = function (arr,i,origin){
          if (arr.length==6) {
            arr = arr.map(function(value, index){
              return value + origin[(index % 2 == 0) ? 0 : 1];
            })
          }else{
            if(arr[6]=="C"){
              arr.length = 6;
            }
          }
          origin[0] = arr[4];
          origin[1] = arr[5];
          return arr;
        }

        var newPointList=[];

        //画曲线
        var pointToCurve = function(pointlist,ctx,origin) {
          Array.prototype.map.call(pointlist, function(value,index){
            var innerArr = value.map(function(v,i){
              if ( i<=5 ) {
                return (i % 2 == 0) ? parseInt(v*ratioX) : parseInt(v*ratioY);
              }else{
                return v;
              }
            })
            newPointList[index] = innerArr;
            var arr = changePoint(innerArr,index,origin);
            ctx.bezierCurveTo(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
            return innerArr;
          })
        }

        var skyColor = [240,84,0];

      function drawScene() {
        light=light +1;
        
        //随着light变化生成新的hsl色值
        var newHsl = function(arr) {
          return "hsl("+arr[0]+","+arr[1]+"%,"+parseInt(light/100*arr[2])+"% )"
        }
        
        if (light<=100) {

          function drawBG(color,light){
            var h = color[0];
            var s = color[1];
            var l = light;
            var newColor = [h+1,s-1,l+1]
            console.log(color + ":"+newColor);
            var grd = skyctx.createLinearGradient(0,0,0, clientH);
            grd.addColorStop(0,   newHsl(color));
            grd.addColorStop(0.8,   newHsl(newColor));
            grd.addColorStop(1,   "#fff");
            skyctx.fillStyle = grd;
            skyctx.fillRect(0,0,clientW,clientH);
            skyColor = newColor;
          }
          
          //画矩形
          var drawRect = function(x,y,h,s,l,width,height){
            ctx.fillStyle = "hsl("+h+", "+s+"%, "+ l*light/100+ "%)";
            ctx.fillRect(x*ratioX,y*ratioY,width*ratioX,height*ratioY);
          }

          //画窗户
          var drawWindows = function(x,y,width,height){
            for (var j = 0; j < 4; j++) {
              for (var i = 0; i < 2; i++) {
                drawRect(x+width*2*i,y+height*1.5*j,56,94,50,width,height,ctx)
              };

            }
          }

          //画树枝
          var drawTree =function (ctx, x, y, w, h) {
            var kappa = 0.5522848;
                ox = (w / 2) * kappa, 
                oy = (h / 2) * kappa, 
                xe = x + w,           
                ye = y + h,           
                xm = x + w / 2,       
                ym = y + h / 2;       

            var treeColor1 = newHsl([25,100,28]);
            var treeColor2 = newHsl([10,69,26]);

            var grd = ctx.createLinearGradient(x,y,x+w, y);
            grd.addColorStop(0,   treeColor1);
            grd.addColorStop(0.5, treeColor1);
            grd.addColorStop(0.5, treeColor2);
            grd.addColorStop(1,   treeColor2);
            ctx.fillStyle = grd;

            ctx.beginPath();
            ctx.moveTo(x, ym);
            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            ctx.closePath();
            ctx.fill();
            ctx.closePath();

          }

          var drawGrass = function(){

            var grassColor1 = newHsl([73,100,31]);
            var grassColor2 = newHsl([91,88,28]);

            var grd = ctx.createLinearGradient(0,clientH,clientW, clientH);
            grd.addColorStop(0,   grassColor1);
            grd.addColorStop(0.2, grassColor1);
            grd.addColorStop(0.2, grassColor2);
            grd.addColorStop(0.4, grassColor2);
            grd.addColorStop(0.4, grassColor1);
            grd.addColorStop(0.6, grassColor1);
            grd.addColorStop(0.6, grassColor2);
            grd.addColorStop(0.8, grassColor2);
            grd.addColorStop(0.8, grassColor1);
            grd.addColorStop(1,   grassColor1);
            ctx.fillStyle = grd;
            ctx.fillRect(0,0.8*clientH,clientW,clientH);  

          }




          var drawMountain = function(origin,pointlist,color,grd){
            ctx.beginPath();
            ctx.moveTo( origin[0]*ratioX, origin[1]*ratioX);
            pointToCurve ( pointlist, ctx, origin );
            ctx.fillStyle = newHsl(color);
            ctx.fill();
            ctx.closePath();
          }

          // var mountainPointList = [[-208, -0.136, -417, -0.27, -625, -0.41],[129, -49, 176, -254, 199, -373],[8, -43, 28, -114, 8.6, -157],[-15, -32, 87, -27, 108, -27],[151, -1.7, 105, 25, 113, 150],[8.8, 142, 48, 347, 198, 406]];
          // var mountain2PointList = [[261, -414, 314, -284, 499, -5],[1650, 1010, 950, 949, 1027, 828, "C"]];
          var mountainPointList = [[281.564,154.934,491.898,-464.683,780.668,-351.729],[92.407,36.146,200.593,182.771,302.029,174.941],[79.417,-6.131,130.682,-118.418,161.708,-178.353],[30.471,-58.864,161.668,-445.174,266.444,-365.052],[177.116,135.44,148.836,439.022,342.954,572.738],[259.823,178.976,426.854,-248.031,513.029,-420.056],[44.414,-88.658,83.796,-201.736,160.517,-268.55],[109.985,-95.784,177.011,136.625,196.923,202.997],[44.459,148.195,114.844,286.124,186.038,422.856],[56.296,108.117,129.719,227.765,136.61,352.724],[11.553,209.492,-242.891,278.663,-407.64,307.345],[-621.545,108.206,-1283.656,67.296,-1910.959,44.309], [-211.044,-7.734-423.448,-13.668-633.771,-33.972],[-473.904,1310.809,-575.698,841.444-431.299,863.852,"C"]];
          // var mountainPointList2 = [[18.243, -259.964, 247.983, -239.695, 434.503, -160.309],[86.994, 37.026, 169.633, 83.528, 250.447, 132.38],[34.741, 21.001, 92.744, 71.529, 137.664, 55.265],[98.092, -35.518, 125.989, -229.236, 175.433, -305.422],[100.195, -154.384, 251.136, -66.4, 346.974, 42.902],[94.077, 107.295, 169.145, 287.849, 304.528, 351.548],[140.108, 65.923, 181.436, -265.017, 207.464, -338.423],[14.869, -41.935, 119.687, -326.905, 178.56, -177.25],[49.126, 124.879, 38.344, 280.829, 34.565, 412.09],[-1.944, 67.524, 27.996, 352.838, -59.334, 353.539],[-348.329, 2.794, -696.658, 5.588, -1044.988, 8.382],[-387.945, 3.112, -775.89, 6.224, -1163.835, 9.336],[189.259,1146.138,231.292,992.199,298.02,867,"C"]];

          // drawMountain([-7,662], mountainPointList,[91,98,16]);
          drawMountain([298.02,867], mountainPointList,[73,98,25]);

          // drawMountain([1998, 810], mountainPointList,[326,28,40]);
          //画山
          // drawMountain([1027, 828], mountain2PointList,[65,70,50]);



          drawRect(1152,740,10,97,14,22,60);//画树杆
          drawRect(1305,762,10,97,14,18,56);
          drawTree(ctx, 1101*ratioX, 568*ratioY, 124*ratioX, 198*ratioY);//画树枝
          drawTree(ctx, 1268*ratioX, 628*ratioY, 94*ratioX, 149*ratioY);

          drawRect(366,313,0,0,35,237,490);//画两栋建筑
          drawRect(705,414,0,0,35,186,386);

          drawWindows(418,365,44,70);//建筑上的窗户
          drawWindows(749,453,33,54);

          drawGrass();

          setTimeout(function(){
            requestAnimationFrame(drawScene);
          },50)
        }

      }

      drawScene();
    }




    cover.addEventListener('mousedown',function(event){
      var x = event.pageX;
      var y = event.pageY;
      var radius = 0;

      (function drawCircle() {
        radius = (radius+1)*1.15;

        ctx.beginPath();
        ctx.arc(event.pageX, event.pageY, radius, 0, 2 * Math.PI);
        ctx.fill();
        if (radius<=clientW) {
          setTimeout(function(){
            requestAnimationFrame(drawCircle);
          },10)
        }else{
          //触发第二幅动画
          playSceneCity();
          // ctx.globalCompositeOperation = 'destination-out';
          // ctx.fillRect(0,0,clientW,clientH);
        }
      })(ctx);

    },false)

  };
  var light = 0;
