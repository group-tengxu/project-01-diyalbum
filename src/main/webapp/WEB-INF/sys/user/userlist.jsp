<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<title></title>
<base href="<%=basePath%>">
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
	<form class="form-inline definewidth m20" action="user/query"
		method="get">
		关键字：
    <input type="text" name="keyword" id="username"class="abc input-default" placeholder="请输入真实姓名关键字" value="${bp.keyword }">&nbsp;&nbsp;  
    <button type="submit" class="btn btn-primary">查询</button>&nbsp;&nbsp; <!-- <button type="button" class="btn btn-success" id="addnew">新增用户</button> -->
	</form>
	<table class="table table-bordered table-hover definewidth m10">
		<thead>
			<tr>
				<th>用户ID</th>
				<th>用户名</th>
				<th>真实姓名</th>
				<th>联系电话</th>
				<th>微信号</th>
				<th>QQ号</th>
				<th>地址</th>
				<th>PID</th>
				<th>级别</th>
				<th>IP地址</th>
				<th>最后登录时间</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${pageModel.list }" var="user">
				<tr>
					<td>${user.userId }</td>
					<td>${user.userName }</td>
					<td>${user.userRealname }</td>
					<td>${user.userPhone }</td>
					<td>${user.userWx }</td>
					<td>${user.userQq }</td>
					<td>${user.userAddress }</td>
					<td>${user.userPid }</td>
					<td>${user.userLevel }</td>
					<td>${user.userIp }</td>
					<td><fmt:formatDate value="${user.userDate }"
							pattern="yyyy-MM-dd HH:mm:ss" /></td>
					<td><a href="user/update?id=${user.userId }">编辑</a>&nbsp;<a
						href="javascript:del(${user.userId })">删除</a></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>

	<form action="user/query" id="pager" method="post">
		<input type="hidden" name="pageNum" id="pageNum"
			value="${pageModel.pageNum }"> <input type="hidden"
			name="pageSize" id="pageSize" value="${pageModel.pageSize }">
	</form>

	<div class="inline pull-right page" style="position:absolute;right:0;bottom:0">
		<%@include file="../../../pageBar.jsp"%>
	</div>
</body>
</html>
<script>
	$(function() {

		$('#addnew').click(function() {

			window.location.href = "user/add";
		});

	});

	function del(id) {

		if (confirm("确定要删除吗？")) {
			var url = "user/delete?id=" + id;
			window.location.href = url;
		}

	}
</script>