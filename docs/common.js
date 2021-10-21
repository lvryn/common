var menuList = []; //导航数据
var portalAppMarkets = []; //首页应用数据

  var baseUrl = "http://localhost:8086";
  // var baseUrl = "http://test2.360xkw.com:8082";

//  var baseUrl = "http://localhost:8080";
// var baseUrl = "http://test2.360xkw.com:8082";

  // var baseUrl = "http://localhost:8011";
//var baseUrl = "http://test2.360xkw.com:8082";

//var baseUrl = "http://sr.360xkw.com";
//var imgBaseUrl = "http://img.360xkw.com/";
var imgBaseUrl = "";
var videoBaseUrl = "http://s1.v.360xkw.com";
var gxDomain ='test2.360xkw.com'
// var gxDomain ='test4.360xkw.com'
//  baseUrl = "http://" + gxDomain;
var localGxInfo = null;
var currentPage = window.location.pathname.split("/")[3]
var hasVisitorModel
var allCourses = []
var pickInfo
var allkmData = []
var defaultCourseId = {
    // id ： 二级专业的id
    // type ： 一级的id
};
var isJpClass
var isZk
var pickCourses
$(function () {
  // getmenulist();
  navBox();
  getGxInfo();
  if(localStorage.getItem("userInfo") == "{}" && hasVisitorModel == 1 && currentPage != "index.html"){
    window.location.href = "index.html";
  }
  if(currentPage != "index.html"){
    WebSocketTest()
    allCategories()
    headerBox();
    footerBox();
    judgeZkStudent()
  }

});
//获取高校信息
function getGxInfo() {
  $.ajax({
    type: "GET",
    url: baseUrl + "/gxplatform/front/gx/getGxInfoByGxDomainNoLogin.do",
    data: {
      gxDomain: gxDomain,
    },
    dataType: "json",
    async: false,
    success: function (res) {
      if (res.code == 1) {
        layui.data("gxInfo", {
          key: "data",
          value: res.data,
        });
        hasVisitorModel = res.data.hasVisitorModel
        dlId=res.data.id
        if (res.data.id == 2180) {
          var logoUrl = res.data.logo != "" ? imgBaseUrl + res.data.logo : "";
          // 登录界面的logo
          $("#isHidden").css("display", "none");
          // $("#isShow").attr("src", logoUrl);
          // pageA、pageB的切换
          $(".pageA").css("display", "block");
          $(".pageB").css("display", "none");
        } else {
          
          var logoUrl = res.data.logo != "" ? imgBaseUrl + res.data.logo : "";
          var backgroundImg = res.data.backgroundImg
          $(".pageB").css("display", "block");
          $(".pageA").css("display", "none");
          $(".login_wrapB").css("background","url("+ backgroundImg + ") no-repeat center top")
          $("#isShow").css("display", "none");
          // $("#isHidden").attr("src", logoUrl);
          $(".login_address").css("display", "none");
        }

        localGxInfo = res.data;
        var logoUrl = res.data.logo != "" ? imgBaseUrl + res.data.logo : "";
        $(".logo_img").attr("src", logoUrl);
        if (res.data.backgroundImg != "") {
          $(".login_wrap").css(
            "background",
            'url(' + imgBaseUrl + res.data.backgroundImg + ') no-repeat center top'
          );
        }
        var branchs = JSON.parse(localStorage.getItem("gxInfo")).data.branchs
        var data = JSON.parse(localStorage.getItem("gxInfo")).data
        if(data.logo != ""){
            imgurl = data.logo ;
            $("#isShow > img").attr("src",imgurl)
            $("#isHidden > img").attr("src",imgurl)
        }else{
            $("#isShow").css("display", "none")
            $("#isHidden").css("display", "none")
        }

        if(branchs != "" && branchs.length > 0){
            var temp_addr = branchs[0].addr != "" ? "地址：" + branchs[0].addr  : "";
            var address = branchs[0].title +"&nbsp;&nbsp;&nbsp;&nbsp;"+ temp_addr +"&nbsp;&nbsp;"+ branchs[0].phone1 +"&nbsp;&nbsp;"+ branchs[0].phone2
            $(".addressA").html(address)
        } 
      }
    },
  });
}



//获取用户信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: baseUrl + "/gxplatform/front/user/getUserInfo.do",
    data: {},
    dataType: "json",
    async: false,
    success: function (res) {
      if (res.code == 1) {
        layui.data("userInfo", {
          key: "data",
          value: res.data,
        });
      } else if (res.code == 1001) {
        window.location.href = "index.html";
      }
    },
  });
}
//列表时间字符串截取
template.helper("format", function (date, format) {
  // 对传入的data进行处理再 return 出去
  return date.substring(0, 19);
});
//详情页类别字符串截取
template.helper("getType", function (title) {
  // 对传入的title进行处理再 return 出去
  return title.substring(3);
});

layui.use(["element", "laydate", "laypage", "layer", "form"], function () {
  var $ = layui.jquery,
     element = layui.element;
    (laydate = layui.laydate),
    (laypage = layui.laypage),
    (form = layui.form),
    (layer = layui.layer);
  element.init();
  //监听折叠
  element.on("collapse(test)", function (data) {
    layer.msg("展开状态：" + data.show);
  });
});

var userInfo = layui.data('userInfo').data;
var uId = location.search;

//头部模版
function headerBox() {
  var defaultCourseId = JSON.parse(localStorage.getItem("defaultCourseId"))
  hasVisitorModel = JSON.parse(localStorage.getItem("gxInfo")).data.hasVisitorModel
  // pickCourses 如果用户一门专业都没开通的话 pickCourses = undefined
  
  // var userInfo = layui.data('userInfo').data;
  if(pickCourses == undefined){
    var headerBox = {
      isAdmin: true,
      coursesList: '',
      allCoursesList :allCourses,
    }
  }else{
    if(defaultCourseId == null){
      window.location.href = "index.html";
    }else if(defaultCourseId.type == 491 ){
      certificateKmData(defaultCourseId.id)
    }else{
      kmData(defaultCourseId.id)
    }

    if(localStorage.getItem("userInfo") == "{}" || localStorage.getItem("userInfo") == null){
      // 游客进入 默认显示第一个
      var headerBox = {
        isAdmin: true,
        coursesList: '',
        allCoursesList :allCourses,
        activeId: defaultCourseId.id
      }
    }else{
      var coursesList = userInfo.courses
      for(var i= 0;i<coursesList.length;i++){
        if(coursesList[i].id == userInfo.defaultCourseId){
          pickInfo = coursesList[i]
        }
      }
      var headerBox = {
        isAdmin: true,
        coursesList: coursesList,
        allCoursesList :allCourses,
        activeId: defaultCourseId.id
      };
    }
  }
  
  var html = $.get("components/header.html", function (data) {
    var render = template.compile(data);
    var str = render(headerBox);
    $(".headerTpl").html(str);
  });
  
}

// 头部退出按钮
function headerOut(){
  //注意：导航 依赖 element 模块，否则无法进行功能性操作
  layui.use([ 'layer','element'], function(){
    var $ = layui.jquery,
    layer = layui.layer,
    element = layui.element;
    element.init();
    $('.logout').click(function(){
      if(localStorage.getItem("userInfo") == "{}" || localStorage.getItem("userInfo") == null){
        localStorage.setItem('isLogin',1);
        window.location.href='index.html';
      }else{
        $.ajax({
          type : 'GET',
          url : '/gxplatform/front/user/logOut',
          data:{},
          dataType : 'json',
          async : false,
          success : function(res) {
            if(res.code == 1){
                if(hasVisitorModel == 0){
                  layui.data('userInfo',null); //删除userInfo
                  layui.data('defaultCourseId',null); //删除userInfo
                  localStorage.setItem("isLogin",1) //本地存个 判断是否从游客跳转至登录的数据 1是
                  window.location.href = "index.html";
                }else{
                  layui.data('userInfo', {
                    key: 'data'
                    ,remove: true
                  });
                  layui.data('userInfo',null); //删除userInfo
                  layui.data('isLogin',null); //删除userInfo
                  layui.data('defaultCourseId',null); //删除userInfo
                  localStorage.removeItem("userLogin")
                  window.location.href = "index.html";
                  layer.alert(res.message);
                }
                
            }else if(res.code==0){
                layer.alert(res.message);
            }
          }
        })
      }   
    })
  })
}

//底部模版
function footerBox() {
  var footerBox = {
    isAdmin: true,
    infoList:[]
  };
  footerBox.infoList= JSON.parse(localStorage.getItem("gxInfo")).data.branchs;
  var html = $.get("components/footer.html", function (data) {
    var render = template.compile(data);
    var str = render(footerBox);
    $(".footerTpl").html(str);
  });
}
//导航菜单模版
function navBox() {
  var navBox = {
    isAdmin: true,
    menuList: menuList,
  };
  var html = $.get("components/nav.html", function (data) {
    var render = template.compile(data);
    var str = render(navBox);
    $(".navTpl").html(str);
  });
}

// 获取资格证科目
function kmData(CourseId){
  var subId_record
  var courseid =CourseId
  if(getQueryString("subCourseId") != null){
    subId_record = getQueryString("subCourseId")
  }
  if(getQueryString("courseid") != null){
    courseid = getQueryString("courseid")
  }else{
    if (uId != "") {
      var arrCourseId = uId.slice(1, uId.length).split("&");
      var urlDta = {}
      arrCourseId.forEach(function (val) {
        var arr1 = val.split("=");
        urlDta[arr1[0]] = arr1[1];
      });
      courseid = urlDta.id
    } 
  }
  if(currentPage != "rebackVideo.html"){
    $.ajax({
      type: "get",
      url: baseUrl + "/gxplatform/app/projectSeparate/getThreeGxCourseNoLogin.do",
      dataType: "json",
      data:{
        id:courseid
      },
      async: false,
      success: function (res) {
        if(res.code == 1){
          allkmData = res.data
        }
      },
    });
  }else{
    rebackVideoKm()
  }
  
}

function rebackVideoKm(){
  var defaultCourseId = JSON.parse(localStorage.getItem("defaultCourseId"))
  var dlId = JSON.parse(localStorage.getItem("gxInfo")).data.id
  $.ajax({
    type: "GET",
    url: "/gxplatform/front/tk/getAppMyItemList.do",
    data: {
      dlId : dlId
    },
    async: false,
    success: function (res) {
      console.log(res,'获取rebackVideoKm科目')
      if(res.code == "1"){
        // if(Number(defaultCourseId.type) == res.data[0].pCourseId){
        //   console.log(res.data[0].subCourseList,999999999999999)
        //   allkmData = res.data[0].subCourseList
        // }else{
          // for(var i = 0; i < res.data.length; i++){
          //   console.log(Number(defaultCourseId.id),'Number(defaultCourseId.id)')
          //   console.log(res.data[i].courseId,'res.data[i].majorId')
            
          //   if(res.data[i].majorId ==  Number(defaultCourseId.id)){
          //     allkmData = res.data[i].subCourseList
          //     return
          //   }
          //   if(res.data[i].courseId  ==  Number(defaultCourseId.id)){
          //     allkmData = res.data[i].subCourseList
          //     return
          //   }
          // }
        // }
        for(var i = 0; i < res.data.length; i++){
          if(res.data[i].subCourseId ==  subId){
            allkmData = res.data[i].subCourseList
            return
          }
        }

      }
    }
  });
}

// 获取自考科目
function certificateKmData(CourseId){
  var dlId = JSON.parse(localStorage.getItem("gxInfo")).data.id
  var subId_record
  var courseid
  var defaultCourseId = JSON.parse(localStorage.getItem("defaultCourseId"))
  if(getQueryString("subCourseId") != null){
    subId_record = getQueryString("subCourseId")
  }
  if(getQueryString("courseid") != null){
    courseid = getQueryString("courseid")
    defaultCourseId.id = courseid
  }else{
    if (uId != "") {
      var arrCourseId = uId.slice(1, uId.length).split("&");
      var urlDta = {}
      arrCourseId.forEach(function (val) {
        var arr1 = val.split("=");
        urlDta[arr1[0]] =arr1[1];
      });
      if(urlDta.id == null){
        defaultCourseId.id = allCourses[0].childrens[0].id
      }else{
        defaultCourseId.id = urlDta.id
      }
    } 
  }
  if(currentPage != "rebackVideo.html"){ // 判断哪个播放页面 获取科目
    $.ajax({
      type: "get",
      url: baseUrl + "/gxplatform/app/projectSeparate/getThreeGxCourseByMajorIdNoLogin.do",
      dataType: "json",
      data:{
        dlId:dlId,
        majorId:defaultCourseId.id,
      },
      async: false,
      success: function (res) {
        if(res.code == 1){
          allkmData = res.data
        }else{
          allkmData = []
        }
      },
    });
  }else{
    rebackVideoKm()
  }
  
}

// 全部分类
function allCategories(){
  var dlId = JSON.parse(localStorage.getItem("gxInfo")).data.id
  var onlevel;
  $.ajax({
      type: "get",
      url: baseUrl + "/gxplatform/app/projectSeparate/getGxCourseIndexToPCNoLogin.do",
      dataType: "json",
      data:{
        dlId:dlId,
      },
      async: false,
      success: function (res) {
        if(res.code == 1 && res.data.length > 0){
          allCourses = res.data
          var secondary //二级数组
          var threeLevel
          var defaultCourseId = {}
          // 游客模式 并且首次进入 defaultCourseId未空的时候
          if(localStorage.getItem("userInfo") == "{}" && JSON.parse(localStorage.getItem("defaultCourseId")) == null){
            defaultCourseId.id = allCourses[0].childrens[0].id
            defaultCourseId.type = allCourses[0].id
            localStorage.setItem("defaultCourseId",JSON.stringify(defaultCourseId))
          }else{
            if(uId == '' && localStorage.getItem("userInfo") != "{}"){ // 用户登录后的初始页面 判断defaultCourseId数据
              if(userInfo.defaultCourseId == 491){
                if(userInfo.majorId == "" || userInfo.majorId == null || userInfo.majorId == undefined){
                  // 默认是491 但是没有majorId 说明默认专业过期了
                  for(var i=0;i<allCourses.length;i++){
                    if(userInfo.defaultCourseId == allCourses[i].id ){
                      defaultCourseId.id = allCourses[i].childrens[0].id
                      defaultCourseId.type = allCourses[i].id
                    }
                  }
                }else{
                  var typeCourse
                  var defaultCourseId = {}
                  // 先从全部分类里取一级数据
                  for(var i=0;i<allCourses.length;i++){
                    if(userInfo.defaultCourseId == allCourses[i].id ){
                      typeCourse = allCourses[i]
                    }
                  }
                  // 默认专业是自考 但是没有自考一级数据的情况
                  if(typeCourse == undefined){
                    typeCourse = allCourses[0]
                    defaultCourseId.id = typeCourse.childrens[0].id
                    defaultCourseId.type = typeCourse.id
                  }
                  // 再从一级数据下边的childrens里取各个专业数据 如果存在默认专业则defaultCourseId为默认专业 否则为一级数据的第一个专业
                  for(var j=0;j<typeCourse.childrens.length;j++){
                    if(userInfo.majorId == typeCourse.childrens[j].id ){
                      defaultCourseId.id = typeCourse.childrens[j].id
                      defaultCourseId.type = typeCourse.id
                      break
                    }else{
                      defaultCourseId.id = typeCourse.childrens[0].id
                      defaultCourseId.type = typeCourse.id
                    }
                  }
  
                }
              }else{
                var defaultCourseId = {}
                var morenData
                for(var i=0;i<allCourses.length;i++){
                  for(var j=0;j<allCourses[i].childrens.length;j++){
                    if(defaultCourseId != null && userInfo.defaultCourseId == allCourses[i].childrens[j].id){
                      defaultCourseId.id = allCourses[i].childrens[j].id
                      defaultCourseId.type = allCourses[i].id
                      morenData = allCourses[i]
                      break
                    }
                  }
                  if(morenData == undefined){
                    // 除了自考外 资格证或试岗培训 默认defaultCourseId 不在全部分类数据里的情况
                    defaultCourseId.id = allCourses[i].childrens[0].id
                    defaultCourseId.type = allCourses[i].id
                    break
                  }else{
                    defaultCourseId.id = allCourses[i].childrens[0].id
                    defaultCourseId.type = allCourses[i].id
                  }

                }
              }
              localStorage.setItem("defaultCourseId",JSON.stringify(defaultCourseId))
            }else{
              if(currentPage != "rebackVideo.html"){ // 如果不是rebackVideo.html页面 defaultCourseId从本地取
                defaultCourseId = JSON.parse(localStorage.getItem("defaultCourseId"))
              }else{ // 如果是rebackVideo.html页面
                defaultCourseId.type = getQueryString("type")
                defaultCourseId.id = getQueryString("id")
              }
              localStorage.setItem("defaultCourseId",JSON.stringify(defaultCourseId))
              defaultCourseId = JSON.parse(localStorage.getItem("defaultCourseId"))
            }
          }
          // 根据当前的defaultCourseId 的一级数据id 取出一级数据的childrens
          for(var i=0;i<allCourses.length;i++){
            if (allCourses[i].id == defaultCourseId.type) {
              secondary = allCourses[i].childrens
            }
          }
          // 如果当前选中的一级数据为空 则defaultCourseId全部分类的第一个专业
          if(secondary == undefined){
            secondary = allCourses[0].childrens
            defaultCourseId.id = secondary[0].id
            defaultCourseId.type = allCourses[0].id
          }
          // threeLevel是取出选中的单个专业的数据
          for(var j=0;j<secondary.length;j++){
            if (secondary[j].id == defaultCourseId.id) {
              threeLevel = secondary[j]
            }
          }
          
          pickCourses = threeLevel

          if(pickCourses == undefined){
            pickCourses = allCourses[0].childrens[0]
          }
          localStorage.setItem("pickItem",JSON.stringify(pickCourses))
        }else{

        }
      },
  });
}

function WebSocketTest(){
  if ("WebSocket" in window){
    // alert("您的浏览器支持 WebSocket!");

    // 打开一个 web socket
    //var temp_addr = baseUrl == "http://test2.360xkw.com:8082" ? "test2.360xkw.com:8082" : document.domain;
    var temp_addr = baseUrl == "http://test2.360xkw.com:8082" ? "test2.360xkw.com:8082" : "localhost:8011";
    var ws = new WebSocket('ws://'+ temp_addr +'/gxplatform/websocket.do')

    ws.onopen = function()
    {
        // Web Socket 已连接上，使用 send() 方法发送数据
        ws.send("发送数据");
        console.log("数据发送中...111");
    };

    ws.onmessage = function (evt)
    {
        var received_msg = evt.data;
        console.log("数据已接收...",evt);
        var video = document.getElementById("live_video")
        if(video){
          video.pause()
        }
        layer.alert(received_msg, {
            skin: 'layui-layer-molv', //样式类名
            closeBtn: 0
        }, function(index){
          localStorage.clear();
          if(hasVisitorModel == 0){
            // localStorage.setItem('userInfo',null); //删除userInfo
            // localStorage.setItem('defaultCourseId',null); //删除userInfo
            localStorage.setItem("isLogin",1) //本地存个 判断是否从游客跳转至登录的数据 1是
          }else{
            // localStorage.setItem('userInfo',null); //删除userInfo
            // localStorage.setItem('defaultCourseId',null); //删除userInfo
            localStorage.setItem('isLogin',null); //删除userInfo
          }
          localStorage.removeItem("userLogin")
          sessionStorage.clear()
          window.location.href = "index.html";
          layer.close(index);
        });
    };

    ws.onclose = function()
    {
        // 关闭 websocket
        // console.log("连接已关闭...");
    };
  }else{
    // 浏览器不支持 WebSocket
    // console.log("您的浏览器不支持 WebSocket!");
  }
}

//获取路由参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return unescape(r[2]);
  };
  return null;
}


// 是否有自考学生
function judgeZkStudent() {
  var dlId = JSON.parse(localStorage.getItem("gxInfo")).data.id;
  $.ajax({
      type: "GET",
      url: "/gxplatform/manager/gxstudent/judgeZkStudent.do",
      data: {dlId:dlId},
      success: function (res) {
        isJpClass = res.data
        localStorage.setItem("isJpClass",JSON.stringify(isJpClass))
      }
  });
}
