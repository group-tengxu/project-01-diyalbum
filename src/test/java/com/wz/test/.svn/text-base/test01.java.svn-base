package com.wz.test;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wz.model.TrimType;
import com.wz.model.User;
import com.wz.system.user.service.IUserService;
import com.wz.trimtype.service.ITrimTypeService;

public class test01 {

	@Test
	public void selectTrimType() {
		ApplicationContext ac = new ClassPathXmlApplicationContext("spring/spring-config.xml");
		IUserService service = (IUserService) ac.getBean("userServiceImpl");
		ITrimTypeService trimTypeService =  ac.getBean(ITrimTypeService.class);
		TrimType trimType = new TrimType();
		trimType.setMemo("会话");
//		User user = service.findById(2);
//		System.out.println(user.getUserName());
		List<TrimType> list = trimTypeService.select(trimType);
		for (TrimType trimType2 : list) {
			System.out.println(trimType2.getMemo());
		}
	}

}
