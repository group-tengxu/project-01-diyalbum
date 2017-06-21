package com.wz.trimtype.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.wz.mapper.TrimTypeMapper;
import com.wz.model.TrimType;
import com.wz.trimtype.service.ITrimTypeService;
@Service
public class TrimTypeServiceImpl implements ITrimTypeService {
	@Resource
	private TrimTypeMapper trimTypeMapper;

	@Override
	public List<TrimType> select(TrimType trimType) {
		
		return trimTypeMapper.select(trimType);
	}

	@Override
	public int insertSelective(TrimType trimType) {
		
		return trimTypeMapper.insert(trimType);
	}

	@Override
	public int updateByPrimaryKeySelective(TrimType trimType) {
		
		return trimTypeMapper.updateByPrimaryKeySelective(trimType);
	}

	@Override
	public int deleteByPrimaryKey(int id) {
		
		return trimTypeMapper.deleteByPrimaryKey(id);
	}

	@Override
	public TrimType selectByPrimaryKey(Integer trimtypeId) {
		// TODO Auto-generated method stub
		return trimTypeMapper.selectByPrimaryKey(trimtypeId);
	}

}
