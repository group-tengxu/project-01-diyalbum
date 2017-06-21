package com.wz.controller;

import java.text.ParseException;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.github.pagehelper.PageInfo;
import com.wz.photoutil.BasePaging;
import com.wz.model.User;
import com.wz.photoutil.Util;
import com.wz.system.user.service.IUserService;

/**
 * 用户控制层
 * @author ‎qss	2017‎年‎6‎月‎19‎日
 *
 */
@Controller
@RequestMapping("/user")
public class UserController {

	@Resource
	private IUserService service;
	
	/**
	 * 查询所有用户
	 * @param map
	 * @param bp 分页参数
	 * @return
	 */
	@RequestMapping("/query")
	public String query(Map map,BasePaging bp) {
//		List<User> list = service.query();
		PageInfo<User> pageModel = service.PageHelper(bp);
		map.put("pageModel", pageModel);
		map.put("bp", bp);
		return "sys/user/userlist";
	}

	/**
	 * 删除用户
	 * @param id
	 * @return
	 */
	@RequestMapping("/delete")
	public String delete(Integer id) {
		service.delete(id);
		return "redirect:/user/query";
	}
	
	/**
	 * 1.到修改界面   
	 * 2.获取用户原来的数据 方便修改
	 * @param map
	 * @param id
	 * @return
	 */
	@RequestMapping("/update")
	public String update(Map map, Integer id) {
		User user = service.findById(id);
		String userdate = Util.getStringDate(user.getUserDate());
		map.put("user", user);
		map.put("userdate", userdate);
		return "sys/user/user";
	}

	/**
	 * 到添加界面
	 * @return
	 */
	@RequestMapping("/add")
	public String add() {
		return "sys/user/user";
	}
	/**
	 * 保存用户
	 * 若有ID就是修改 否则就是添加
	 * @param user
	 * @param userdate
	 * @return
	 */
	@RequestMapping("/save")
	public String save(User user, String userdate) {
//		若有ID就是修改 否则就是添加
		if (user.getUserId()!=null) {
			try {
				user.setUserDate(Util.getDate(userdate));
				System.out.println(user.getUserDate());
				service.update(user);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else{
			service.add(user);
		}
		return "redirect:/user/query";
	}

}
