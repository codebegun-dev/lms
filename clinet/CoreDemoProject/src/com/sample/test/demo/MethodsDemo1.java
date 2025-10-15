package com.sample.test.demo;
class Test{
	int mul() {
		return 4*5;
	}
}

public class MethodsDemo1 {
	int div() {
		Test test=new Test();
		return test.mul();
	}

	public static void main(String[] args) {
		MethodsDemo1 methodsDemo1=new MethodsDemo1();
		System.out.println(methodsDemo1.div());

	}

}
