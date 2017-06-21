<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>注册</title>
</head>
<style>
div {
	border: 1px solid blue;
	height: 745px;
	margin: 0 auto;
}

.text {
	background: #E4F1FA;
	width: 200px;
	text-align: right;
}

.input {
	text-align: left;
}

.span2 {
	color: #666;
	margin-left: 30px;
}

table, tr, th {
	border: 1px solid blue;
	border-collapse: collapse;
	height: 60px;
	width: 900px;
	margin: 0 auto;
}
</style>

<form action="register" onsubmit="return check()" method="post">
	<div>
		<p align="center" style="font-size: 20px; font-weight: bold;">请填写注册信息</p>
		<table>
			<caption style="color: red; text-align: left; font-weight: bold;">必须按照要求填写</caption>
			<tr>
				<th class="text"><span>&nbsp;用户名：</span></th>
				<th class="input"><input type="text" name="userName" id="user"
					onBlur="checkUserName()" /><span id="users" class="span2">必须是英文字母或数字，长度3-15</span></th>
			</tr>
			<tr>
				<th class="text"><span>&nbsp;密&nbsp;码：</span></th>
				<th class="input"><input type="password" name="userPassword"
					id="psw1" onBlur="checkPwd(),checkConfirmPwd()" /><span id="psw1s"
					class="span2">长度3-15</span></th>
			</tr>
			<tr>
				<th class="text"><span>确认密码：</span></th>
				<th class="input"><input type="password" name="password"
					id="psw2" onBlur="checkConfirmPwd()" /><span id="psw2s"
					class="span2">与密码框的内容相同</span></th>
			</tr>
			<tr>
				<th class="text"><span>真实姓名：</span></th>
				<th class="input"><input type="text" name="userRealname"
					id="name" onBlur="checkRealName()" /><span id="names"
					class="span2">中文，2-10个字符</span></th>
			</tr>
			<tr>
				<th class="text"><span>电话号码：</span></th>
				<th class="input"><input type="text" name="userPhone"
					id="phonenumber" onBlur="checkPhone()" /><span id="phonenumbers"
					class="span2">必须是正常号码11位数字</span></th>
			</tr>
			<tr>
				<th class="text"><span>&nbsp;地&nbsp;址：</span></th>
				<th class="input"><input type="text" name="userAddress"
					id="address" onBlur="checkAddress()" /><span id="addresss"
					class="span2">长度不能大于30(中文)</span></th>
			</tr>
		</table>
		<span style="margin-left: 50%;"> <input
			style="margin-right: 20px;" type="submit" value="提交" id="submit" /><input
			type="reset" value="重置" id="reset" /></span>
	</div>
</form>



<script>
	function $(id) {
		return document.getElementById(id);
	}

	function checkUserName() {
		var id = "user"
		var val = $(id).value;
		var ids = $(id + "s");
		var patt = /^[a-zA-Z0-9]{3,15}$/;
		if (patt.test(val)) {
			ids.style.color = "green";
			return true;
		} else {
			ids.style.color = "red";
			return false;
		}
	}
	function checkPwd() {
		var id = "psw1";
		var val = $(id).value;
		var ids = $(id + "s");
		var patt = /^.{3,15}$/;
		if (patt.test(val)) {
			ids.style.color = "green";
			return true;
		} else {
			ids.style.color = "red";
			return false;
		}
	}
	function checkConfirmPwd() {
		id = "psw2";
		var val = $(id).value;
		var psw = $("psw1").value;
		var ids = $(id + "s");
		if (psw == val) {
			ids.style.color = "green";
			return true;
		} else {
			ids.style.color = "red";
			return false;
		}
	}
	function checkSex() {
		var ids = $("sexs");
		ids.style.color = "green";
		return true;
	}

	function checkRealName() {
		id = "name";
		var val = $(id).value;
		var ids = $(id + "s");
		var patt = /^[\u4e00-\u9fa5]{2,10}$/;
		if (patt.test(val)) {
			ids.style.color = "green";
			return true;

		} else {
			ids.style.color = "red";
			return false;
		}
	}
	function checkPhone() {
		id = "phonenumber";
		var val = $(id).value;
		var ids = $(id + "s");
		var patt = /^1[3|4|5|7|8]\d{9}$/;
		if (patt.test(val)) {
			ids.style.color = "green";
			return true;
		} else {
			ids.style.color = "red";
			return false;
		}
	}
	function checkAddress() {
		id = "address";
		var val = $(id).value;
		var ids = $(id + "s");
		var patt = /^[\u4e00-\u9fa5]{1,30}$/;
		if (patt.test(val)) {
			ids.style.color = "green";
			return true;
		} else {
			ids.style.color = "red";
			return false;
		}
	}
	//提交检测
	function check() {
		if (checkUserName() && checkPwd() && checkConfirmPwd()
				&& checkRealName() && checkPhone() && checkAddress()) {
			return true;
		} else {
			alert("填写的信息有误！！");
			return false;

		}
	}
</script>
<body>

</body>
</html>