package com.test.sample.accessmodifiers;

 public class Test {
	protected int a=30;
	  protected void hello() {
		System.out.println("I am from hello");
	}

	public static void main(String[] args) {
		Test t=new Test();
		System.out.println(t.a);
		t.hello();
	}
}
