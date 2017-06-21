<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html lang="en">
<head>
<base href="<%=basePath%>">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<link rel="stylesheet" href="Css/person.css">
<title>个人中心</title>
<script src="assets/jquery.js"></script>
<script src="Js/person.js"></script>
</head>
<body>
	<div class="wrap">
		<header>
			<div>
				<h1 class="logo">公司信息/ logo</h1>
			</div>
			<div>
				<a href="./DIYALB.html" class="toIndex">首页</a>
			</div>
		</header>
		<main>
		<div class="main-l">
			<ul class="infoList">
				<li>个人信息</li>
				<li>修改密码</li>
				<li>相册信息</li>
			</ul>
		</div>
		<div class="main-r">
			<div class="personInfo">
				<h1>个人信息</h1>
				<p>
					账号：<span class="user_name"></span>
				</p>
				<p>
					电话：<span class="user_phone"></span>
				</p>
				<p>
					微信：<span class="user_wx"></span>
				</p>
				<p>
					QQ：<span class="user_qq"></span>
				</p>
				<p>
					姓名：<span class="user_realname"></span>
				</p>
				<p>
					地址：<span class="user_address"></span>
				</p>
				<p>
					级别：<span class="user_level"></span>
				</p>
			</div>
			<div class="changePassword">
				<h1>修改密码</h1>
				<p>
					旧密码：<input type="text" class="oldPassword">
				</p>
				<p>
					新密码：<input type="text" class="newPassword">
				</p>
				<p>
					确认密码：<input type="text" class="confirmPassword">
				</p>
			</div>
			<div class="photoInfo">
				<h1>相册信息</h1>
			</div>
		</div>
		</main>
	</div>
</body>
</html>