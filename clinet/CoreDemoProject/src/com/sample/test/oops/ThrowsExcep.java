package com.sample.test.oops;

public class ThrowsExcep {

	public static void main(String[] args) throws ArithmeticException {
		int age=2;
		
		try{
			if(age<18) {
		
			throw new ArithmeticException();//"Enter the age above 18"
			}}
			catch(Exception e) {
				System.out.println("Caught exception "+e.getMessage());
			}
		}
	}


