package com.sample.test.coreprograms;

public class Parent {
int a=10;
}
class Child extends Parent{
	int a=20;
	void display() {
		System.out.println("Child a" +this.a);
		System.out.println("Parent a" +super.a);
	}
	public static void main(String[] args) {
	
		Child child=new Child();
		child.display();
		
	}
}