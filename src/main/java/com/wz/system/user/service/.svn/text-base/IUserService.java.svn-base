package com.wz.system.user.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.github.pagehelper.PageInfo;
import com.wz.exception.MyException;
import com.wz.model.User;
import com.wz.photoutil.BasePaging;
/**
 * 用户的服务层接口
 * @author ‎qss	2017‎年‎6‎月‎19‎日
 *
 */
public interface IUserService {
	/**
	 * 查询所有用户
	 * @param bp 分页关键字
	 * @return
	 */
	List<User> query(BasePaging bp);
	/**
	 * 查询单个
	 */
	User findById(int id);
	/**
	 * 登录
	 * @param username
	 * @param pwd
	 * @param request 用于获取IP地址
	 * @return
	 * @throws MyException
	 */
	User login(String username, String pwd,HttpServletRequest request) throws MyException;
	/**
	 * 删除用户
	 * @param id
	 */
	void delete(Integer id);
	/**
	 * 修改用户
	 * @param user
	 */
	void update(User user);
	/**
	 * 添加用户
	 * @param user
	 */
	void add(User user);
	/**
	 * 分页查询所有
	 * @param bp 分页参数
	 * @return
	 */
	PageInfo<User> PageHelper(BasePaging bp);
}

