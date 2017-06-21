package com.wz.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
/**
 * 安全拦截器
 * @author ‎qss	2017‎年‎6‎月‎19‎日
 *
 */
public class SecurityInterceptor implements HandlerInterceptor {
	 /** 
     * Handler执行完成之后调用这个方法 
     */  
    public void afterCompletion(HttpServletRequest request,  
            HttpServletResponse response, Object handler, Exception exc)  
            throws Exception {  
          
    }  
  
    /** 
     * Handler执行之后，ModelAndView返回之前调用这个方法 
     */  
    public void postHandle(HttpServletRequest request, HttpServletResponse response,  
            Object handler, ModelAndView modelAndView) throws Exception {  
    }  
  
    /** 
     * Handler执行之前调用这个方法 
     */  
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,  
            Object handler) throws Exception {  
    	/*//获取请求的URL  
        String url = request.getRequestURI();  
        //URL:login.jsp是公开的;这个demo是除了login.jsp是可以公开访问的，其它的URL都进行拦截控制  
        if(url.equals("/login")){  
            return true;  
        }  
        //获取Session  
        User user = (User) request.getSession().getAttribute("USER_LOGIN");  
          
        if(user != null && user.getUserLevel().equals((byte)1)){  
        	System.out.println(user);
            return true;  
        }
        
        //不符合条件的，跳转到登录界面  
        response.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter(); 
		out.append("<script>");
		out.append("alert('请先登录！');");
		out.append("top.location.href='"+request.getContextPath()+"/login.jsp'");
		out.append("</script>");
		out.flush();
		out.close();
        return false;  */
    		return true;
    }  

}
