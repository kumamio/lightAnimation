(function () {

    var clientW = window.innerWidth;
    var clientH = window.innerHeight;
    var ratioX =  clientW/2000;
    var ratioY = clientH/1000;

    var cover = document.getElementById("cover");
    cover.width = clientW;
    cover.height = clientH;
    var ctxCover = cover.getContext("2d");

    var curves=document.getElementById("curves");
    var ctxCurves = curves.getContext("2d");
    var ratioCurvesX;
    var ratioCurvesY;

    var city=document.getElementById("scene_city");
    city.width = clientW;
    city.height = clientH;
    var ctx = city.getContext("2d");

    var sky=document.getElementById("sky");
    sky.width = clientW;
    sky.height = clientH;
    var skyctx = sky.getContext("2d");

    var sun=document.getElementById("sun");
    sun.style.width=clientW/12+"px";
    sun.style.height=clientW/12+"px";
    sun.style.top=clientH+"px";

    var radius = 0;

    document.getElementById("body").width=clientW;
    document.getElementById("body").height=clientH;


    var drawCover = function(){

        ctxCover.moveTo(clientW/2,clientH/2);
        ctxCover.beginPath();
        ctxCover.fillStyle = '#444';
        ctxCover.fillRect(0,0,clientW,clientH);
        ctxCover.textAlign="center";

        ctxCover.font=clientW/4+"px Impact";
        ctxCover.textBaseline="middle";
        ctxCover.globalCompositeOperation = 'destination-out';
        ctxCover.shadowColor = "rgba(0,0,0,.5)";
        ctxCover.fillText("color",clientW/2,clientH/2);
        ctxCover.fillStyle = '#000';
        ctxCover.globalCompositeOperation = 'source-over';//amazing!
    }

    var newPointList=[];
    var light = 0;


    //随着light变化生成新的hsl色值
    var newHsl = function(arr) {
      return "hsl("+arr[0]+","+arr[1]+"%,"+parseInt(light/100*arr[2])+"% )"
    }

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

    //点到bezier曲线
    var pointToCurve = function(pointlist,ctx,origin) {
      Array.prototype.map.call(pointlist, function(value,index){
        var innerArr = value.map(function(v,i){
          if ( i<=5 ) {
            return (i % 2 == 0) ? v*ratioX : v*ratioY;
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

    //画曲线并着色
    var drawBezier = function(origin,pointlist,color,ctx){
      ctx.beginPath();
      origin=[origin[0]*ratioX,origin[1]*ratioY];
      ctx.moveTo( origin[0], origin[1]);
      pointToCurve ( pointlist, ctx, origin );
      ctx.fillStyle = newHsl(color);
      ctx.fill();
      ctx.closePath();
    }

    //在canvas上画曲线 
    var drawCurvesCanvas = function (){

      curves.width = clientW;
      curves.height = clientH;

      var cloud1List = [
        [-10.664,-28.993,80.456,-33.713,85.301,-12.137],
        [23.269,-37.083,97.912,-21.576,91.127,5.396],
        [51.375,-14.835,81.429,8.764,62.04,33.039],
        [58.164,4.719,29.08,47.199,12.6,51.244],
        [18.42,39.104,-38.774,44.501,-57.189,36.412],
        [-9.698,38.429,-75.613,22.248,-83.369,2.021],
        [-34.899,41.806,-76.583,9.439,-76.583,-2.021],
        [-52.345,14.158,-76.579,-7.418,-69.798,-23.6],
        [-40.71,-0.675,-47.496,-37.086,-15.506,-47.874],
        [782.5,173.881,834.845,144.888,865.868,159.72,"C"]
      ];
      var hillPoint =[[15.005,-97.645,58.791,-479.283,226.488,-459.352],
        [172.429,20.493,245.204,376.687,276.424,501.857],
        [8.912,35.733,59.175,181.313,12.36,211.131],
        [-33.887,21.583, -98.974, -49.903, -119.613, -68.49],
        [-40.862, -36.796, -81.731,-82.576,-131.848,-106.95],
        [1243.189,1050.899,1142.09,1040.069,1058.141,1011.01,"C"]
      ];
      var mountainList = [
        [-208.333, -0.136, -416.667, -0.271, -625, -0.406],
        [127.564, -48.101, 168.938, -221.672, 192.633, -340],
        [10.055, -50.208, 45.87, -147.215, 13.031, -192.778],
        [-13.643, -18.928, 97.944, -23.932, 109.461, -24.065],
        [30.612, -0.354, 93.267, -7.783, 118.14, 13.297],
        [5.246, 4.445, -2.69, 169.926, 0.4, 196.076],
        [15.294, 129.384, 57.932, 293.831, 192.335, 347.471]
      ];
      drawBezier([1884.5,912.5], mountainList,[326,28,40],ctxCurves);
      drawBezier([1058.141,1011.01], hillPoint,[65,70,50],ctxCurves);
      drawBezier([865.868,159.72], cloud1List,[227,14,55],ctxCurves);
    }

    //画天空背景
    function drawBG(h,s,l){
      sky.style.display = "block";
      skyctx.fillStyle = "hsl("+h+", "+s+"%, "+ l*light/100+ "%)";
      skyctx.fillRect(0,0,clientW,clientH);
    }
    
    //画太阳
    function drawSun(h,s,l){
      sun.style.display= "block";
      sun.style.backgroundColor = "hsl("+h*light/100+", "+s+"%, "+ l+ "%)"
      sun.style.top=clientH*0.8*(1.1-light/100)+"px";
      sun.style.left=clientW*0.5*light/100+"px";
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

    var init = function (){
      // debugger;
      drawCover();

      cover.addEventListener('mousedown',function(event){

        var x = event.pageX;
        var y = event.pageY;

         //点击时画圈
         (function drawCircle() {
            radius = (radius+1)*1.15;
            ctxCover.beginPath();
            ctxCover.arc(event.pageX, event.pageY, radius, 0, 2 * Math.PI);
            ctxCover.fill();
            if (radius<=clientW) {
              setTimeout(function(){
                requestAnimationFrame(drawCircle);
              },10)

            }else{

              //触发第二幅动画
              (function drawScene() {
                document.getElementById("scene_city").style.display="block";
                light=light +1;

                if (light<=100) {
                  drawSun(47,83,60);
                  drawBG(225,97,77);
                  drawCurvesCanvas();//画曲线物体
                  drawRect(1152,740,10,97,14,22,60);//画树杆
                  drawRect(1305,762,10,97,14,18,56);
                  drawTree(ctx, 1101*ratioX, 568*ratioY, 124*ratioX, 198*ratioY);//画树枝
                  drawTree(ctx, 1268*ratioX, 628*ratioY, 94*ratioX, 149*ratioY);
                  drawRect(366,313,0,0,35,237,490);//画两栋建筑
                  drawRect(705,414,0,0,35,186,386);
                  drawWindows(418,365,44,70);//建筑上的窗户
                  drawWindows(749,453,33,54);
                  drawGrass(226,92,80);

                  setTimeout(function(){
                    requestAnimationFrame(drawScene);
                  },50)
                }
              })()

            }
          })();


      },false)

    }

    init();

})()