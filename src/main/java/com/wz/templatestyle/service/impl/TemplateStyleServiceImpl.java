package com.wz.templatestyle.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.wz.mapper.TemplateStyleMapper;
import com.wz.model.TemplateStyle;
import com.wz.templatestyle.service.TemplateStyleService;
@Service
public class TemplateStyleServiceImpl implements TemplateStyleService {
	@Resource
	private TemplateStyleMapper templateStyleMapper;
	/**
	 * 查询所有风格
	 */
	@Override
	public List<TemplateStyle> selectAll() {
		// TODO Auto-generated method stub
		List<TemplateStyle> list=templateStyleMapper.selectAll();
		return list;
	}
	/**
	 * 删除风格
	 */
	@Override
	public void deleteById(int id) {
		// TODO Auto-generated method stub
		templateStyleMapper.deleteById(id);
		
	}
	/**
	 * 添加风格
	 */
	@Override
	public void save(TemplateStyle templateStyle) {
		// TODO Auto-generated method stub
		templateStyleMapper.insertSelective(templateStyle);
	}



}
