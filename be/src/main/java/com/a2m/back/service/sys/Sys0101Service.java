package com.a2m.back.service.sys;

import java.util.List;

import com.a2m.back.model.resp.DataResponse;
import com.a2m.back.model.resp.UserResponse;
import com.a2m.back.model.sys.EmpDto;

/**
 * Author tiennd Created date 2023-07-17
 */
public interface Sys0101Service {
	int insert(EmpDto empDto) throws Exception;

	DataResponse diActiveUser(String USER_UID);

	DataResponse activeUser(String USER_UID);

	List<UserResponse> getListUserInfo(String status, String page, String search);

	List<UserResponse> getAllUserInfo(int size, String page, String search);

	List<UserResponse> searchByUserId(String userId);

	UserResponse getUserInfoByUserUid(String userUid);

	DataResponse getCountUser(String status, String search);

	DataResponse getCountAllUser(String search);
}
