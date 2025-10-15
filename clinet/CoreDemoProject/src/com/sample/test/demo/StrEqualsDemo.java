package com.sample.test.demo;

public class StrEqualsDemo {

	public static void main(String[] args) {
		String str="Coding";
		String str1="Coding";
		String str2=new String("Hello");
		String str3=new String("Hello");
		System.out.println(str2==str3);
		System.out.println(str2.equals(str3));
		System.out.println(str==str1);
		System.out.println(str.equals(str1));
	
		

	}

}
