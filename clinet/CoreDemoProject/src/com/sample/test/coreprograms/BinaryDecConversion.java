package com.sample.test.coreprograms;

import java.util.Scanner;

//public class BinaryDecConversion {
//
//	public static void main(String[] args) {
//		String binary="1010";
//		int decimal=Integer.parseInt(binary,2);
//		System.out.println(decimal);
//		int num=10;
//		String bin=Integer.toBinaryString(num);
//		System.out.println("Binary"+bin);
//
//	}
//
//}
class Binary{
	public static void main(String[] args) {
		Scanner scanner=new Scanner(System.in);
		System.out.println("Enter the binary value");
		String binary=scanner.next();
		int bin=Integer.parseInt(binary,2);
		System.out.println("The decimal equivalent is :"+bin);
		System.out.println("Enter the decimal value");
		int decimal=scanner.nextInt();
		String dec=Integer.toBinaryString(decimal);
		System.out.println("The binary eqivalent is :"+dec);
	}
}