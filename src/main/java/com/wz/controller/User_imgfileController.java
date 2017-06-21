package com.wz.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/user_imgfile")
public class User_imgfileController {
	
	@RequestMapping("/files")
	public String uploadfiles(MultipartFile[] files) throws IllegalStateException, IOException{
		File newfilepath = new File("D:\\uploadfile");
		//文件保存
		for (MultipartFile file : files) {
			if (file.isEmpty()) {
				String oldname  = file.getOriginalFilename();
				file.transferTo(newfilepath);
			}
		}
		
		return "";
	}
}
