package com.sample.test.coreprograms;

import java.util.Scanner;

//public class AutomorphicNum {
//
//	public static void main(String[] args) {
//	int num=6;
//	int square=num*num;
//	String s1=String.valueOf(num);
//	String s2=String.valueOf(square);
//	System.out.println(s2.endsWith(s1));
//	
//	}
//
//}
class Automorphic{
	public static void main(String[] args) {
		Scanner scanner=new Scanner(System.in);
		int num=scanner.nextInt();
		int square=num*num;
		String s1=String.valueOf(num);
		String s2=String.valueOf(square);
		System.out.println(s2.endsWith(s1));
	}
}