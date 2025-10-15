package com.sample.test.oops;

public class ThrowDemo {
public static void divide(int a,int b) {
	if(b==0) {
	throw new ArithmeticException("/by zero");
}
System.out.println("Result :"+(a/b));
}
	public static void main(String[] args) {
//	int age=10;
//	if(age<18)
//		throw new ArithmeticException("Please enter your age above 18");
	try {
		int age=10;
	if(age<18)
		throw new ArithmeticException("Please enter your age above 18");

	//divide(10,0);
	}catch(ArithmeticException ae) {
		System.out.println("Caught Ecxception "+ae.getMessage());
	}
	}

}
