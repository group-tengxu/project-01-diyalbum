package com.wz.controller;


import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.wz.model.Trim;
import com.wz.model.TrimType;
import com.wz.trim.service.ITrimService;
import com.wz.trimtype.service.ITrimTypeService;
/**
 * 饰件类别的增删查改
 * 
 * @author 2017
 *
 */
@Controller
@RequestMapping("/trim")
public class TrimController{
	@Resource
	private ITrimService trimService;
	@Resource
	private ITrimTypeService trimTypeService;
	
	@RequestMapping(value="/upload")
	private String upload(){
		return "trim/upload";
	}
	
	@RequestMapping("/select")
	public String select(Trim Trim,Model model){
		List<com.wz.model.Trim> trimlist = trimService.select(Trim);
		model.addAttribute("trimlist", trimlist);
		return "trim/trim_home";
	}
	
	@RequestMapping("/getInsertData")
	public String getInsertData(Trim Trim,Model model){
		TrimType trimType = trimTypeService.selectByPrimaryKey(Trim.getTrimType());
		model.addAttribute("trimType", trimType);
		return "trim/insert";
	}
	
	@RequestMapping("/insert")
	public String insert(int trimType,Model model,MultipartFile[] files){
		
		int result = trimService.insertSelective(trimType,files);
		if(result==-1){
			
			return "redirect:/trimType/getUpdateData";
		}else{
			
			return "redirect:/trimType/getUpdateData";
		}
		
	}
	
	@RequestMapping("/getUpdateData")
	public String getUpdateData(Trim trim,Model model){
		
		return "trim/update";
	}
	
	@RequestMapping("/update")
	public String updateTrimType(Trim trim,Model model){
		
		return "redirect:/trim/select";
	}
	
	@RequestMapping("/delete")
	public String deleteTrimType(int id,Model model){
		
		return "redirect:/trim/select";
	}

	
	
}
