/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.47
 * Generated at: 2017-06-19 12:02:34 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.sys.trim;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class insert_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");

	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";

      out.write("\r\n");
      out.write("<!DOCTYPE html>\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("<base href=\"");
      out.print(basePath);
      out.write("\">\r\n");
      out.write("<title></title>\r\n");
      out.write("<meta charset=\"UTF-8\">\r\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"Css/bootstrap.css\" />\r\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\"\r\n");
      out.write("\thref=\"Css/bootstrap-responsive.css\" />\r\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"Css/style.css\" />\r\n");
      out.write("<script type=\"text/javascript\" src=\"Js/jquery.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"Js/jquery.sorted.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"Js/bootstrap.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"Js/ckform.js\"></script>\r\n");
      out.write("<script type=\"text/javascript\" src=\"Js/common.js\"></script>\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("<style type=\"text/css\">\r\n");
      out.write("body {\r\n");
      out.write("\tpadding-bottom: 40px;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write(".sidebar-nav {\r\n");
      out.write("\tpadding: 9px 0;\r\n");
      out.write("}\r\n");
      out.write("\r\n");
      out.write("@media ( max-width : 980px) {\r\n");
      out.write("\t/* Enable use of floated navbar text */\r\n");
      out.write("\t.navbar-text.pull-right {\r\n");
      out.write("\t\tfloat: none;\r\n");
      out.write("\t\tpadding-left: 5px;\r\n");
      out.write("\t\tpadding-right: 5px;\r\n");
      out.write("\t}\r\n");
      out.write("}\r\n");
      out.write("</style>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t增加饰件类型：<br>\r\n");
      out.write("\t<form action=\"trim/insert\" method=\"post\">\r\n");
      out.write("\t\t饰件类型：<input type=\"text\" name=\"memo\"/><br>\r\n");
      out.write("\t\t<input type=\"submit\" value=\"提交\"/>\r\n");
      out.write("\t</form>\r\n");
      out.write("</body>\r\n");
      out.write("</html>\r\n");
      out.write("<script>\r\n");
      out.write("    $(function () {       \r\n");
      out.write("\t\t$('#backid').click(function(){\r\n");
      out.write("\t\t\t\twindow.location.href=\"");
      out.print(path);
      out.write("/user/query\";\r\n");
      out.write("\t\t });\r\n");
      out.write("\r\n");
      out.write("    });\r\n");
      out.write("    \r\n");
      out.write("    function validateuserName(userName){\r\n");
      out.write("    \t$.getJSON(\"");
      out.print(path);
      out.write("/user/validate?userName=\" + userName + \"&time=\"\r\n");
      out.write("\t\t\t\t+ new Date(), function(json) {\r\n");
      out.write("\t\t\tif (json.flag == 0) {\r\n");
      out.write("\t\t\t\t$(\"#msg\").css(\"color\", \"red\");\r\n");
      out.write("\t\t\t} else {\r\n");
      out.write("\t\t\t\t$(\"#msg\").css(\"color\", \"blue\");\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\r\n");
      out.write("\t\t\t$(\"#msg\").html(json.msg);\r\n");
      out.write("\t\t})\r\n");
      out.write("\t}\r\n");
      out.write("</script>");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
