package com.sample.test.demo;

public class MethodsDemo {
	static int add() {
		return 2+3;
	} 
	byte mul() {
	return 2*3;
}

	public static void main(String[] args) {
		System.out.println(add());
		MethodsDemo methodsdemo=new MethodsDemo();
		System.out.println(methodsdemo.mul());

	}

}
