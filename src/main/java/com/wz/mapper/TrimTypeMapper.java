package com.wz.mapper;

import java.util.List;

import com.wz.model.TrimType;

public interface TrimTypeMapper {
    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table ph_ornament_type
     *
     * @mbggenerated
     */
    int deleteByPrimaryKey(Integer trimtypeId);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table ph_ornament_type
     *
     * @mbggenerated
     */
    int insert(TrimType record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table ph_ornament_type
     *
     * @mbggenerated
     */
    int insertSelective(TrimType record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table ph_ornament_type
     *
     * @mbggenerated
     */
    TrimType selectByPrimaryKey(Integer trimtypeId);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table ph_ornament_type
     *
     * @mbggenerated
     */
    int updateByPrimaryKeySelective(TrimType record);

    /**
     * This method was generated by MyBatis Generator.
     * This method corresponds to the database table ph_ornament_type
     *
     * @mbggenerated
     */
    int updateByPrimaryKey(TrimType record);

	List<TrimType> select(TrimType trimType);

	int delete(int id);
}