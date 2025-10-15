package com.sample.test.demo;

public class ConstInitialize {
	int a; int b;int c;
	ConstInitialize(int c){
		this.c=c;
		System.out.println(c);
	}
	ConstInitialize(int a,int b){
		this.a=a;
		this.b=b;
		System.out.println(a+b);
	}
	
	public static void main(String[] args) {
		ConstInitialize ci=new ConstInitialize(3,5);
		ConstInitialize ci1=new ConstInitialize(5);
				

	}

}
