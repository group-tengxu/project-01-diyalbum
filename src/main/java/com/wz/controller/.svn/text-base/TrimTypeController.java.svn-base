package com.wz.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

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
@RequestMapping("/trimType")
public class TrimTypeController {
	
	@Resource
	private ITrimTypeService trimTypeService;
	@Resource
	private ITrimService trimService;
	
	@RequestMapping("/select")
	public String select(TrimType trimType,Model model){
		List<TrimType> trimTypeList = trimTypeService.select(trimType);
		model.addAttribute("trimTypeList", trimTypeList);
		return "trimType/trim_home";
	}
	
	@RequestMapping("/getInsertData")
	public String getInsertData(){
		return "trimType/insert";
	}
	
	@RequestMapping("/insert")
	public String insert(TrimType trimType,Model model){
		trimTypeService.insertSelective(trimType);
		return "redirect:/trimType/select";
	}
	
	@RequestMapping("/getUpdateData")
	public String getUpdateData(TrimType trimType,Trim Trim,Model model){
		System.out.println(trimType.getTrimtypeId()+"--"+trimType.getMemo());
		model.addAttribute("trimType",trimType);
		List<com.wz.model.Trim> trimlist = trimService.select(Trim);
		model.addAttribute("trimlist", trimlist);
		return "trimType/update";
	}
	
	@RequestMapping("/update")
	public String updateTrimType(TrimType trimType,Model model){
		System.out.println(trimType.getTrimtypeId()+"--"+trimType.getMemo());
		trimTypeService.updateByPrimaryKeySelective(trimType);
		return "redirect:/trimType/select";
	}
	
	@RequestMapping("/delete")
	public String deleteTrimType(int id,Model model){
		trimTypeService.deleteByPrimaryKey(id);
		return "redirect:/trimType/select";
	}
	
}
