package com.sample.test.coreprograms;

public class Practice1 {

	public static void main(String[] args) {
		String str="Hello world";
		char[] ch=str.toCharArray();
		int c=0;
		for(Character a :ch) {
			
			c++;
		}
		System.out.println(c);
	}

}
