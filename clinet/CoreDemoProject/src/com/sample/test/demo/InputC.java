package com.sample.test.demo;

public class InputC extends Inputb{
	public void m4() {
		System.out.println("InputC----");
	}

	public static void main(String[] args) {
		
		
		InputC inputC=new InputC();
		inputC.m4();
		System.out.println(inputC.a);
		inputC.m1();
		inputC.m2();
	}

}
