package com.sample.test.oops;

public class Code {
	Code(){
		System.out.println("Java is a programming language");
	}
	Code(int a,int b){
		System.out.println(a+b);
	}
	Code(String c,String d){
		System.out.println(c+" "+d);
	}

	public static void main(String[] args) {
		Code code=new Code();
		Code code1=new Code(2,6);
		Code code2=new Code("Hi","Hello");

	}

}
