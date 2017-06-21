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
	<form action="menu/save" method="post" class="definewidth m20">
		<table class="table table-bordered table-hover definewidth m10">
			<tr>
				<input type="hidden" name="menuId" value="${menu.menuId }">
				<td width="10%" class="tableleft">菜单名</td>
				<td><input type="text" name="menuName"
					value="${menu.menuName }" onkeyup="validatemenuName(this.value)" />
					<span id="msg"></span></td>
			</tr>
			<tr>
				<td class="tableleft">链接地址</td>
				<td><input type="text" name="menuLink"
					value="${menu.menuLink }" /></td>
			</tr>
			<tr>
				<td width="10%" class="tableleft">类别</td>
				<td>
					<select name="menuPid">
						<option value="0">本身就是父类</option>
						<c:forEach items="${menus }" var="m">
							<option value="${m.menuId }" ${m.menuId eq menu.menuPid?'selected':'' }>${m.menuName }</option>
						</c:forEach>
					</select>
				</td>
			</tr>
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
				window.location.href="<%=path%>/menu/query";
		 });

    });
    
    function validatemenuName(menuName){
    	$.getJSON("<%=path%>/menu/validate?menuName=" + menuName + "&time="
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