package com.sample.test.oops;

import java.util.Scanner;

public class UncaughtExcp {

	public static void main(String[] args) {
		Scanner scanner=new Scanner(System.in);
		
		int result=0;
		try {
			int input1=scanner.nextInt();//unknown
			int input2=scanner.nextInt();//unknown
			result=input1/input2;
		}catch(ArithmeticException ae) {
			System.out.println("I am arithmetic exception");
		}catch(Exception e) {
			System.out.println("I am unknown exception");
		}finally {
			System.out.println("I am finally");
		}
		System.out.println(result);
	}

}
