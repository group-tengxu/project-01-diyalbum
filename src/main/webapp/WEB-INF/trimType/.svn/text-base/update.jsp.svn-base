<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html>
<head>
<base href="<%=basePath%>">
<title></title>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="Css/bootstrap.css" />
<link rel="stylesheet" type="text/css"
	href="Css/bootstrap-responsive.css" />
<link rel="stylesheet" type="text/css" href="Css/style.css" />
<script type="text/javascript" src="Js/jquery.js"></script>
<script type="text/javascript" src="Js/jquery.sorted.js"></script>
<script type="text/javascript" src="Js/bootstrap.js"></script>
<script type="text/javascript" src="Js/ckform.js"></script>
<script type="text/javascript" src="Js/common.js"></script>



<style type="text/css">
body {
	padding-bottom: 40px;
}

.sidebar-nav {
	padding: 9px 0;
}

@media ( max-width : 980px) {
	/* Enable use of floated navbar text */
	.navbar-text.pull-right {
		float: none;
		padding-left: 5px;
		padding-right: 5px;
	}
}
</style>
</head>
<body>
	修改饰件类型：<br>
	<form action="trimType/update" method="post">
		<input type="hidden" name="trimtypeId" value="${trimType.trimtypeId }">
		饰件类型：${trimType.memo }<a href="...">修改</a><br>
		
	</form><br>
	<a href="trim/getInsertData?trimType=${trimType.trimtypeId }">添加饰件</a><br>
	id---所属类别---饰件名称---操作<br>
	<c:forEach items="${trimlist }" var="trim">
		${trim.trimId }---${trim.trimType }---${trim.trimName }---<a href="...">替换</a><a href="...">删除</a><br>
	</c:forEach>
</body>
</html>
<script>
    $(function () {       
		$('#backid').click(function(){
				window.location.href="<%=path%>/user/query";
		 });

    });
    
    function validateuserName(userName){
    	$.getJSON("<%=path%>/user/validate?userName=" + userName + "&time="
				+ new Date(), function(json) {
			if (json.flag == 0) {
				$("#msg").css("color", "red");
			} else {
				$("#msg").css("color", "blue");
			}

			$("#msg").html(json.msg);
		})
	}
</script>