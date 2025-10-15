package com.sample.test.oops;

public class Automorphic {

	public static void main(String[] args) {
		int num=564;
		int square=num*num;
		String s1=String.valueOf(num);
		String s2=String.valueOf(square);
		System.out.println(s2.endsWith(s1)?"Anagram":"Not Anagram");
		
	}

}
