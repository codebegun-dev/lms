package com.sample.test.coreprograms;

public class PalindromeStr {

	public static void main(String[] args) {
		String str="madam";
		String rev= new StringBuilder(str).reverse().toString();
		System.out.println(str.equals(rev)?"Palindrome":"Not Palindrome");

}

}
