package com.sample.test.oops;

import java.util.Scanner;

public class ExceptionDemo {

public static void main(String[] args) {
		Scanner scanner=new Scanner(System.in);
		int input1=scanner.nextInt();
		int input2=scanner.nextInt();
		int result=0;
		String str=null;
		try {
		result=input1/input2;
		//System.out.println(str.length());
		try {
			System.out.println(str.length());	
		}
		catch(NullPointerException e) {
		System.out.println("I am null pointer exception");
	}
		
		}catch(ArithmeticException ae){
			System.out.println("I am arithmetic  exception");
		
		}catch(Exception e) {
			System.out.println("I am unknown exception");
		}
		
		System.out.println(result);
	}
	
}
