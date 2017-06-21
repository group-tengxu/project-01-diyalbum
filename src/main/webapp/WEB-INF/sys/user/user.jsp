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
	<form action="user/save" method="post" class="definewidth m20">
		<table class="table table-bordered table-hover definewidth m10">
			<tr>
				<input type="hidden" name="userId" value="${user.userId }">
				<td width="10%" class="tableleft">用户名</td>
				<td><input type="text" name="userName"
					value="${user.userName }" onkeyup="validateuserName(this.value)" />
					<span id="msg"></span></td>
			</tr>
			<tr>
				<td class="tableleft">密码</td>
				<td><input type="text" name="userPassword"
					value="${user.userPassword }" /></td>
			</tr>
			<tr>
				<td class="tableleft">真实姓名</td>
				<td><input type="text" name="userRealname"
					value="${user.userRealname }" /></td>
			</tr>
			<tr>
				<td class="tableleft">电话</td>
				<td><input type="text" name="userPhone"
					value="${user.userPhone }" /></td>
			</tr>
			<tr>
				<td class="tableleft">微信号</td>
				<td><input type="text" name="userWx" value="${user.userWx }" /></td>
			</tr>
			<tr>
				<td class="tableleft">QQ</td>
				<td><input type="text" name="userQq" value="${user.userQq }" /></td>
			</tr>
			<tr>
				<td class="tableleft">地址</td>
				<td><input type="text" name="userAddress"
					value="${user.userAddress }" /></td>
			</tr>
			<tr>
				<td class="tableleft">PID</td>
				<td><input type="text" name="userPid" value="${user.userPid }" /></td>
			</tr>
			<tr>
				<td class="tableleft">级别</td>
				<td><input type="text" name="userLevel"
					value="${user.userLevel }" /></td>
			</tr>
			<tr>
				<td class="tableleft">IP地址</td>
				<td><input type="text" name="userIp" value="${user.userIp }" /></td>
			</tr>
			<c:if test="${user.userId != null }">
				<tr>
					<td class="tableleft">最后登录时间</td>
					<td><input type="text" name="userdate"
						value="${userdate}"></td>
				</tr>
			</c:if>
			<tr>
				<td class="tableleft"></td>
				<td>
					<button type="submit" class="btn btn-primary" type="button">保存</button>
					&nbsp;&nbsp;
					<button type="button" class="btn btn-success" name="backid"
						id="backid">返回列表</button>
				</td>
			</tr>
		</table>
	</form>
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