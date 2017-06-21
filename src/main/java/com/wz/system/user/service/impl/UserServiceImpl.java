package com.wz.system.user.service.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.wz.exception.MyException;
import com.wz.mapper.UserMapper;
import com.wz.model.User;
import com.wz.photoutil.BasePaging;
import com.wz.photoutil.Util;
import com.wz.system.user.service.IUserService;

/**
 * 用户的服务层实现类
 * 
 * @author ‎qss 2017‎年‎6‎月‎19‎日
 *
 */
@Service
public class UserServiceImpl implements IUserService {

	@Resource
	private UserMapper mapper;

	@Override
	public List<User> query(BasePaging bp) {
		// TODO Auto-generated method stub
		return mapper.query(bp);
	}

	@Override
	public User findById(int id) {
		// TODO Auto-generated method stub
		return mapper.selectByPrimaryKey(id);
	}

	@Override
	public User login(String username, String pwd, HttpServletRequest request) throws MyException {
		User user = null;
		try {
			user = mapper.login(username);
		} catch (Exception e) {
			// TODO: handle exception
			throw new MyException("用户名有误");
		}
		if (pwd.equals(user.getUserPassword())) {
			user.setUserDate(new Date());// 最后登录时间
			user.setUserIp(Util.getIpAddr(request));// 客户端IP
			mapper.updateByPrimaryKeySelective(user);
			return user;
		} else {
			throw new MyException("密码有误");
		}
	}

	@Override
	public void delete(Integer id) {
		// TODO Auto-generated method stub
		mapper.deleteByPrimaryKey(id);
	}

	@Override
	public void update(User user) {
		// TODO Auto-generated method stub
		mapper.updateByPrimaryKeySelective(user);
	}

	@Override
	public void add(User user) {
		// TODO Auto-generated method stub
		mapper.insertSelective(user);
	}

	@Override
	public PageInfo<User> PageHelper(BasePaging bp) {
		// TODO Auto-generated method stub
		PageHelper.startPage(bp.getPageNum(), bp.getPageSize());
		return new PageInfo<>(mapper.query(bp));
	}

}
