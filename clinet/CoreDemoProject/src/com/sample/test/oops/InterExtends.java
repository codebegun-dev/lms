package com.sample.test.oops;

public interface InterExtends {
 void address();
}
interface Student{

	void details();
}
interface Employee{

	void city();
}
interface Emnployee extends  InterExtends,Student{
	
}
class C implements Employee{
	public void address() {
	System.out.println("Address");
	}
	public void details() {
		System.out.println("Details");
	}
	 public void city(){
		System.out.println("City");
	}

public static void main(String args[]) {
	C c=new C();
	c.address();
	c.city();
	c.details();
}
}