package com.wz.test;

import java.util.List;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wz.model.User;
import com.wz.system.user.service.IUserService;

public class UserTest {

	@Test
	public void test() {
		ApplicationContext ac = new ClassPathXmlApplicationContext("spring/spring-config.xml");
		IUserService service = (IUserService) ac.getBean("userServiceImpl");
//		User user = service.findById(2);
//		System.out.println(user.getUserName());
		List<User> list = service.query(null);
		for (User user : list) {
			System.out.println(user.getUserName());
		}
	}

}
