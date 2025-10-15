package com.sample.test.coreprograms;

import java.util.Scanner;

//
//public class Fibanocci {
//
//	public static void main(String[] args) {
//		int n=10,a=0,b=1;
//		System.out.print(a +" "+b);
//		for(int i=2;i<n;i++) {
//			int c=a+b;
//		System.out.print(" "+c);
//		a=b;
//		b=c;
//}
//		
//	}
//
//}
class Fib{
	public static void main(String[] args) {
		int a=0,b=1;
		Scanner scanner=new Scanner(System.in);
		System.out.println("Enter the number");
		int num=scanner.nextInt();
		System.out.print(a+" "+b);
		for(int i=2;i<=num;i++) {
			int c=a+b;
			System.out.print(" "+c);
			a=b;
			b=c;
		}
		
	}
}