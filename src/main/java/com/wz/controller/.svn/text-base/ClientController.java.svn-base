package com.wz.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wz.model.User;
import com.wz.system.user.service.IUserService;

/**
 * 客户控制层
 * @author	qss ‎2017‎年‎6‎月‎20‎日
 *
 */
@Controller
@RequestMapping
public class ClientController {

	@Resource
	private IUserService service;
	
	@RequestMapping("/init")
	public String init(){
		
		return "client/diyalb";
	}
	
	/**
	 * 用户注册
	 * @param user
	 * @param response 
	 * @throws IOException 
	 */
	@RequestMapping("/register")
	public void register(User user, HttpServletResponse response,HttpServletRequest request) throws IOException {
		user.setUserLevel((byte) 0);
		service.add(user);
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter(); 
		out.append("<script>");
		out.append("alert('注册成功！');");
		out.append("top.location.href='"+request.getContextPath()+"/client/diyalb.jsp'");
		out.append("</script>");
		out.flush();
		out.close();
	}
	
	
	/**
	 * 用户登录
	 * @param user
	 * @return
	 * @throws IOException 
	 */
	@RequestMapping("/client_login")
	public String login(String username, String pwd, HttpServletRequest request){
		User client = service.login(username, pwd,request);
		if (client != null) {
			request.getSession().setAttribute("CLIENT_LOGIN", client);
			return "client/diyalb";
		} else {
			return "redirect:/client_login.jsp";
		}
	}
	
	/**
	 * 注销用户
	 * @param session
	 * @return
	 */
	@RequestMapping("/loginout")
	public String loginout(HttpSession session){
		session.invalidate();	
		return "redirect:/client/diyalb.jsp";
	}
}
