package com.wz.trim.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.wz.mapper.TrimMapper;
import com.wz.model.Trim;
import com.wz.photoutil.Util;
import com.wz.trim.service.ITrimService;
@Service
public class TrimServiceImpl implements ITrimService {
	@Resource
	private TrimMapper trimMapper;

	@Override
	public List<Trim> select(Trim Trim) {
		
		return trimMapper.select(Trim);
	}

	@Override
	public int insertSelective(int trimType,MultipartFile[] files) {
		//文件保存
		for (MultipartFile file : files) {
			if(!file.isEmpty()){
				Trim trim = new Trim();
				trim.setTrimType(trimType);
				//旧名字
				String oldname= file.getOriginalFilename();
				//获取后缀 
				int opt=oldname.lastIndexOf(".");
				String ext=oldname.substring(opt); // .txt
				//新名字，唯一的
				String newfilename=Util.getNewFileName()+ext;
				String path = "D:\\upload\\"+newfilename;
				File newfilepath=new File(path);
				trim.setTrimPath(path);
				try {
					file.transferTo(newfilepath);
				} catch (IllegalStateException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				trim.setTrimNewfilename(newfilename);
				trim.setTrimOldfilename(oldname);
				trimMapper.insertSelective(trim);
			}else{
				return -1;
			}
		}
		
		return 1;
	}

	@Override
	public int updateByPrimaryKeySelective(Trim Trim) {
		// TODO Auto-generated method stub
		return trimMapper.updateByPrimaryKey(Trim);
	}

	@Override
	public int deleteByPrimaryKey(int id) {
		// TODO Auto-generated method stub
		return trimMapper.deleteByPrimaryKey(id);
	}

}
