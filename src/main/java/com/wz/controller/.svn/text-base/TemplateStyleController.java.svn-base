package com.wz.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wz.model.TemplateStyle;
import com.wz.templateselect.service.templateService;
import com.wz.templatestyle.service.TemplateStyleService;
/**
 * 模板风格控制层
 * @author 2017
 *
 */
@Controller
@RequestMapping("/templateStyle")
public class TemplateStyleController {
	
	@Resource
	private TemplateStyleService templateStyleService;
	@Resource
	private templateService templateService;
	/**
	 * 查询风格
	 */
	@RequestMapping("/select")
	public String select(Model model){
		List<TemplateStyle> list=templateStyleService.selectAll();
		model.addAttribute("list",list);
		System.out.println("---------------------------------------------");
		System.out.println("---------------------------------------------");
		for (TemplateStyle templateStyle : list) {
			System.out.println(templateStyle);
		}
		System.out.println(model.toString());
		System.out.println("---------------------------------------------");
		System.out.println("---------------------------------------------");
		return "../diyalb";
	}
	/**
	 * 删除风格
	 */
	@RequestMapping("/deleteById")
	public String deleteById(@PathVariable("")int id){
		//删除风格
		templateStyleService.deleteById(id);
		//删除风格下所有模板
		templateService.deleteByTemplateStyleId(id);
		return "../diyalb";
	}
	/**
	 * 添加风格
	 */
	@RequestMapping("/save")
	public String save(TemplateStyle templateStyle){
		templateStyleService.save(templateStyle);
		return "../diyalb";
	}
	/**
	 * 跳转到添加风格界面
	 * @return
	 */
	@RequestMapping("/init")
	public String init(){
		
		return "templateStyle/templateStyle";
	}
	
	
}
