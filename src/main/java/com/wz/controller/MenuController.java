package com.wz.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wz.model.Menu;
import com.wz.photoutil.BasePaging;
import com.wz.system.menu.service.IMenuService;

/**
 * 菜单控制层
 * 
 * @author ‎qss 2017‎年‎6‎月‎19‎日
 *
 */
@Controller
@RequestMapping("/menu")
public class MenuController {

	@Resource
	private IMenuService service;

	/**
	 * 查询所有菜单
	 * 
	 * @param map
	 * @param bp
	 *            分页参数
	 * @return
	 */
	@RequestMapping("/query")
	public String query(Map map, BasePaging bp) {
		 List<Menu> list = service.query(bp);
//		PageInfo<Menu> pageModel = service.PageHelper(bp);
//		map.put("pageModel", pageModel);
		map.put("list", list);
		map.put("bp", bp);
		return "sys/menu/menulist";
	}

	/**
	 * 删除菜单
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping("/delete/{id}")
	public String delete(@PathVariable()Integer id) {
		service.delete(id);
		return "redirect:/menu/query";
	}

	/**
	 * 1.到修改界面 2.获取菜单原来的数据 方便修改
	 * 
	 * @param map
	 * @param id
	 * @return
	 */
	@RequestMapping("/update")
	public String update(Map map, Integer id) {
		Menu menu = service.findById(id);
		// 查询所有
		List<Menu> menus = service.query(null);
		map.put("menus", menus);
		map.put("menu", menu);
		return "sys/menu/menu";
	}

	/**
	 * 到添加界面
	 * @param map
	 * @return
	 */
	@RequestMapping("/add")
	public String add(Map map) {
		// 查询所有
		List<Menu> menus = service.query(null);
		map.put("menus", menus);
		return "sys/menu/menu";
	}

	/**
	 * 保存菜单 若有ID就是修改 否则就是添加
	 * 
	 * @param menu
	 * @return
	 */
	@RequestMapping("/save")
	public String save(Menu menu) {
		// 若有ID就是修改 否则就是添加
		if (menu.getMenuId() != null) {
			service.update(menu);
		} else {
			service.add(menu);
		}
		return "redirect:/menu/query";
	}

}
