package com.sample.test.oops;

public class MultilLevel {
	void multilevel() {
		System.out.println("I am parent multilevel");
	}

}
class Child4 extends MultilLevel{
	void multilevel() {
		System.out.println("I am parent multilevel from child1");
	}
	void child1() {
		System.out.println("I am child1") ;
		
	}
}
class Child3 extends Child4{
	void child2() {
		System.out.println("I am from child2");
	}
}
class MainMulti{
	public static void main(String args[]) {
		Child3 child3=new Child3();
		child3.child1();
		child3.child2();
		child3.multilevel();
	}
}
