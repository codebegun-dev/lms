package com.sample.test.oops;
//Demonstrate method overriding using Animal -> Dog.
public class Animal1 {
	void sound() {
		System.out.println("All animals makes sounds");
	}
	void eat() {
		System.out.println("There are herbivorus and carnivorus animals");
	}

}
class Dog1 extends Animal1{
	void sound() {
		System.out.println("Dog sounds like bow-bow");
	}
	void eat() {
		System.out.println("Dog is a carnivorus animal");
	}
	public static void main(String[] args) {
		Dog1 dog=new Dog1();
		dog.sound();
		dog.eat();
	}
	
}
