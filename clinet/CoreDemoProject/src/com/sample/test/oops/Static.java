package com.sample.test.oops;

public class Static {
	static void sound() {
		System.out.println("I am the static method from the parent class");
	}
}
	class Child extends Static{
		static void sound() {
			System.out.println("I am the static method from the child class");
		}
	}
	class Test{
		public static void main(String[] args) {
			Static sta=new Child();
			sta.sound();
			Child child=new Child();
			child.sound();
			
		}
	}
