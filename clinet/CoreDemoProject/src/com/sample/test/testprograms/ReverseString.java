package com.sample.test.testprograms;

public class ReverseString {

	public static void main(String[] args) {
		String str="Java";
		String rev="";
		for(int i=str.length()-1;i>=0;i--) {
			rev+=str.charAt(i);
		
		}
		System.out.println("Reversed string is " + rev);
    
	}

}
