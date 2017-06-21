package com.wz.trimtype.service;

import java.util.List;

import com.wz.model.TrimType;

public interface ITrimTypeService {
	List<TrimType> select(TrimType trimType);

	int insertSelective(TrimType trimType);

	int updateByPrimaryKeySelective(TrimType trimType);

	int deleteByPrimaryKey(int id);

	TrimType selectByPrimaryKey(Integer trimType);
}
