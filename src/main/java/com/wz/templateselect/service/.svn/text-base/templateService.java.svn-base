package com.wz.templateselect.service;

import com.github.pagehelper.PageInfo;
import com.wz.model.Template;
import com.wz.photoutil.BasePaging;

public interface templateService {
	/**
	 * 查询所有模板
	 * @param bp
	 * @return
	 */
	PageInfo<Template> selectAll(BasePaging bp);
	/**
	 * 根据风格查询
	 * @param bp
	 * @param styleId
	 * @return
	 */
	PageInfo<Template> selectByTemplateStyle(BasePaging bp, int styleId);
	/**
	 * 根据ID查询
	 * @param id
	 * @return
	 */
	Template selectById(int id);
	/**
	 * 根据ID删除模板
	 * @param id
	 */
	void deleteById(int id);
	/**
	 * 删除风格下所有模板
	 * @param id
	 */
	void deleteByTemplateStyleId(int id);
	/**
	 * 保存模板
	 * @param template 
	 */
	void save(Template template);
}
