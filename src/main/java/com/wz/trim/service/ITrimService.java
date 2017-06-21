package com.wz.trim.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.wz.model.Trim;

public interface ITrimService {
	List<Trim> select(Trim Trim);

	int insertSelective(int trimType,MultipartFile[] file);

	int updateByPrimaryKeySelective(Trim Trim);

	int deleteByPrimaryKey(int id);
}
