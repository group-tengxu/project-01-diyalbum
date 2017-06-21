package com.wz.templateselect.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.wz.mapper.TemplateMapper;
import com.wz.model.Template;
import com.wz.photoutil.BasePaging;
import com.wz.templateselect.service.templateService;

@Service
public class templateServiceImpl implements templateService {
	@Resource
	private TemplateMapper templateMapper;
	/**
	 * 查询所有模板
	 */
	@Override
	public PageInfo<Template> selectAll(BasePaging bp) {
		// TODO Auto-generated method stub
		PageHelper.startPage(bp.getPageNum(),bp.getPageSize());
		List<Template> list =templateMapper.selectAll(bp);
		PageInfo<Template> info=new PageInfo<>(list);
		return info;
	}
	
	/**
	 * 根据风格查询模板
	 */
	@Override
	public PageInfo<Template> selectByTemplateStyle(BasePaging bp, int styleId) {
		// TODO Auto-generated method stub
		PageHelper.startPage(bp.getPageNum(),bp.getPageSize());
		List<Template> list =templateMapper.selectByTemplateStyle(bp,styleId);
		PageInfo<Template> info=new PageInfo<>(list);
		return info;
	}
	/**
	 * 根据id查询模板
	 */
	@Override
	public Template selectById(int id) {
		Template template=templateMapper.selectById(id);
		return template;
	}
	/**
	 * 根据ID删除模板
	 */
	@Override
	public void deleteById(int id) {
		templateMapper.deleteById(id);
		
	}
	/**
	 * 删除风格下所有模板
	 */
	@Override
	public void deleteByTemplateStyleId(int id) {
		// TODO Auto-generated method stub
		templateMapper.deleteByTemplateStyleId(id);
	}
	/**
	 * 保存模板
	 */
	@Override
	public void save(Template template) {
		// TODO Auto-generated method stub
		templateMapper.insertSelective(template);
	}

	
}
