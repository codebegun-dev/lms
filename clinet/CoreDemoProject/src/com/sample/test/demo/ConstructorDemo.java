package com.sample.test.demo;

public class ConstructorDemo {
	int a;
	
	ConstructorDemo(int a){
		a=10;
		
	}

	public static void main(String[] args) {
		ConstructorDemo cd=new ConstructorDemo(2);
		System.out.println(cd.a);

	}

}
