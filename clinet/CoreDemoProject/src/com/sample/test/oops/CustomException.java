package com.sample.test.oops;

public class CustomException extends RuntimeException {
	public CustomException (String message) {
	super(message);

}
}
 class DemoCustom{
	public static void validateAge(int age) throws CustomException{
		throw new CustomException("Age must be 18 or older");
	}
	public static void checkEligibility() throws CustomException{
		validateAge(5);
	}
	public static void main(String[] args) {
		try {
			checkEligibility();
		}catch(CustomException e) {
			System.out.println("Caught custom exception" +e.getMessage());
		}
	}
}
