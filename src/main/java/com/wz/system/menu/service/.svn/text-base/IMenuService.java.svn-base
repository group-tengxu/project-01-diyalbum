package com.wz.system.menu.service;

import java.util.List;

import com.github.pagehelper.PageInfo;
import com.wz.photoutil.BasePaging;
import com.wz.model.Menu;

/**
 * 菜单服务层接口
 * @author ‎qss	2017‎年‎6‎月‎19‎日
 *
 */
public interface IMenuService {
	/**
	 * 查询所有菜单
	 * @param bp 分页关键字
	 * @return
	 */
	List<Menu> query(BasePaging bp);
	/**
	 * 查询单个
	 */
	Menu findById(int id);
	/**
	 * 删除菜单
	 * @param id
	 */
	void delete(int  id);
	/**
	 * 修改菜单
	 * @param Menu
	 */
	void update(Menu Menu);
	/**
	 * 添加菜单
	 * @param Menu
	 */
	void add(Menu Menu);
	/**
	 * 分页查询所有
	 * @param bp 分页参数
	 * @return
	 */
	PageInfo<Menu> PageHelper(BasePaging bp);
}
