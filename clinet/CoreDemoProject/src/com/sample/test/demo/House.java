package com.sample.test.demo;
abstract class Flat{
	abstract void category(int a);
}
class Flat1 {
	void category(int a) {
		System.out.println(a);
	}
}


public class House extends Flat1 {

	public static void main(String[] args) {
		House house=new House();
		house.category(2);

	}

}
