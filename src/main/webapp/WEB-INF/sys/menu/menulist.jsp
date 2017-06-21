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
	<form class="form-inline definewidth m20" action="menu/query"
		method="get">
		关键字： <input type="text" name="keyword" id="menuname"
			class="abc input-default" placeholder="请输入菜单名关键字"
			value="${bp.keyword }">&nbsp;&nbsp;
		<button type="submit" class="btn btn-primary">查询</button>
		&nbsp;&nbsp;
		<button type="button" class="btn btn-success" id="addnew">新增菜单</button>
	</form>
	<table class="table table-bordered table-hover definewidth m10">
		<thead>
			<tr>
				<th>菜单ID</th>
				<th>菜单名</th>
				<th>链接地址</th>
				<th>PID</th>
				<th>操作</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${list }" var="big">
				<c:if test="${big.menuPid eq 0}">
					<tr>
						<td>${big.menuId }</td>
						<td>${big.menuName }</td>
						<td>${big.menuLink }</td>
						<td>${big.menuPid }</td>
						<td><a href="menu/update?id=${big.menuId }">编辑</a>&nbsp;<a
							href="javascript:del(${big.menuId })">删除</a></td>
					</tr>
					<c:forEach items="${list }" var="second">
						<c:if test="${second.menuPid eq big.menuId}">
							<tr>
								<td style="padding-left: 30px;">${second.menuId }</td>
								<td style="padding-left: 30px;">${second.menuName }</td>
								<td>${second.menuLink }</td>
								<td>${second.menuPid }</td>
								<td><a href="menu/update?id=${second.menuId }">编辑</a>&nbsp;<a
									href="javascript:del(${second.menuId })">删除</a></td>
							</tr>
							<c:forEach items="${list }" var="third">
								<c:if test="${third.menuPid eq second.menuId}">
									<tr>
										<td style="padding-left: 60px;">${third.menuId }</td>
										<td style="padding-left: 60px;">${third.menuName }</td>
										<td>${third.menuLink }</td>
										<td>${third.menuPid }</td>
										<td><a href="menu/update?id=${third.menuId }">编辑</a>&nbsp;<a
											href="javascript:del(${third.menuId })">删除</a></td>
									</tr>
								</c:if>
							</c:forEach>
						</c:if>
					</c:forEach>
				</c:if>
			</c:forEach>
		</tbody>
	</table>

</body>
</html>
<script>
	$(function() {

		$('#addnew').click(function() {

			window.location.href = "menu/add";
		});

	});

	function del(id) {

		if (confirm("确定要删除吗？")) {
			var url = "menu/delete/" + id;
			window.location.href = url;
		}

	}
</script>