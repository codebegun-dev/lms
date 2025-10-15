package com.test.sample.accessmodifiers;

public class Test2 extends Test {

	public void bye() {
		System.out.println("I a from bye");
	}
	public static void main(String[] args) {
		
		 Test2 t2=new  Test2();
		 
		 System.out.println(t2.a);
		 t2.hello();
		 t2.bye();
		 
	}

}
