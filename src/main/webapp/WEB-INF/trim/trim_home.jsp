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
	饰件类别首页：<br>
	<a href="trimType/getInsertData">增加类型</a><br>
	<c:forEach items="${trimTypeList }" var="trimType">
		${trimType.trimtypeId }---${trimType.memo }---
		<a href="trimType/getUpdateData?trimtypeId=${trimType.trimtypeId}&memo=${trimType.memo}">修改</a>
		<a href="trimType/delete?id=${trimType.trimtypeId }">删除</a><br>
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