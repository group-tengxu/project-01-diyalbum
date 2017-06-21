package com.wz.system.menu.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.wz.mapper.MenuMapper;
import com.wz.photoutil.BasePaging;
import com.wz.model.Menu;
import com.wz.system.menu.service.IMenuService;

/**
 * 菜单服务层实现类
 * 
 * @author 2017
 *
 */
@Service
public class MenuServiceImpl implements IMenuService {

	@Resource
	private MenuMapper mapper;

	@Override
	public List<Menu> query(BasePaging bp) {
		// TODO Auto-generated method stub
		return mapper.query(bp);
	}

	@Override
	public Menu findById(int id) {
		// TODO Auto-generated method stub
		return mapper.selectByPrimaryKey(id);
	}

	@Override
	public void delete(int id) {

		// 查询当前删除记录的子集
		List<Integer> list = mapper.queryDeletePid(id);
		if (list.size() > 0) {
			for (Integer integer : list) {
				// 查询当前删除记录的子集下的子集
				list = mapper.queryDeletePid(integer);
				if (list.size() > 0) {
					mapper.deleteByPid(list);
				}
				// 删除当前记录的子集
				mapper.deleteByPrimaryKey(integer);

			}
		}
		// 删除当前记录
		mapper.deleteByPrimaryKey(id);

	}

	@Override
	public void update(Menu Menu) {
		// TODO Auto-generated method stub
		mapper.updateByPrimaryKeySelective(Menu);
	}

	@Override
	public void add(Menu Menu) {
		// TODO Auto-generated method stub
		mapper.insertSelective(Menu);
	}

	@Override
	public PageInfo<Menu> PageHelper(BasePaging bp) {
		// TODO Auto-generated method stub
		PageHelper.startPage(bp.getPageNum(), bp.getPageSize());
		return new PageInfo<>(mapper.query(bp));
	}

}
