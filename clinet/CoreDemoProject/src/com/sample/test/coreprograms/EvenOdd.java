package com.sample.test.coreprograms;

import java.util.Scanner;

//public class EvenOdd {
//
//	public static void main(String[] args) {
//		int a=20;
//		if(a%2==0)
//			System.out.println("Even number");
//		else
//			System.out.println("Odd Number");
//	}
//
//}
class Even1{
	public static void main(String[] args) {
		Scanner scanner=new Scanner(System.in);
	System.out.println("Enter the number :");
		int num=scanner.nextInt();
		if(num%2==0) {
			System.out.println("Even number");
		}else {
			System.out.println("Odd number");
		}
		
	}
	
}
