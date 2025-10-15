package com.sample.test.coreprograms;

public class Palindrome {

	public static void main(String[] args) {
		int num=121,temp=num,rev=0;
		while(num>0) {
			int digit=num%10;
			rev=rev*10+digit;
			num/=10;
		}
		System.out.println(temp==rev?"Palindrome":"Not palindrome");

	}
	
}