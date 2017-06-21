package com.wz.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.github.pagehelper.PageInfo;
import com.wz.model.Template;
import com.wz.photoutil.BasePaging;
import com.wz.templateselect.service.templateService;

/**
 * 模板选择控制层
 * @author 2017
 *
 */
@Controller
@RequestMapping("/templateSelect")
public class templateSelectController {
	@Resource
	private templateService templateService;
	/**
	 * 查找所有模板
	 * @param model
	 * @param bp
	 * @return
	 */
	@RequestMapping("/selectAll")
	public String selectAll(Model model,BasePaging bp){
		PageInfo<Template> list=templateService.selectAll(bp);
		model.addAttribute("list",list);
		model.addAttribute("bp",bp);
		System.out.println("------------------------------------------------------------");
		System.out.println("------------------------------------------------------------");
		System.out.println(list.getTotal());
		System.out.println("------------------------------------------------------------");
		System.out.println("------------------------------------------------------------");
		return "../diyalb";
	}
	/**
	 * 根据风格查询模板
	 * @param styleId
	 * @return
	 */
	@RequestMapping("/selectByTemplateStyle")
	public String selectByTemplateStyle(Model model,BasePaging bp,@PathVariable("")int styleId){
		PageInfo<Template> list=templateService.selectByTemplateStyle(bp,styleId);
		model.addAttribute("list",list);
		model.addAttribute("bp",bp);
		System.out.println("------------------------------------------------------------");
		System.out.println("------------------------------------------------------------");
		//System.out.println(list.getTotal());
		//有点问题
		System.out.println("------------------------------------------------------------");
		System.out.println("------------------------------------------------------------");
		return "../diyalb";
	}
	/**
	 * 查询单个模板
	 */
	@RequestMapping("/selectById")
	public String selectById(Model model,@PathVariable("")int id){
		Template template=templateService.selectById(id);
		model.addAttribute("PageModel",template);
		return "../diyalb";
	}
	/**
	 * 删除单个模板
	 */
	@RequestMapping("/deleteById")
	public String deleteById(int id){
		templateService.deleteById(id);
		return "templateSelect/selectByTemplateStyle";
	}
	
	/**
	 * 增加模板
	 */
	@RequestMapping("/save")
	public String save(Template template){
		templateService.save(template);
		return "../diyalb";
	}
	/**
	 * 跳转到添加模板界面
	 * @return
	 */
	@RequestMapping("/init")
	public String init(){
		
		return "template/template";
	}
}
