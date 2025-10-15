package com.sample.test.coreprograms;

public class Reverse {

	public static void main(String[] args) {
//		int num=1234,rev=0;
//		while(num!=0) {
//			int digit=num%10;
//			rev=rev*10+digit;
//			num/=10;
//		}
//		System.out.println("Reversed"+rev);
	
	int num=5654,rev=0;
	while(num!=0) {
		int digit=num%10;
		rev=rev*10+digit;
		num/=10;
	}
	System.out.println("Reversed number:"+rev);
	}

}
