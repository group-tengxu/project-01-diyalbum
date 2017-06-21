package com.wz.photoutil;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

/**
 * 工具类
 * @author 2017
 *
 */
public class Util {
	/**
	 * 将系统时间转换为以yyyy-MM-dd HH:mm:ss格式的字符串
	 * @param date
	 * @return
	 */
	public static String getStringDate(Date date){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    String now= sdf.format(date);
		return now;
	}
	
	/**
	 * 将字符串以yyyy-MM-dd HH:mm:ss格式转换为系统时间
	 * @param dates
	 * @return
	 * @throws ParseException
	 */
	public static Date getDate(String dates) throws ParseException{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		return sdf.parse(dates);
	}
	
	private static long workidkey=0;
    private static long filekey=0;
    /**
     * 订单号
     * @return
     */
	public synchronized static String getWorkid(){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddHHmm");
	    String now= sdf.format(new Date());
	    workidkey++;
		return now+workidkey;
	}
	/**
	 * 文件上传新名（防止文件名相同） 
	 * @return
	 */
	public synchronized static String getNewFileName(){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMddHHmm");
	    String now= sdf.format(new Date());
	    filekey++;
		return now+filekey;
	}
	
	
	/** 
     * 获取当前网络ip 
     * @param request 
     * @return 
     */  
    public static String getIpAddr(HttpServletRequest request){  
        String ipAddress = request.getHeader("x-forwarded-for");  
            if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {  
                ipAddress = request.getHeader("Proxy-Client-IP");  
            }  
            if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {  
                ipAddress = request.getHeader("WL-Proxy-Client-IP");  
            }  
            if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {  
                ipAddress = request.getRemoteAddr();  
                if(ipAddress.equals("127.0.0.1") || ipAddress.equals("0:0:0:0:0:0:0:1")){  
                    //根据网卡取本机配置的IP  
                    InetAddress inet=null;  
                    try {  
                        inet = InetAddress.getLocalHost();  
                    } catch (UnknownHostException e) {  
                        e.printStackTrace();  
                    }  
                    ipAddress= inet.getHostAddress();  
                }  
            }  
            //对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割  
            if(ipAddress!=null && ipAddress.length()>15){ //"***.***.***.***".length() = 15  
                if(ipAddress.indexOf(",")>0){  
                    ipAddress = ipAddress.substring(0,ipAddress.indexOf(","));  
                }  
            }  
            return ipAddress;   
    }
	
	/**
	 * 测试
	 * @param args
	 */
	public static void main(String[] args) {
		
	}
}
