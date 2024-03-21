package com.a2m.back.exception.exc;

public class CustomException extends Exception {
	private Object data;

	public CustomException(String message) {
		super(message);
	}

	public void setData(Object data) {
		this.data = data;
	}

	public Object getData() {
		return data;
	}
}
