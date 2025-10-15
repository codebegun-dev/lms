package com.sample.test.demo;

public class ConsturctorDemo {
	ConsturctorDemo(){
		System.out.println(" I am from constructor.....");
	}
	 static int var1;

	public static void main(String[] args) {
		ConsturctorDemo constructordemo=new ConsturctorDemo();
	System.out.println(constructordemo.var1);

	}

}
