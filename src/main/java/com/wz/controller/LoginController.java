package com.wz.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wz.model.User;
import com.wz.photoutil.Util;
import com.wz.system.user.service.IUserService;

/**
 * 登录
 * 
 * @author ‎qss 2017‎年‎6‎月‎19‎日
 */
@Controller
public class LoginController {

	@Resource
	private IUserService service;

	@RequestMapping("/login")
	public String login(String username, String pwd, HttpServletRequest request) {
		// User user = service.login(username, pwd,request);
		//
		// if (user != null && user.getUserLevel().equals((byte) 1)) {
		// request.getSession().setAttribute("USER_LOGIN", user);
		// return "home";
		// } else {
		// request.setAttribute("msg", "用户名有误,管理员登录！！");
		// return "forward:/login.jsp";
		// }
		User user = null;
		if (!"".equals(username) && username != null) {
			try {
				user = service.login(username, pwd, request);
				if (user.getUserLevel().equals((byte) 1)) {
					 request.getSession().setAttribute("USER_LOGIN", user);
					 return "home";
				}
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				request.setAttribute("msg", e.getMessage());
				return "forward:/login.jsp";
			}
		}
		request.setAttribute("msg", "用户名有误,管理员登录！！");
		return "forward:/login.jsp";
	}

	@RequestMapping("/logout")
	public String logout(HttpServletRequest request) {
		HttpSession session = request.getSession();
		session.invalidate();
		return "forward:/login.jsp";

	}
}
