<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<base href="<%=basePath%>">
<meta charset="utf-8">
<link rel="stylesheet" href="Css/diyalb.css">
<title>DIYALB</title>
<script src="assets/jquery.js"></script>
</head>
<body>
	<div class="wrap">
		<header>
			<div>
				<h1 class="logo">公司信息/ logo</h1>
			</div>

			<div class="pre_next">
				<span class="pre"> <i></i> 撤销
				</span> <span class="next"> 前进 <i></i>
				</span>
			</div>

			<div class="clear">
				<button class="clear_all">全部清空</button>
				<button class="clear_currentpage">清空当前页面</button>
			</div>

			<div class="person">
				<span>登录</span> <span>注册</span> <span>分享</span>
			</div>

		</header>

		<main>
		<div class="main_l">
			<div class="client_info">
				<h4>客户信息</h4>
			</div>
			<div class="stylemodel">
				<h4>尺寸、风格、模板选择区域</h4>
			</div>
			<div class="modifyarea">
				<h4>相册页面美化功能区（饰件、文字、画笔）</h4>
			</div>
		</div>

		<div class="main_m">
			<div class="alb_edit">
				<!--<h6>相册编辑区</h6>-->
				<canvas id="canvas" width="1080" height="560"></canvas>
				<span class="alb_edit_pre"> <img src="img/pre.png" alt="">
				</span> <span class="alb_edit_nxt"> <img src="img/nxt.png" alt="">
				</span>
			</div>

			<div class="pre_view">
				<!--<h6>相册页面预览区</h6>-->
				<span class="pre_view_pre"> < </span> <span class="pre_view_nxt">
					> </span>
			</div>
		</div>

		<div class="main_r">
			<div class="pic_upload">
				<div class="local_upload">
					<!--<form name="form" action="javascript:;" method="post" enctype="multipart/form-data">
                            <input type="file" name="picpath" id="picpath"style="display: none;"
                                onchange="document.form.path.value=this.value" multiple="multiple" accept="image/*" />
                            <input name="path" readonly style="display:none;">
                            <input type="button" value="上传照片" onclick="document.form.picpath.click()">
                        </form>                       -->
					<span id="upload">上传图片</span>
					<!--<button>上传图片</button>-->
				</div>

				<div class="web_upload">
					<form action="">
						<input type="text" placeholder="网络传图">
					</form>
				</div>
			</div>

			<div class="drag_upload">照片上传区</div>
		</div>
		</main>

		<footer>
			<div class="adarea">广告位区域</div>

			<div class="contact footer_func">联系客服</div>

			<div class="save footer_func">
				<button>保存进度</button>
			</div>

			<div class="submitdone footer_func">
				<button>提交完成</button>
			</div>
		</footer>
	</div>
	<script src="js/diyalb.js"></script>
	<script>
		// var canvas = document.getElementById('canvas');
		// var ctx = canvas.getContext('2d');

		// ctx.fillStyle = "#f00";
		// ctx.fillRect(0,0,100,100);
	</script>
</body>
</html>