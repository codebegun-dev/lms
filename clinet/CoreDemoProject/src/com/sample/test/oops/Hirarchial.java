package com.sample.test.oops;

public class Hirarchial {
	void hirarchial() {
		System.out.println("I am from hirarchial");
	}
}
	class Child1 extends Hirarchial{
		void hirarchial() {
			System.out.println("I am hirarchial from child1");
		}
		void child() {
			System.out.println("Ia ma child from child1");
		}
	}
	class Child2 extends Hirarchial{
		void hirarchial() {
			System.out.println("I am hirarchial from child2");
		}
		void child1() {
			System.out.println("I am child from child2");
		}
	}
	class Demo{
		public static void main(String args[]) {
			 Hirarchial child1=new Child1();
			 child1.hirarchial();
			 Hirarchial child2=new Child2();
			 child2.hirarchial();
			 
			 }
		}
	


