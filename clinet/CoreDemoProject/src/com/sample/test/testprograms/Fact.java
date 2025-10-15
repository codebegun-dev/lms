package com.sample.test.testprograms;

public class Fact {
	int factorial() {
		int  num=5,fact=1;
		for(int i=1;i<=num;i++) {
			fact=fact*i;
		
		}
		return fact;
		
	}

	public static void main(String[] args) {
		Fact f=new Fact();
		System.out.println(f.factorial());

	}

}
