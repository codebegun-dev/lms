package com.sample.test.oops;

public class FinalExcep {

	public static void main(String[] args) {
		 try {
	            System.out.println("In try");
	            int x = 10 / 0;  // ArithmeticException
	        } catch (Exception e) {
	            System.out.println("In catch: " + e);
	        } finally {
	            System.out.println("In finally");
	            int x = 10 / 0; 
	            //throw new RuntimeException("Exception from finally");
	        }
		System.out.println("dgf"); //unhandled exception
	}

}
