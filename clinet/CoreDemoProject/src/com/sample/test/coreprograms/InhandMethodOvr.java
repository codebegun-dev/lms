package com.sample.test.coreprograms;

public class InhandMethodOvr {
	void animal() {
		System.out.println("I am from parent class");
	}
	}
	class Method extends InhandMethodOvr{
		void animal() {
			System.out.println("I am from child class");
		}
		void dog() {
			System.out.println("Dog is a pet animal");
		}
		public static void main(String[] args) {
			Method method=new Method();
			InhandMethodOvr method1=new InhandMethodOvr();
			method.animal();
			method.dog();
			method1.animal();
		
	}
	}

